import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const rawRole = (role || user.role || 'Volunteer').toLowerCase().trim();
  const normalizedUserRole = (rawRole === 'administrator' || rawRole === 'admin') ? 'admin' : rawRole;

  const normalizedAllowed = allowedRoles
    ? allowedRoles.map(r => {
        const str = r.toLowerCase().trim();
        return (str === 'administrator' || str === 'admin') ? 'admin' : str;
      })
    : [];

  if (allowedRoles && !normalizedAllowed.includes(normalizedUserRole)) {
    // Redirect user to their own authorized dashboard
    if (normalizedUserRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (normalizedUserRole === 'citizen') {
      return <Navigate to="/citizen/dashboard" replace />;
    }
    return <Navigate to="/volunteer/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}
