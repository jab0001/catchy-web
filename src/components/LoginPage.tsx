import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, database } from "../firebaseConfig";
import { ref, set } from "firebase/database";
import { LoginStyle } from "./styledComponents/LoginPageStyle";
import { InputStyle } from "./styledComponents/ForAllStyle";
import RedCircle from "../assets/img/redhalf.png";

interface LoginProps {
    isRegisterFirst: boolean;
}

const LoginPage: React.FC<LoginProps> = ({ isRegisterFirst }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(isRegisterFirst);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [showResendVerification, setShowResendVerification] = useState<boolean>(false);
    const navigate = useNavigate();

    const isValidEmail = (email: string) => {
        // Simple regex to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateForm = () => {
        if (!isValidEmail(email)) {
            setError("Invalid email address.");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return; // Validate form before submission

        setLoading(true);
        setError(null);
        setShowResendVerification(false);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (userCredential.user.emailVerified) {
                navigate("/");
            } else {
                setError("Please verify your email before logging in.");
                setShowResendVerification(true); // Show resend verification button
            }
        } catch (error: any) {
            setError(error.code); // Display error message
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!validateForm()) return; // Validate form before submission

        setLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user); // Send email verification

            await set(ref(database, 'users/' + userCredential.user.uid), {
                email: email,
                subscriptionPaid: false  // Default to unpaid subscription
            });

            setEmailSent(true); // Flag to show email sent notification
        } catch (error: any) {
            setError(error.code); // Display error message
        } finally {
            setLoading(false);
        }
    };

    const resendVerificationEmail = async () => {
        setLoading(true);
        setError(null);
        setShowResendVerification(false);

        try {
            const user = auth.currentUser;
            if (user) {
                await sendEmailVerification(user);
                setEmailSent(true); // Flag to show email sent notification
                setError("Verification email sent again! Please check your inbox.");
            } else {
                setError("No user is currently signed in.");
            }
        } catch (error: any) {
            setError("Failed to resend verification email. Please try again.");
            console.error("Resend verification email error:", error);
        } finally {
            setLoading(false);
        }
    };

    const goBackHandler = () => {
        setIsRegistering(false);
        setEmailSent(false);
        setError(null);
        navigate('/login');
    };

    return (
        <LoginStyle style={emailSent ? { padding: '0', paddingTop: '36px' } : {}}>
            <h2 className="title">{isRegistering ? (emailSent ? " Email Verification" : "Let’s get started!") : (emailSent ? " Email Verification" : "Welcome back!")}</h2>
            {emailSent && <div style={{ height: '100%', alignItems: "center", justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}><p className="text" style={{  marginTop: 'auto', marginBottom: 'auto' }}>Please follow the link that we sent on your email.</p><button className="button enter" onClick={goBackHandler}>Go back to login</button><img className="img-verify" alt="background" src={RedCircle} /></div>}

            {!emailSent && (
                <>
                    <div className="container">
                        <InputStyle
                            className="input"
                            style={error ? { borderColor: 'red', margin: "0" } : { borderColor: '#147FC2' }}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onClick={() => setError('')}
                            placeholder="Email"
                            disabled={loading}
                        />
                        {error && <p style={{ color: "red", maxHeight: "20px" }}>{error}</p>}
                        <InputStyle
                            className="input"
                            style={error ? { borderColor: 'red', margin: "0" } : { borderColor: '#147FC2' }}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onClick={() => setError('')}
                            placeholder="Password"
                            disabled={loading}
                        />
                        <button className="switch" onClick={() => { setIsRegistering(!isRegistering); setError(null); setEmail(''); setPassword('') }} disabled={loading}>
                            {isRegistering ? "Already have an account? Login" : "No account yet ? Register here."}
                        </button>
                        {!isRegistering && <button className="forget" onClick={() => navigate('/reset-password')} disabled={loading}>
                            Forget Password?
                        </button>}
                    </div>
                    <button className="button enter" onClick={isRegistering ? handleRegister : handleLogin} disabled={loading}>
                        {loading ? "Processing..." : isRegistering ? "Register" : "Log in"}
                    </button>
                    {showResendVerification && (
                        <button className="button resend" onClick={resendVerificationEmail} disabled={loading}>
                            Resend Verification
                        </button>
                    )}
                </>
            )}
        </LoginStyle>
    );
};

export default LoginPage;