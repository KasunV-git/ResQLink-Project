import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/public/Home';
import AdminPlaceholder from '../pages/admin/AdminPlaceholder';
import NotFound from '../pages/errors/NotFound';
import AdminLayout from '../layouts/AdminLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes for future implementation */}
        <Route path="/auth" element={<div>Auth Pages coming soon...</div>} />
        <Route path="/citizen" element={<div>Citizen Pages coming soon...</div>} />
        <Route path="/volunteer" element={<div>Volunteer Pages coming soon...</div>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPlaceholder />} />
        <Route path="disasters" element={<AdminPlaceholder />} />
        <Route path="volunteers" element={<AdminPlaceholder />} />
        <Route path="resources" element={<AdminPlaceholder />} />
        <Route path="alerts" element={<AdminPlaceholder />} />
        <Route path="ai-analysis" element={<AdminPlaceholder />} />
        <Route path="reports" element={<AdminPlaceholder />} />
        <Route path="profile" element={<AdminPlaceholder />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
