import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import LoginPage from "../auth/LoginPage";
import Dashboard from "./Dashboard";
import Assignments from "./Assignments";
import Skills from "./Skills";
import Alerts from "./Alerts";
import Profile from "./Profile";

export default function VolunteerApp() {
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
  };

  const handleToggleAvailability = async () => {
    if (!user) return;
    const nextAvailability = !user.isAvailable;
    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, {
        isAvailable: nextAvailability,
      });
      const updated = response.data;
      setUser(updated);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to toggle availability:", error);
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

  const handleUpdateProfile = async ({ name, phone }) => {
    if (!user) return;
    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, { name, phone });
      const updated = response.data;
      setUser(updated);
      localStorage.setItem("resqlink_volunteer_user", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const highAlertCount = alerts.filter((a) => a.priority === "high").length;

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
      <Header
        user={user}
        alertsCount={highAlertCount}
        onTabChange={setActiveTab}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1000px] mx-auto pb-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
