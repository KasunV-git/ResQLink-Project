import React from "react";
import { LayoutDashboard, ClipboardList, Award, Bell, User } from "lucide-react";

export default function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "assignments", label: "My Assignments", icon: ClipboardList },
    { id: "skills", label: "Skills", icon: Award },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="bg-white border-[#e5e7eb] border-r-[0.8px] border-solid w-[256px] h-full shrink-0 flex flex-col pt-4 px-4 gap-1 shadow-sm">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
              isActive
                ? "bg-[#15803d]/10 text-[#15803d]"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-[#15803d]" : "text-slate-400"}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
