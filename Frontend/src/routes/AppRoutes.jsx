import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';
import NotFound from '../pages/errors/NotFound';
import AdminRoutes from './AdminRoutes';
import { isAuthenticated } from '../services/authService';

// Login page is standalone — no admin layout wrapper
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));

// Redirect already-authenticated admins away from the login page
const AlreadyAuthed = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public / Main layout routes ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes for future implementation */}
        <Route path="/auth" element={<div>Auth Pages coming soon...</div>} />
        <Route path="/citizen" element={<div>Citizen Pages coming soon...</div>} />
        <Route path="/volunteer" element={<div>Volunteer Pages coming soon...</div>} />
      </Route>

      {/* ── Admin Login — standalone, no AdminLayout ── */}
      <Route
        path="/admin/login"
        element={
          <AlreadyAuthed>
            <Suspense fallback={<div className="min-h-screen bg-indigo-950 flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" /></div>}>
              <AdminLogin />
            </Suspense>
          </AlreadyAuthed>
        }
      />

      {/* ── Admin Routes Module ── */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* ── Global 404 — must be LAST and outside all layout groups ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
