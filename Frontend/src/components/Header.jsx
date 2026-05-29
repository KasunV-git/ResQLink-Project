import React from "react";
import { Bell, User } from "lucide-react";

export default function Header({ user, alertsCount, onTabChange }) {
  return (
    <div className="bg-white border-[#e5e7eb] border-b-[0.8px] border-solid h-[64px] shrink-0 w-full flex items-center justify-between px-6 z-10 shadow-sm">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onTabChange("dashboard")}
      >
        <img 
          src="https://www.figma.com/api/mcp/asset/7608400e-4ebc-43d4-8301-b4d05fa0b059" 
          alt="ResQLink Logo" 
          className="h-10 w-auto object-contain"
        />
        <span className="font-semibold text-xl text-[#0f172a] tracking-tight">ResQLink</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button 
          className="relative block p-2 rounded-full hover:bg-slate-100 transition-colors"
          onClick={() => onTabChange("alerts")}
        >
          <Bell className="w-5 h-5 text-slate-500" />
          {alertsCount > 0 && (
            <div className="absolute bg-[#dc2626] border border-white flex items-center justify-center rounded-full w-5 h-5 -top-1 -right-1">
              <span className="text-[11px] font-bold text-white text-center">
                {alertsCount}
              </span>
            </div>
          )}
        </button>

        {/* Profile Tag */}
        <button 
          className="flex gap-2.5 items-center justify-center py-1 px-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
          onClick={() => onTabChange("profile")}
        >
          <div className="bg-[#15803d] flex items-center justify-center rounded-full w-7 h-7">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[#0f172a] text-sm whitespace-nowrap">
            {user?.name || "Kasun Volunteer"}
          </span>
        </button>
      </div>
    </div>
  );
}
