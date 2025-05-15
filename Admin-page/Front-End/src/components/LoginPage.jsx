// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/check-auth', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          navigate('/admin'); // Redirect to admin page if authenticated
        }
      });
  }, [navigate]);

  const sendOtp = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

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
      alert(data.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (!email || !otp) {
      alert('Please fill both email and OTP');
      return;
    }

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
      alert(data.message || 'OTP verification failed');
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
    </div>
  );
};

export default LoginPage;
