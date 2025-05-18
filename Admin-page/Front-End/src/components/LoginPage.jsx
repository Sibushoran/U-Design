import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://u-design-1.onrender.com/api/check-auth', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          navigate('/admin');
        }
      });
  }, [navigate]);

  const sendOtp = async () => {
    if (!email) return alert('Please enter your email');

    const res = await fetch('https://u-design-1.onrender.com/api/send-otp', {
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
    if (!email || !otp) return alert('Please fill both email and OTP');

    const res = await fetch('https://u-design-1.onrender.com/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
      credentials: 'include',
    });

    const data = await res.json();
    if (res.ok) {
      alert('OTP verified successfully!');
      navigate('/admin');
    } else {
      alert(data.message || 'OTP verification failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Login with your email to access the admin portal</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {!otpSent ? (
          <button onClick={sendOtp} style={styles.button}>Send OTP</button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />
            <button onClick={verifyOtp} style={styles.button}>Verify OTP</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fff7f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    fontFamily: 'Lato, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fc8019',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '10px',
    border: '1px solid #ddd',
    marginBottom: '1rem',
    outline: 'none',
    transition: 'border 0.3s',
  },
  button: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#fc8019',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
};

export default LoginPage;
