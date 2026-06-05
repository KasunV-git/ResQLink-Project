import React, { useState } from 'react';
import Home from './pages/Home';
import VolunteerApp from './pages/volunteer/VolunteerApp';

export default function App() {
  // Check if user is already logged in
  const isLoggedIn = () => {
    const saved = localStorage.getItem("resqlink_volunteer_user");
    return saved ? true : false;
  };

  const [showApp, setShowApp] = useState(isLoggedIn);
  const [startOnRegister, setStartOnRegister] = useState(false);

  const handleLogin = () => {
    setStartOnRegister(false);
    setShowApp(true);
  };

  const handleRegister = () => {
    setStartOnRegister(true);
    setShowApp(true);
  };

  const handleLogout = () => {
    setShowApp(false);
    setStartOnRegister(false);
  };

  if (showApp) {
    return (
      <VolunteerApp
        startOnRegister={startOnRegister}
        onLogout={handleLogout}
        onGoHome={handleLogout}
      />
    );
  }

  return <Home onLogin={handleLogin} onRegister={handleRegister} />;
}
