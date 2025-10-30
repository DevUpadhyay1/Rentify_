import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Route requires auth but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    toast.warning('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Route is for non-authenticated users only (login/signup)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;