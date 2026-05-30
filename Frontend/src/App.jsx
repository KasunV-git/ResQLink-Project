<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/volunteer/Dashboard";
import Assignments from "./pages/volunteer/Assignments";
import Skills from "./pages/volunteer/Skills";
import Alerts from "./pages/volunteer/Alerts";
import Profile from "./pages/volunteer/Profile";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("resqlink_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all volunteer portal data when user logins or switches tabs
  const fetchPortalData = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      // 1. Fetch user profile
      const userRes = await axios.get(`/api/auth/profile/${userId}`);
      setUser(userRes.data);
      localStorage.setItem("resqlink_user", JSON.stringify(userRes.data));

      // 2. Fetch assignments
      const assignRes = await axios.get(`/api/assignments/${userId}`);
      setActiveAssignments(assignRes.data.activeAssignments);
      setCompletedAssignments(assignRes.data.completedAssignments);

      // 3. Fetch skills
      const skillsRes = await axios.get(`/api/skills/${userId}`);
      setCurrentSkills(skillsRes.data.currentSkills);
      setSuggestedSkills(skillsRes.data.suggestedSkills);

      // 4. Fetch emergency alerts
      const alertsRes = await axios.get("/api/alerts");
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Error fetching volunteer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPortalData(user.id);
    }
  }, [user?.id]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("resqlink_user", JSON.stringify(userData));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("resqlink_user");
    setActiveAssignments([]);
    setCompletedAssignments([]);
    setCurrentSkills([]);
    setSuggestedSkills([]);
    setAlerts([]);
  };

  const handleToggleAvailability = async () => {
    if (!user) return;
    const nextAvailability = !user.isAvailable;
    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, {
        isAvailable: nextAvailability
      });
      setUser(response.data);
      localStorage.setItem("resqlink_user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      await axios.post(`/api/assignments/${assignmentId}/complete`);
      // Re-fetch assignments data
      if (user) {
        const assignRes = await axios.get(`/api/assignments/${user.id}`);
        setActiveAssignments(assignRes.data.activeAssignments);
        setCompletedAssignments(assignRes.data.completedAssignments);
      }
    } catch (error) {
      console.error("Failed to complete assignment:", error);
    }
  };

  const handleAddSkill = async (skillName) => {
    if (!user) return;
    try {
      await axios.post(`/api/skills/${user.id}`, { skillName });
      // Re-fetch skills data
      const skillsRes = await axios.get(`/api/skills/${user.id}`);
      setCurrentSkills(skillsRes.data.currentSkills);
      setSuggestedSkills(skillsRes.data.suggestedSkills);
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  const handleRemoveSkill = async (skillName) => {
    if (!user) return;
    try {
      await axios.delete(`/api/skills/${user.id}`, { data: { skillName } });
      // Re-fetch skills data
      const skillsRes = await axios.get(`/api/skills/${user.id}`);
      setCurrentSkills(skillsRes.data.currentSkills);
      setSuggestedSkills(skillsRes.data.suggestedSkills);
    } catch (error) {
      console.error("Failed to remove skill:", error);
    }
  };

  const handleUpdateProfile = async ({ name, phone }) => {
    if (!user) return;
    const response = await axios.put(`/api/auth/profile/${user.id}`, { name, phone });
    setUser(response.data);
    localStorage.setItem("resqlink_user", JSON.stringify(response.data));
  };

  // If user is not logged in, render the login page
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Active view router
  const renderContent = () => {
    if (loading && activeAssignments.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-medium">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15803d]"></div>
            <span>Loading portal data...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            onToggleAvailability={handleToggleAvailability}
            activeAssignments={activeAssignments}
            completedAssignments={completedAssignments}
            alerts={alerts}
            onTabChange={setActiveTab}
          />
        );
      case "assignments":
        return (
          <Assignments
            activeAssignments={activeAssignments}
            completedAssignments={completedAssignments}
            onCompleteAssignment={handleCompleteAssignment}
          />
        );
      case "skills":
        return (
          <Skills
            currentSkills={currentSkills}
            suggestedSkills={suggestedSkills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        );
      case "alerts":
        return <Alerts alerts={alerts} />;
      case "profile":
        return (
          <Profile
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <div className="text-center text-slate-500 mt-10">Page not found.</div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 font-sans">
      {/* Top Header */}
      <Header
        user={user}
        alertsCount={alerts.filter(a => a.priority === 'high').length}
        onTabChange={setActiveTab}
      />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1000px] mx-auto pb-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
>>>>>>> f9c18754bc9336f8626a12c9baffd3fbeb0f6887
