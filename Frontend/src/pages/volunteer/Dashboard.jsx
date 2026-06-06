import React from "react";
import { AlertCircle, MapPin, ClipboardList, CheckCircle } from "lucide-react";

export default function Dashboard({ user, onToggleAvailability, activeAssignments, completedAssignments, alerts, onTabChange }) {
  const isAvailable    = user?.isAvailable ?? true;
  const activeCount    = activeAssignments.length;
  const completedCount = completedAssignments.length;
  const totalCount     = activeCount + completedCount;

  return (
    <div className="flex flex-col w-full gap-4 md:gap-5">

      {/* Title */}
      <div className="anim-fade-in-up">
        <h1 className="text-2xl md:text-[26px] font-bold text-slate-900 mb-1">Volunteer Dashboard</h1>
        <p className="text-sm md:text-[14px] text-slate-500">
          Welcome, {user?.name || "Volunteer"}! Manage your assignments and availability
        </p>
      </div>

      {/* Availability toggle card */}
      <div className="anim-fade-in-up d-100 hover-card bg-white rounded-xl px-5 py-4 md:px-6"
        style={{
          border: `1.5px solid ${isAvailable ? "#15803d" : "#e2e8f0"}`,
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          transition: "border-color 0.3s ease, box-shadow 0.22s ease, transform 0.22s ease",
        }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-semibold text-slate-900 mb-1">Availability Status</h2>
            <p className="text-sm text-slate-500">
              {isAvailable ? "You are currently available for assignments" : "You are currently unavailable for assignments"}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-semibold transition-colors duration-300"
              style={{ color: isAvailable ? "#15803d" : "#94a3b8" }}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>
            {/* Toggle switch */}
            <div onClick={onToggleAvailability}
              className="relative cursor-pointer flex-shrink-0 rounded-full transition-colors duration-300"
              style={{
                width: 48, height: 26,
                backgroundColor: isAvailable ? "#15803d" : "#cbd5e1",
                boxShadow: isAvailable ? "0 0 0 3px rgba(21,128,61,0.15)" : "none",
              }}>
              <div className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform duration-300"
                style={{
                  boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                  transform: isAvailable ? "translateX(22px)" : "translateX(0px)",
                }} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards row — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Active Assignments */}
        <div className="anim-fade-in-up d-150 bg-white rounded-xl flex flex-col"
          style={{ border: "1px solid #e2e8f0", padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", minHeight: 300 }}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} color="#15803d" />
              <span className="text-[15px] font-semibold text-slate-900">Active Assignments</span>
            </div>
            <button onClick={() => onTabChange("assignments")}
              className="bg-transparent border-none cursor-pointer text-[13px] font-semibold text-[#15803d] hover:opacity-70 transition-opacity">
              View All →
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
            {activeAssignments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 py-8">
                <CheckCircle size={32} color="#e2e8f0" />
                <span className="text-sm">No active assignments</span>
              </div>
            ) : activeAssignments.slice(0, 2).map((item) => (
              <div key={item.id}
                className="border border-slate-100 rounded-[10px] p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-sm font-semibold text-slate-900">{item.disaster}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: item.status === "in-progress" ? "#fef3c7" : "#e0f2fe",
                      color:           item.status === "in-progress" ? "#92400e" : "#0369a1",
                    }}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 mb-1.5">{item.task}</p>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
                  <MapPin size={12} /><span>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="anim-fade-in-up d-200 bg-white rounded-xl flex flex-col"
          style={{ border: "1px solid #e2e8f0", padding: "20px 22px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", minHeight: 300 }}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} color="#dc2626" />
              <span className="text-[15px] font-semibold text-slate-900">Recent Alerts</span>
            </div>
            <button onClick={() => onTabChange("alerts")}
              className="bg-transparent border-none cursor-pointer text-[13px] font-semibold text-[#15803d] hover:opacity-70 transition-opacity">
              View All →
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
            {alerts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-8">No active alerts</div>
            ) : alerts.slice(0, 3).map(alert => {
              const cfg = alert.priority === "high"
                ? { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" }
                : alert.priority === "medium"
                ? { bg: "#fffbeb", color: "#d97706", border: "#fde68a" }
                : { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
              return (
                <div key={alert.id} className="rounded-[10px] p-3 transition-transform hover:translate-x-1"
                  style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white uppercase"
                      style={{ color: cfg.color }}>
                      {alert.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-[13px] text-slate-700 font-medium leading-snug m-0">{alert.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats — always 3 columns */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Total Assignments", value: totalCount,    color: "#15803d" },
          { label: "Active Tasks",      value: activeCount,   color: "#d97706" },
          { label: "Completed",         value: completedCount, color: "#16a34a" },
        ].map(({ label, value, color }, i) => (
          <div key={label} className={`anim-fade-in-up hover-card d-${(i+2)*100} bg-white rounded-xl text-center`}
            style={{ border: "1px solid #e2e8f0", padding: "18px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-[10px] md:text-[11px] text-slate-400 font-semibold uppercase tracking-wider leading-tight">
              {label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
