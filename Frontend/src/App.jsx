import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  if (!role) return "citizen";
  const str = String(role).toLowerCase().trim();
  if (str === "admin" || str === "administrator") return "admin";
  if (str === "citizen" || str === "user" || str === "public") return "citizen";
  if (str === "volunteer") return "volunteer";
  return "citizen";
};

export default function App() {
  const { user, login, logout, updateUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Combine pathname and hash to determine view mode and subTab seamlessly
  const getActiveView = () => {
    const hash = (location.hash || "").toLowerCase();
    const pathname = (location.pathname || "").toLowerCase();
    const fullPath = pathname !== "/" ? pathname : hash.replace("#", "");

    if (user) {
      const normRole = getNormalizedRole(user.role);
      if (normRole === "admin") return { mode: "admin" };
      if (normRole === "citizen") {
        let subTab = "dashboard";
        if (fullPath.includes("/report")) subTab = "report";
        else if (fullPath.includes("/alerts")) subTab = "alerts";
        else if (fullPath.includes("/map")) subTab = "map";
        else if (fullPath.includes("/profile")) subTab = "profile";
        return { mode: "citizen", subTab };
      }
      return { mode: "volunteer" };
    }

    // Unauthenticated routing
    if (fullPath.includes("login")) return { mode: "login" };
    if (fullPath.includes("signup") || fullPath.includes("register")) return { mode: "signup" };
    if (fullPath.includes("citizen")) {
      let subTab = "dashboard";
      if (fullPath.includes("/report")) subTab = "report";
      else if (fullPath.includes("/alerts")) subTab = "alerts";
      else if (fullPath.includes("/map")) subTab = "map";
      else if (fullPath.includes("/profile")) subTab = "profile";
      return { mode: "citizen", subTab };
    }
    if (fullPath.includes("admin")) return { mode: "admin" };
    if (fullPath.includes("volunteer")) return { mode: "volunteer" };

    return { mode: "home" };
  };

  const viewState = getActiveView();

  // Route guard side effect: automatically sync location if unauthorized
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const normRole = getNormalizedRole(user.role);
    const targetPath =
      normRole === "admin" ? "/admin/dashboard" :
      normRole === "citizen" ? "/citizen/dashboard" : "/volunteer/dashboard";

    if (viewState.mode === "login" || viewState.mode === "signup" || viewState.mode === "home") {
      navigate(targetPath, { replace: true });
    } else if (viewState.mode === "admin" && normRole !== "admin") {
      navigate(targetPath, { replace: true });
    } else if (viewState.mode === "citizen" && normRole !== "citizen") {
      navigate(targetPath, { replace: true });
    } else if (viewState.mode === "volunteer" && normRole !== "volunteer") {
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, user, viewState.mode, navigate]);

  const handleLoginSuccess = (data) => {
    const userObj = data.user || data;
    login(userObj);

    const normRole = getNormalizedRole(userObj.role);

    if (normRole === "admin") {
      navigate("/admin/dashboard");
    } else if (normRole === "citizen") {
      navigate("/citizen/dashboard");
    } else {
      navigate("/volunteer/dashboard");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLoginNav = () => {
    navigate("/login");
  };

  const handleRegisterNav = () => {
    navigate("/signup");
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
