import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  const getRoleRedirectPath = (role) => {
    if (role === 'superadmin' || role === 'admin') return '/admin';
    if (role === 'instructor') return '/instructor';
    return '/dashboard';
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.requiresPasswordChange) {
    return <Navigate to="/force-change-password" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  return <>{children}</>;
};
