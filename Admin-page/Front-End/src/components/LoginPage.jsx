import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/check-auth', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          navigate('/admin'); // Redirect to admin page if authenticated
        }
      })
      .catch(err => {
        console.error('Error checking authentication:', err);
      });
  }, [navigate]);

  // Send OTP to user's email
  const sendOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }
    setErrorMessage(''); // Clear previous errors

    try {
      const res = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setOtpSent(true);
      } else {
        setErrorMessage(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Error sending OTP. Please try again.');
    }
  };

  // Verify OTP entered by user
  const verifyOtp = async () => {
    if (!email || !otp) {
      setErrorMessage('Please fill both email and OTP');
      return;
    }
    setErrorMessage(''); // Clear previous errors

    try {
      const res = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        alert('OTP verified successfully!');
        navigate('/admin'); // Redirect to admin page after OTP verification
      } else {
        setErrorMessage(data.message || 'OTP verification failed');
        setOtp(''); // Clear OTP field if verification fails
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('Error verifying OTP. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Email OTP Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem' }}
      />
      {!otpSent ? (
        <button onClick={sendOtp}>Send OTP</button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ display: 'block', marginTop: '1rem', marginBottom: '1rem' }}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {errorMessage && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <strong>{errorMessage}</strong>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
