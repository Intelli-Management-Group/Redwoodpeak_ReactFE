import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
  return localStorage.getItem('userToken') !== null;
};

const AuthProtectedRoute = ({ element }) => {
  const location = useLocation();
  // console.log(location,"location test")

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default AuthProtectedRoute;
