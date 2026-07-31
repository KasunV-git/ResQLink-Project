import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import LoginPage from "../auth/LoginPage";
import Dashboard from "./Dashboard";
import Assignments from "./Assignments";
import Skills from "./Skills";
import Alerts from "./Alerts";
import Profile from "./Profile";

export default function VolunteerApp({ user: initialUser, startOnRegister = false, onLogout, onGoHome, onUpdateUser }) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    if (initialUser) return initialUser;
    const saved = localStorage.getItem("resqlink_volunteer_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (initialUser) setUser(initialUser);
  }, [initialUser]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignments, setAssignments] = useState([]);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPortalData = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const [userRes, assignRes, skillsRes, alertsRes] = await Promise.all([
        axios.get(`/api/auth/profile/${userId}`),
        axios.get(`/api/assignments/${userId}`),
        axios.get(`/api/skills/${userId}`),
        axios.get("/api/alerts"),
      ]);

      const updatedUser = userRes.data;
      setUser(updatedUser);
      if (onUpdateUser) onUpdateUser(updatedUser);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updatedUser));

      setAssignments([
        ...(assignRes.data.activeAssignments || []),
        ...(assignRes.data.completedAssignments || []),
      ]);
      setCurrentSkills(skillsRes.data.currentSkills || []);
      setSuggestedSkills(skillsRes.data.suggestedSkills || []);
      setAlerts(alertsRes.data || []);
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
    if (onUpdateUser) onUpdateUser(userData);
    localStorage.setItem("resqlink_volunteer_user", JSON.stringify(userData));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("resqlink_volunteer_user");
    setAssignments([]);
    setCurrentSkills([]);
    setSuggestedSkills([]);
    setAlerts([]);
    if (onLogout) onLogout();
  };

  const handleToggleAvailability = async () => {
    if (!user) return;
    const nextAvailability = !user.isAvailable;
    const optimisticUser = { ...user, isAvailable: nextAvailability };
    setUser(optimisticUser);
    localStorage.setItem("resqlink_volunteer_user", JSON.stringify(optimisticUser));

    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, {
        isAvailable: nextAvailability,
      });
      const confirmed = response.data;
      setUser(confirmed);
      if (onUpdateUser) onUpdateUser(confirmed);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(confirmed));
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      setUser(user);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(user));
    }
  };

  const handleStartAssignment = async (assignmentId) => {
    const snapshot = assignments;
    setAssignments(prev =>
      prev.map(a => a.id === assignmentId ? { ...a, status: "in-progress" } : a)
    );
    try {
      await axios.post(`/api/assignments/${assignmentId}/start`);
    } catch (error) {
      setAssignments(snapshot);
      const msg = error.response?.data?.message || "Failed to start task.";
      throw new Error(msg);
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    const snapshot = assignments;
    const today = new Date();
    const completedDate = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`;
    setAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? { ...a, status: "completed", completedDate }
          : a
      )
    );
    try {
      await axios.post(`/api/assignments/${assignmentId}/complete`);
    } catch (error) {
      setAssignments(snapshot);
      const msg = error.response?.data?.message || "Failed to complete assignment.";
      throw new Error(msg);
    }
  };

  const handleSaveSkills = async (newSkills) => {
    if (!user) return;
    try {
      const res = await axios.put(`/api/skills/${user.id}`, { skills: newSkills });
      setCurrentSkills(res.data.currentSkills);
      setSuggestedSkills(res.data.suggestedSkills);
      return res.data;
    } catch (error) {
      console.error("Failed to save skills:", error);
      throw error;
    }
  };

  const handleAddSkill = async (skillName) => {
    if (!user) return;
    try {
      await axios.post(`/api/skills/${skillName ? skillName : ''}`, { skillName });
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
      const skillsRes = await axios.get(`/api/skills/${user.id}`);
      setCurrentSkills(skillsRes.data.currentSkills);
      setSuggestedSkills(skillsRes.data.suggestedSkills);
    } catch (error) {
      console.error("Failed to remove skill:", error);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    if (!user) return;
    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, profileData);
      const updated = response.data;
      setUser(updated);
      if (onUpdateUser) onUpdateUser(updated);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        initialShowRegister={startOnRegister}
        onGoHome={onGoHome}
      />
    );
  }

  const highAlertCount = alerts.length;
  const activeAssignments    = assignments.filter(a => a.status !== "completed");
  const completedAssignments = assignments.filter(a => a.status === "completed");

  const renderContent = () => {
    if (loading && assignments.length === 0) {
      return (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 0" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ width:36, height:36, border:"3px solid #e2e8f0", borderTopColor:"#15803d",
              borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
            <span style={{ color:"#64748b", fontWeight:500 }}>{t("common.loading") || "Loading portal data..."}</span>
          </div>
          <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
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
            assignments={assignments}
            activeAssignments={activeAssignments}
            completedAssignments={completedAssignments}
            onStartAssignment={handleStartAssignment}
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
            onSaveSkills={handleSaveSkills}
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
          <div className="text-center text-slate-500 mt-10">{t("common.pageNotFound") || "Page not found."}</div>
        );
    }
  };

  const closeTab = (tab) => { setActiveTab(tab); setSidebarOpen(false); };

  return (
    <div className="w-full h-screen flex flex-col bg-[#EDF0F3] dark:bg-slate-950 transition-colors font-sans">
      <Header
        user={user}
        alertsCount={highAlertCount}
        onTabChange={closeTab}
        onMenuToggle={() => setSidebarOpen(o => !o)}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 20 }}
            className="sidebar-overlay"
          />
        )}

        {/* Sidebar — desktop */}
        <div className="hidden md:flex flex-shrink-0 h-full" style={{ zIndex: 30 }}>
          <Sidebar activeTab={activeTab} onTabChange={closeTab} />
        </div>

        {/* Sidebar — mobile slide-in */}
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            bottom: 0,
            zIndex: 30,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.2s ease",
          }}
        >
          <Sidebar activeTab={activeTab} onTabChange={closeTab} />
        </div>

        {/* Main content */}
        <main style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", minWidth:0 }}>
          <div key={activeTab} className="page-enter content-area">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
