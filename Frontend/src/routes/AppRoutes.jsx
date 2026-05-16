import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';
import NotFound from '../pages/errors/NotFound';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes for future implementation */}
        <Route path="/auth" element={<div>Auth Pages coming soon...</div>} />
        <Route path="/citizen" element={<div>Citizen Pages coming soon...</div>} />
        <Route path="/volunteer" element={<div>Volunteer Pages coming soon...</div>} />
        {/* We do NOT handle the global 404 here inside MainLayout if we want /admin/* to be handled, OR we handle it as * but order matters. Let's just put * at the very end outside or keep it here. Actually, if we put * here, it might swallow /admin. React Router v6 is smart about scoring, so it should be fine. */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes Module */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
