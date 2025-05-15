import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome to Admin Dashboard</h2>
        <p style={styles.subtitle}>You are logged in successfully!</p>

        <div style={styles.buttonGroup}>
          <Link to="/add-product" style={styles.button}>Add Product</Link>
          <Link to="/products" style={styles.button}>Product List</Link>
          <Link to="/users" style={styles.button}>User List</Link>
        </div>
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
    backgroundColor: '#fff',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fc8019',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#fc8019',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
};

export default AdminHome;
