import { useState, useEffect } from 'react';
import VolunteerApp from './pages/volunteer/VolunteerApp';
import AdminApp from './pages/admin/AdminApp';
import LoginPage from './pages/auth/LoginPage';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("resqlink_volunteer_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("resqlink_volunteer_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("resqlink_volunteer_user");
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updatedUser));
  };

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (user && user.role === 'Admin' && currentPath !== '/admin') {
      window.location.href = '/admin';
    }
  }, [user, currentPath]);

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPath === '/admin') {
    if (user.role === 'Admin') {
      return <AdminApp user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
    } else {
      return (
        <div className="flex items-center justify-center h-screen bg-slate-100 font-sans">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center max-w-sm">
            <h2 className="font-bold text-xl text-red-600 mb-2">Access Denied</h2>
            <p className="text-slate-500 text-sm mb-4">You do not have administrative privileges to access this area.</p>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm"
            >
              Go to Volunteer Portal
            </button>
          </div>
        </div>
      );
    }
  }

  // If Admin gets here and pathname isn't '/admin', render loading/nothing while redirect finishes
  if (user.role === 'Admin') {
    return null;
  }

  return <VolunteerApp user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
}
