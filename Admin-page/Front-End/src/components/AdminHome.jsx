import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '0.5rem' }}>
        Welcome to Admin Dashboard
      </h2>
      <p style={{ fontSize: '1rem', color: '#555', marginBottom: '1.5rem' }}>
        You are logged in successfully!
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/add-product" style={linkStyle}>Add Product</Link>
        <Link to="/products" style={linkStyle}>Product List</Link>
        <Link to="/users" style={linkStyle}>User List</Link>
      </div>
    </div>
  );
};

const linkStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '0.6rem 1.2rem',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '0.95rem',
  transition: 'background-color 0.3s',
};

export default AdminHome;
