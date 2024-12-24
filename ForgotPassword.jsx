import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error: ' + error.response.data);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error: ' + error.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', { email, newPassword });
      setMessage(response.data);
    } catch (error) {
      setMessage('Error: ' + error.response.data);
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      
      <form onSubmit={handleForgotPassword}>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send OTP</button>
      </form>

      <form onSubmit={handleVerifyOtp}>
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>

      <form onSubmit={handleResetPassword}>
        <div>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
