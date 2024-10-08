import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { PasswordResetStyle } from "./styledComponents/PasswordResetPageStyle"
import { InputStyle } from "./styledComponents/ForAllStyle";
import YellowHalf from "../assets/img/yellowhalf.png";

const PasswordResetPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSentReset, setIsSentReset] = useState<boolean>(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email has been sent. Please check your inbox.");
      setIsSentReset(true);

    } catch (error) {
      setError("Failed to send password reset email. Please check the email address and try again.");
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PasswordResetStyle>
      <h2 className="title">Password Reset</h2>
      <div className="container">
        <p className="text">Enter your email, we will
          send you password recovery link.</p>
        <InputStyle
          className="input"
          style={error ? { borderColor: 'red', margin: "0" } : { borderColor: '#147FC2' }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onClick={() => setError('')}
          placeholder="Enter your email"
          disabled={loading}
        />
        {message && <p className="text" style={{ color: "green", marginTop: "10px" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {isSentReset ? <button className="button" onClick={() => navigate('/login')}>
        Back to login page
      </button> : <button className="button" onClick={handlePasswordReset} disabled={loading || !email}>
        {loading ? "Sending..." : "Send"}
      </button>}
      <img className="img-reset" alt="background" src={YellowHalf}/>
    </PasswordResetStyle>
  );
};

export default PasswordResetPage;