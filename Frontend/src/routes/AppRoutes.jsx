import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VolunteerApp from '../pages/volunteer/VolunteerApp';
import AdminApp from '../pages/admin/AdminApp';
import MainLayout from '../layouts/MainLayout';
import CitizenDashboard from '../pages/citizen/Dashboard';
import CitizenReport from '../pages/citizen/Report';
import CitizenAlerts from '../pages/citizen/Alerts';
import CitizenProfile from '../pages/citizen/Profile';
import CitizenMap from '../pages/citizen/MapPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { user, login, logout, updateUser } = useAuth();

  const handleLoginSuccess = (data) => {
    const userObj = data.user || data;
    login(userObj);
  };

  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />

      {/* Protected Volunteer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Volunteer']} />}>
        <Route
          path="/volunteer/*"
          element={
            <VolunteerApp
              user={user}
              onLogout={logout}
              onGoHome={logout}
              onUpdateUser={updateUser}
            />
          }
        />
      </Route>

      {/* Protected Citizen Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Citizen']} />}>
        <Route path="/citizen" element={<MainLayout user={user} onLogout={logout} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="report" element={<CitizenReport />} />
          <Route path="alerts" element={<CitizenAlerts />} />
          <Route path="map" element={<CitizenMap />} />
          <Route path="profile" element={<CitizenProfile user={user} onLogout={logout} />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route
          path="/admin/*"
          element={
            <AdminApp
              user={user}
              onLogout={logout}
              onUpdateUser={updateUser}
            />
          }
        />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;