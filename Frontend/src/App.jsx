import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import VolunteerApp from "./pages/volunteer/VolunteerApp";
import AdminApp from "./pages/admin/AdminApp";
import MainLayout from "./layouts/MainLayout";
import CitizenDashboard from "./pages/citizen/Dashboard";
import CitizenReport from "./pages/citizen/Report";
import CitizenAlerts from "./pages/citizen/Alerts";
import CitizenMap from "./pages/citizen/MapPage";
import CitizenProfile from "./pages/citizen/Profile";
import LoginPage from "./pages/auth/LoginPage";
import { useAuth } from "./context/AuthContext";

const getNormalizedRole = (role) => {
  if (!role) return "volunteer";
  const str = String(role).toLowerCase().trim();
  if (str === "admin" || str === "administrator") return "admin";
  if (str === "citizen") return "citizen";
  return "volunteer";
};

export default function App() {
  const { user, login, logout, updateUser, isAuthenticated } = useAuth();

  const getInitialView = () => {
    const hash = (window.location.hash || "").toLowerCase();

    // If logged in, prioritize user role dashboard unless accessing authorized sub-routes
    if (user) {
      const normRole = getNormalizedRole(user.role);
      if (hash.startsWith("#/citizen") && normRole === "citizen") {
        return { mode: "citizen", subTab: hash.replace("#/citizen/", "") || "dashboard" };
      }
      if (hash.startsWith("#/admin") && normRole === "admin") {
        return { mode: "admin" };
      }
      if (hash.startsWith("#/volunteer") && normRole === "volunteer") {
        return { mode: "volunteer" };
      }

      // Default redirect for logged-in users visiting /login, /signup, or /home
      if (normRole === "admin") return { mode: "admin" };
      if (normRole === "citizen") return { mode: "citizen", subTab: "dashboard" };
      return { mode: "volunteer" };
    }

    // Unauthenticated initial view
    if (hash === "#/login") return { mode: "login" };
    if (hash === "#/signup" || hash === "#/register") return { mode: "signup" };
    if (hash.startsWith("#/citizen")) return { mode: "citizen", subTab: hash.replace("#/citizen/", "") || "dashboard" };
    if (hash.startsWith("#/admin")) return { mode: "admin" };
    if (hash.startsWith("#/volunteer")) return { mode: "volunteer" };

    return { mode: "home" };
  };

  const [viewState, setViewState] = useState(getInitialView);

  // Sync window.location.hash changes to viewState
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || "").toLowerCase();

      if (!user) {
        if (hash === "#/login") {
          setViewState({ mode: "login" });
        } else if (hash === "#/signup" || hash === "#/register") {
          setViewState({ mode: "signup" });
        } else if (hash.startsWith("#/citizen")) {
          setViewState({ mode: "citizen", subTab: hash.replace("#/citizen/", "") || "dashboard" });
        } else if (hash === "#/home" || hash === "#/" || hash === "") {
          setViewState({ mode: "home" });
        }
      } else {
        const normRole = getNormalizedRole(user.role);
        if (hash.startsWith("#/citizen") && normRole === "citizen") {
          setViewState({ mode: "citizen", subTab: hash.replace("#/citizen/", "") || "dashboard" });
        } else if (hash.startsWith("#/admin") && normRole === "admin") {
          setViewState({ mode: "admin" });
        } else if (hash.startsWith("#/volunteer") && normRole === "volunteer") {
          setViewState({ mode: "volunteer" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [user]);

  // Route guard side effect: automatically redirect logged-in users away from /login or unauthorized paths
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const normRole = getNormalizedRole(user.role);
    const targetHash =
      normRole === "admin" ? "#/admin/dashboard" :
      normRole === "citizen" ? "#/citizen/dashboard" : "#/volunteer/dashboard";

    if (viewState.mode === "login" || viewState.mode === "signup" || viewState.mode === "home") {
      window.location.hash = targetHash;
      setViewState({
        mode: normRole,
        subTab: normRole === "citizen" ? "dashboard" : undefined
      });
    } else if (viewState.mode === "admin" && normRole !== "admin") {
      window.location.hash = targetHash;
      setViewState({ mode: normRole, subTab: normRole === "citizen" ? "dashboard" : undefined });
    } else if (viewState.mode === "citizen" && normRole !== "citizen") {
      window.location.hash = targetHash;
      setViewState({ mode: normRole });
    } else if (viewState.mode === "volunteer" && normRole !== "volunteer") {
      window.location.hash = targetHash;
      setViewState({ mode: normRole, subTab: normRole === "citizen" ? "dashboard" : undefined });
    }
  }, [isAuthenticated, user, viewState.mode]);

  const handleLoginSuccess = (data) => {
    const userObj = data.user || data;
    login(userObj);

    const normRole = getNormalizedRole(userObj.role);

    if (normRole === "admin") {
      window.location.hash = "#/admin/dashboard";
      setViewState({ mode: "admin" });
    } else if (normRole === "citizen") {
      window.location.hash = "#/citizen/dashboard";
      setViewState({ mode: "citizen", subTab: "dashboard" });
    } else {
      window.location.hash = "#/volunteer/dashboard";
      setViewState({ mode: "volunteer" });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.hash = "#/home";
    setViewState({ mode: "home" });
  };

  const handleLoginNav = () => {
    window.location.hash = "#/login";
    setViewState({ mode: "login" });
  };

  const handleRegisterNav = () => {
    window.location.hash = "#/signup";
    setViewState({ mode: "signup" });
  };

  // ── ROUTE PROTECTION & VIEW RENDERING ──

  // 1. Logged-in user routing
  if (isAuthenticated && user) {
    const normRole = getNormalizedRole(user.role);

    if (normRole === "admin") {
      return <AdminApp user={user} onLogout={handleLogout} onUpdateUser={updateUser} />;
    }

    if (normRole === "citizen") {
      return (
        <MainLayout user={user} onLogout={handleLogout}>
          {viewState.subTab === "report" && <CitizenReport />}
          {viewState.subTab === "alerts" && <CitizenAlerts />}
          {viewState.subTab === "map" && <CitizenMap />}
          {viewState.subTab === "profile" && <CitizenProfile user={user} onLogout={handleLogout} />}
          {(viewState.subTab === "dashboard" || !viewState.subTab) && <CitizenDashboard />}
        </MainLayout>
      );
    }

    // Default: Volunteer
    return (
      <VolunteerApp
        user={user}
        onLogout={handleLogout}
        onGoHome={handleLogout}
        onUpdateUser={updateUser}
      />
    );
  }

  // 2. Unauthenticated views
  if (viewState.mode === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        initialShowRegister={false}
        onGoHome={handleLogout}
      />
    );
  }

  if (viewState.mode === "signup") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        initialShowRegister={true}
        onGoHome={handleLogout}
      />
    );
  }

  if (viewState.mode === "citizen") {
    return (
      <MainLayout user={user} onLogout={handleLogout}>
        {viewState.subTab === "report" && <CitizenReport />}
        {viewState.subTab === "alerts" && <CitizenAlerts />}
        {viewState.subTab === "map" && <CitizenMap />}
        {viewState.subTab === "profile" && <CitizenProfile user={user} onLogout={handleLogout} />}
        {(viewState.subTab === "dashboard" || !viewState.subTab) && <CitizenDashboard />}
      </MainLayout>
    );
  }

  // Default: Unified Landing Page
  return <Home onLogin={handleLoginNav} onRegister={handleRegisterNav} />;
}
