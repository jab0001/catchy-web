import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { auth, database } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

const cardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontSize: '20px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

const api = process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';

// Публичный ключ Stripe
const stripePromise = loadStripe(api);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Создание платежного метода
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement)!,
        billing_details: {
          address: {
            country,
            postal_code: postalCode,
          },
        },
      });

      if (error) {
        console.error('Payment error:', error);
        setLoading(false);
        return;
      }

      // Запрос к вашему серверу для создания PaymentIntent
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: 1000,  // Сумма в центах
          country,
          postalCode 
        }),
      });
      const { clientSecret } = await response.json();

      // Подтверждение платежа
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        setLoading(false);
        return;
      }

      // Успешная оплата
      if (auth.currentUser) {
        const userRef = ref(database, `users/${auth.currentUser.uid}`);
        await update(userRef, {
          subscriptionPaid: true,
        });
        setPaymentStatus(true);
        navigate("/");
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <label>Country</label>
        <input 
          type="text" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
          required
          placeholder="Country"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Postal Code</label>
        <input 
          type="text" 
          value={postalCode} 
          onChange={(e) => setPostalCode(e.target.value)} 
          required
          placeholder="Postal Code"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Card Number</label>
        <CardNumberElement options={cardElementOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Expiry Date</label>
        <CardExpiryElement options={cardElementOptions} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>CVC</label>
        <CardCvcElement options={cardElementOptions} />
      </div>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Make Payment'}
      </button>
      {paymentStatus && <p>Payment successful! Your subscription is now active.</p>}
    </form>
  );
};

const PaymentPage: React.FC = () => {
  return (
    <div>
      <h1>Payment Page</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default PaymentPage;