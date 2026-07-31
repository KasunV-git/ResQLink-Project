<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import VolunteerApp from './pages/volunteer/VolunteerApp';

export default function App() {
  const getInitialView = () => {
    const hash = (window.location.hash || "").toLowerCase();
    const savedUser = localStorage.getItem("resqlink_volunteer_user");

    if (hash === "#/login") {
      return { showApp: true, startOnRegister: false };
    }
    if (hash === "#/signup" || hash === "#/register") {
      return { showApp: true, startOnRegister: true };
    }
    if (savedUser) {
      return { showApp: true, startOnRegister: false };
    }
    return { showApp: false, startOnRegister: false };
  };

  const [viewState, setViewState] = useState(getInitialView);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || "").toLowerCase();
      if (hash === "#/login") {
        setViewState({ showApp: true, startOnRegister: false });
      } else if (hash === "#/signup" || hash === "#/register") {
        setViewState({ showApp: true, startOnRegister: true });
      } else if (hash === "#/home" || hash === "#/" || hash === "") {
        const savedUser = localStorage.getItem("resqlink_volunteer_user");
        if (!savedUser) {
          setViewState({ showApp: false, startOnRegister: false });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogin = () => {
    window.location.hash = "#/login";
    setViewState({ showApp: true, startOnRegister: false });
  };

  const handleRegister = () => {
    window.location.hash = "#/signup";
    setViewState({ showApp: true, startOnRegister: true });
  };

  const handleLogout = () => {
    window.location.hash = "#/home";
    setViewState({ showApp: false, startOnRegister: false });
  };

  if (viewState.showApp) {
    return (
      <VolunteerApp
        startOnRegister={viewState.startOnRegister}
        onLogout={handleLogout}
        onGoHome={handleLogout}
      />
    );
  }

  return <Home onLogin={handleLogin} onRegister={handleRegister} />;
}
=======
// frontend/src/App.jsx
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
>>>>>>> kasuni-development
