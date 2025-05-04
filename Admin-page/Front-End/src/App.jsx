import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminHome from './components/AdminHome';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import UserList from './components/UserList';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/add-product" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path="*" element={<LoginPage />} /> {/* fallback route */}
      </Routes>
    </Router>
  );
}

export default App;
