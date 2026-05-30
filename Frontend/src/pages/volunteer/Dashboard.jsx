import React from "react";
import { AlertCircle, Calendar, MapPin, ClipboardList, CheckCircle } from "lucide-react";

export default function Dashboard({ 
  user, 
  onToggleAvailability, 
  activeAssignments, 
  completedAssignments, 
  alerts, 
  onTabChange 
}) {
  const isAvailable = user?.isAvailable ?? true;
  
  // Stats
  const activeCount = activeAssignments.length;
  const completedCount = completedAssignments.length;
  const totalCount = activeCount + completedCount;

  return (
    <div className="w-full flex flex-col gap-6" data-name="VolunteerDashboard">
      {/* Title & Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">Volunteer Dashboard</h1>
        <p className="text-slate-500 text-base">
          Welcome, {user?.name || "Kasun Volunteer"}! Manage your assignments and availability
        </p>
      </div>

      {/* Availability Status Card */}
      <div className={`bg-white border-[1.6px] border-solid rounded-xl p-6 transition-colors shadow-sm ${
        isAvailable ? "border-emerald-600" : "border-slate-300"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-lg text-slate-900">Availability Status</h2>
            <p className="text-slate-500 text-sm">
              {isAvailable 
                ? "You are currently available for assignments" 
                : "You are currently unavailable for assignments"
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-800 text-sm">
              {isAvailable ? "Available" : "Unavailable"}
            </span>
            <button
              onClick={onToggleAvailability}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAvailable ? "bg-[#15803d]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Row: Active Assignments & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assignments */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-5 h-5 text-[#15803d]" />
              <h3 className="font-semibold text-base text-slate-900">Active Assignments</h3>
            </div>
            <button 
              onClick={() => onTabChange("assignments")}
              className="text-[#15803d] font-medium text-sm hover:underline"
            >
              View All &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {activeAssignments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <CheckCircle className="w-8 h-8 text-slate-300" />
                No active assignments
              </div>
            ) : (
              activeAssignments.slice(0, 2).map((item) => (
                <div key={item.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-slate-900">{item.disaster}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.status === 'in-progress' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-sky-100 text-sky-700 border border-sky-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{item.task}</p>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location: {item.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[380px]">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-base text-slate-900">Recent Alerts</h3>
            </div>
            <button 
              onClick={() => onTabChange("alerts")}
              className="text-[#15803d] font-medium text-sm hover:underline"
            >
              View All &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {alerts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
                No active alerts
              </div>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      alert.priority === 'high' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : alert.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-[10px]">{alert.time}</span>
                  </div>
                  <p className="text-slate-700 text-xs font-medium leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Counter widgets at the bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {/* Total Assignments */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center gap-1.5">
          <span className="font-bold text-3xl text-[#15803d]">{totalCount}</span>
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total Assignments</span>
        </div>

        {/* Active Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center gap-1.5">
          <span className="font-bold text-3xl text-amber-500">{activeCount}</span>
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Active Tasks</span>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center gap-1.5">
          <span className="font-bold text-3xl text-emerald-600">{completedCount}</span>
          <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Completed</span>
        </div>
      </div>
    </div>
  );
}
