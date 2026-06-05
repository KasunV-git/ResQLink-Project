import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Dashboard from "./Dashboard";
import Volunteers from "./Volunteers";
import Assignments from "./Assignments";
import Alerts from "./Alerts";
import Profile from "../volunteer/Profile"; // We can reuse the profile page since it takes user, onUpdateProfile, and onLogout

// Custom Admin Sidebar
function AdminSidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: "📊" },
    { id: "volunteers", label: "Volunteers", icon: "👥" },
    { id: "assignments", label: "Assignments", icon: "📋" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="bg-white border-[#e5e7eb] border-r-[0.8px] border-solid w-[256px] h-full shrink-0 flex flex-col pt-4 px-4 gap-1 shadow-sm">
      <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        Admin Controls
      </div>
      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AdminApp({ user, onLogout, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [volunteersRes, assignmentsRes, alertsRes] = await Promise.all([
        axios.get("/api/auth/volunteers"),
        axios.get("/api/assignments"),
        axios.get("/api/alerts"),
      ]);
      setVolunteers(volunteersRes.data);
      setAssignments(assignmentsRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminData();
  }, []);

  const handleCreateAlert = async (alertData) => {
    try {
      const res = await axios.post("/api/alerts", alertData);
      setAlerts([res.data, ...alerts]);
    } catch (error) {
      console.error("Failed to create alert:", error);
      throw error;
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`/api/alerts/${alertId}`);
      setAlerts(alerts.filter((a) => a.id !== alertId));
    } catch (error) {
      console.error("Failed to delete alert:", error);
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const res = await axios.post("/api/assignments", assignmentData);
      setAssignments([res.data, ...assignments]);
      
      // Refresh volunteers list to update active tasks count
      const volRes = await axios.get("/api/auth/volunteers");
      setVolunteers(volRes.data);
    } catch (error) {
      console.error("Failed to create assignment:", error);
      throw error;
    }
  };

  const handleCancelAssignment = async (assignmentId) => {
    try {
      await axios.delete(`/api/assignments/${assignmentId}`);
      setAssignments(assignments.filter((a) => a.id !== assignmentId));
      
      // Refresh volunteers list to update active tasks count
      const volRes = await axios.get("/api/auth/volunteers");
      setVolunteers(volRes.data);
    } catch (error) {
      console.error("Failed to cancel assignment:", error);
    }
  };

  const handleCompleteAssignment = async (assignmentId) => {
    try {
      const res = await axios.post(`/api/assignments/${assignmentId}/complete`);
      setAssignments(
        assignments.map((a) =>
          a.id === assignmentId
            ? { ...a, status: "completed", completedDate: res.data.completedDate }
            : a
        )
      );
      
      // Refresh volunteers list to update active tasks count
      const volRes = await axios.get("/api/auth/volunteers");
      setVolunteers(volRes.data);
    } catch (error) {
      console.error("Failed to complete assignment:", error);
    }
  };

  const handleToggleVolunteerAvailability = async (volunteerId, currentStatus) => {
    try {
      const response = await axios.put(`/api/auth/profile/${volunteerId}`, {
        isAvailable: !currentStatus,
      });
      const updated = response.data;
      setVolunteers(
        volunteers.map((v) =>
          v.id === volunteerId ? { ...v, isAvailable: updated.isAvailable } : v
        )
      );
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const handleUpdateProfile = async ({ name, phone }) => {
    try {
      const response = await axios.put(`/api/auth/profile/${user.id}`, { name, phone });
      onUpdateUser(response.data);
    } catch (error) {
      console.error("Failed to update admin profile:", error);
      throw error;
    }
  };

  const highAlertCount = alerts.filter((a) => a.priority === "high").length;

  const renderContent = () => {
    if (loading && volunteers.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-medium">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span>Loading admin console...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            volunteers={volunteers}
            assignments={assignments}
            alerts={alerts}
            onTabChange={setActiveTab}
          />
        );
      case "volunteers":
        return (
          <Volunteers
            volunteers={volunteers}
            onToggleAvailability={handleToggleVolunteerAvailability}
            onAssign={handleCreateAssignment}
          />
        );
      case "assignments":
        return (
          <Assignments
            assignments={assignments}
            onCancelAssignment={handleCancelAssignment}
            onCompleteAssignment={handleCompleteAssignment}
          />
        );
      case "alerts":
        return (
          <Alerts
            alerts={alerts}
            onCreateAlert={handleCreateAlert}
            onDeleteAlert={handleDeleteAlert}
          />
        );
      case "profile":
        return (
          <Profile
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onLogout={onLogout}
          />
        );
      default:
        return (
          <div className="text-center text-slate-500 mt-10">Page not found.</div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
      <Header
        user={user}
        alertsCount={highAlertCount}
        onTabChange={setActiveTab}
      />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1100px] mx-auto pb-12">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
