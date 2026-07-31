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

export default function App() {
  const { user, login, logout, updateUser, isAuthenticated, role: userRole } = useAuth();

  const getInitialView = () => {
    const hash = (window.location.hash || "").toLowerCase();

    if (hash === "#/login") return { mode: "login" };
    if (hash === "#/signup" || hash === "#/register") return { mode: "signup" };
    if (hash.startsWith("#/citizen")) return { mode: "citizen", subTab: hash.replace("#/citizen/", "") || "dashboard" };
    if (hash.startsWith("#/admin")) return { mode: "admin" };
    if (hash.startsWith("#/volunteer")) return { mode: "volunteer" };

    if (user) {
      const r = (user.role || "").toLowerCase();
      if (r === "admin") return { mode: "admin" };
      if (r === "citizen") return { mode: "citizen", subTab: "dashboard" };
      return { mode: "volunteer" };
    }
    return { mode: "home" };
  };

  const [viewState, setViewState] = useState(getInitialView);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || "").toLowerCase();

      if (hash === "#/login") {
        setViewState({ mode: "login" });
      } else if (hash === "#/signup" || hash === "#/register") {
        setViewState({ mode: "signup" });
      } else if (hash.startsWith("#/citizen")) {
        // Guard route: if logged in as another role, redirect to own dashboard
        if (user && (user.role || "").toLowerCase() !== "citizen") {
          const authorizedHash = (user.role || "").toLowerCase() === "admin" ? "#/admin/dashboard" : "#/volunteer/dashboard";
          window.location.hash = authorizedHash;
          setViewState({ mode: (user.role || "").toLowerCase() === "admin" ? "admin" : "volunteer" });
        } else {
          setViewState({ mode: "citizen", subTab: hash.replace("#/citizen/", "") || "dashboard" });
        }
      } else if (hash.startsWith("#/admin")) {
        // Guard route: if logged in as non-admin, redirect
        if (user && (user.role || "").toLowerCase() !== "admin") {
          const authorizedHash = (user.role || "").toLowerCase() === "citizen" ? "#/citizen/dashboard" : "#/volunteer/dashboard";
          window.location.hash = authorizedHash;
          setViewState({ mode: (user.role || "").toLowerCase() === "citizen" ? "citizen" : "volunteer" });
        } else {
          setViewState({ mode: "admin" });
        }
      } else if (hash.startsWith("#/volunteer")) {
        // Guard route: if logged in as non-volunteer, redirect
        if (user && (user.role || "").toLowerCase() !== "volunteer") {
          const authorizedHash = (user.role || "").toLowerCase() === "admin" ? "#/admin/dashboard" : "#/citizen/dashboard";
          window.location.hash = authorizedHash;
          setViewState({ mode: (user.role || "").toLowerCase() === "admin" ? "admin" : "citizen" });
        } else {
          setViewState({ mode: "volunteer" });
        }
      } else if (hash === "#/home" || hash === "#/" || hash === "") {
        if (!user) {
          setViewState({ mode: "home" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [user]);

  const handleLoginSuccess = (data) => {
    const userObj = data.user || data;
    login(userObj);

    const userRoleStr = (userObj.role || "").toLowerCase();

    if (userRoleStr === "admin") {
      window.location.hash = "#/admin/dashboard";
      setViewState({ mode: "admin" });
    } else if (userRoleStr === "citizen") {
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
    const currentRole = (user.role || "").toLowerCase();

    // Check if user is attempting to access an unauthorized section
    if (viewState.mode === "admin" && currentRole !== "admin") {
      const targetHash = currentRole === "citizen" ? "#/citizen/dashboard" : "#/volunteer/dashboard";
      window.location.hash = targetHash;
    } else if (viewState.mode === "citizen" && currentRole !== "citizen") {
      const targetHash = currentRole === "admin" ? "#/admin/dashboard" : "#/volunteer/dashboard";
      window.location.hash = targetHash;
    } else if (viewState.mode === "volunteer" && currentRole !== "volunteer") {
      const targetHash = currentRole === "admin" ? "#/admin/dashboard" : "#/citizen/dashboard";
      window.location.hash = targetHash;
    }

    if (currentRole === "admin") {
      return <AdminApp user={user} onLogout={handleLogout} onUpdateUser={updateUser} />;
    }

    if (currentRole === "citizen") {
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
