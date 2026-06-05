import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import LoginPage from "../auth/LoginPage";
import Dashboard from "./Dashboard";
import Assignments from "./Assignments";
import Skills from "./Skills";
import Alerts from "./Alerts";
import Profile from "./Profile";

export default function VolunteerApp({ startOnRegister = false, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("resqlink_volunteer_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
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
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updatedUser));

      setActiveAssignments(assignRes.data.activeAssignments);
      setCompletedAssignments(assignRes.data.completedAssignments);
      setCurrentSkills(skillsRes.data.currentSkills);
      setSuggestedSkills(skillsRes.data.suggestedSkills);
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
    localStorage.setItem("resqlink_volunteer_user", JSON.stringify(userData));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("resqlink_volunteer_user");
    setActiveAssignments([]);
    setCompletedAssignments([]);
    setCurrentSkills([]);
    setSuggestedSkills([]);
    setAlerts([]);
    if (onLogout) onLogout();
  };

  const handleToggleAvailability = async () => {
    if (!user) return;
    const nextAvailability = !user.isAvailable;

    // ── Optimistic update — change UI immediately before API responds ──
    const optimisticUser = { ...user, isAvailable: nextAvailability };
    setUser(optimisticUser);
    localStorage.setItem("resqlink_volunteer_user", JSON.stringify(optimisticUser));

    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, {
        isAvailable: nextAvailability,
      });
      // Confirm with actual server response
      const confirmed = response.data;
      setUser(confirmed);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(confirmed));
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      // ── Revert back if API call fails ──
      setUser(user);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(user));
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      await axios.post(`/api/assignments/${assignmentId}/complete`);
      const assignRes = await axios.get(`/api/assignments/${user.id}`);
      setActiveAssignments(assignRes.data.activeAssignments);
      setCompletedAssignments(assignRes.data.completedAssignments);
    } catch (error) {
      console.error("Failed to complete assignment:", error);
    }
  };

  const handleAddSkill = async (skillName) => {
    if (!user) return;
    try {
      await axios.post(`/api/skills/${user.id}`, { skillName });
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

  const handleUpdateProfile = async ({ firstName, lastName, phone }) => {
    if (!user) return;
    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, { firstName, lastName, phone });
      const updated = response.data;
      setUser(updated);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updated));
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
      />
    );
  }

  const highAlertCount = alerts.length; // show total active alerts count on badge

  const renderContent = () => {
    if (loading && activeAssignments.length === 0) {
      return (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 0" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ width:36, height:36, border:"3px solid #e2e8f0", borderTopColor:"#15803d",
              borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
            <span style={{ color:"#64748b", fontWeight:500 }}>Loading portal data...</span>
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

  const closeTab = (tab) => { setActiveTab(tab); setSidebarOpen(false); };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f1f5f9", fontFamily: "'Inter',sans-serif" }}>

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

        {/* Sidebar */}
        <div
          className="sidebar-wrapper"
          style={{ height: "100%", zIndex: 30 }}
        >
          <Sidebar activeTab={activeTab} onTabChange={closeTab} />
        </div>

        {/* Mobile sidebar — slide in */}
        <div
          className="sidebar-mobile"
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
        <main style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
          <div key={activeTab} className="page-enter" style={{ flex:1, width:"100%", padding:"36px 40px 40px" }}>
            {renderContent()}
          </div>
          <Footer />
        </main>

      </div>

      <style>{`
        .sidebar-mobile { display: none !important; }
        .sidebar-wrapper { display: flex !important; }
        @media (max-width: 768px) {
          .sidebar-wrapper { display: none !important; }
          .sidebar-mobile  { display: block !important; }
          .sidebar-overlay { display: block; }
        }
      `}</style>

    </div>
  );
}
