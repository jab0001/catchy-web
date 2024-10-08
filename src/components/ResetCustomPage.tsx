import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const query = new URLSearchParams(useLocation().search);
  const oobCode = query.get('oobCode');
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!oobCode) {
      setError("Invalid reset code.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password has been reset successfully.");
      navigate("/login");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter new password"
        disabled={loading}
        className="password-input"
      />
      <button onClick={handlePasswordReset} disabled={loading || !newPassword} className="reset-button">
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );
};

export default ResetPasswordPage;