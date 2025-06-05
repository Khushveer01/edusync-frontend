import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'Student' ? '/student' : '/instructor'} replace />;
  }

  return typeof children === 'function' ? children({ user }) : children;
};

export default PrivateRoute; 