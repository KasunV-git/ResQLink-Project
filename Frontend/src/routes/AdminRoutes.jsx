import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { isAuthenticated } from '../services/authService';

// Lazy loaded admin pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const DisasterReports = lazy(() => import('../pages/admin/DisasterReports'));
const VolunteerManagement = lazy(() => import('../pages/admin/VolunteerManagement'));
const ResourceManagement = lazy(() => import('../pages/admin/ResourceManagement'));
const AlertsManagement = lazy(() => import('../pages/admin/AlertsManagement'));
const AIAnalysis = lazy(() => import('../pages/admin/AIAnalysis'));
const ReportsAnalytics = lazy(() => import('../pages/admin/ReportsAnalytics'));
const Profile = lazy(() => import('../pages/admin/Profile'));
const NotFound = lazy(() => import('../pages/errors/NotFound'));

// Loading fallback
const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
  </div>
);

// Auth guard — redirects to login if no session token exists
const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route 
          index 
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } 
        />
        <Route 
          path="disasters" 
          element={
            <Suspense fallback={<PageLoader />}>
              <DisasterReports />
            </Suspense>
          } 
        />
        <Route 
          path="volunteers" 
          element={
            <Suspense fallback={<PageLoader />}>
              <VolunteerManagement />
            </Suspense>
          } 
        />
        <Route 
          path="resources" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ResourceManagement />
            </Suspense>
          } 
        />
        <Route 
          path="alerts" 
          element={
            <Suspense fallback={<PageLoader />}>
              <AlertsManagement />
            </Suspense>
          } 
        />
        <Route 
          path="ai-analysis" 
          element={
            <Suspense fallback={<PageLoader />}>
              <AIAnalysis />
            </Suspense>
          } 
        />
        <Route 
          path="reports" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ReportsAnalytics />
            </Suspense>
          } 
        />
        <Route 
          path="profile" 
          element={
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          } 
        />
        <Route 
          path="*" 
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
