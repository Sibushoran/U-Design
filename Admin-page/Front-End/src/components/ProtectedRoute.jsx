import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('https://u-design-1.onrender.com/api/check-auth', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>; // Or a spinner

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
