import { Bell, User, Sun, Moon } from "lucide-react";

export default function Header({ user, alertsCount, onTabChange, isDarkMode, onToggleTheme }) {
  return (
    <div className={`border-b-[0.8px] border-solid h-[64px] shrink-0 w-full flex items-center justify-between px-6 z-10 shadow-sm transition-colors duration-200 ${
      isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-[#e5e7eb] text-slate-900"
    }`}>
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onTabChange("dashboard")}
      >
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L6 12V24C6 33.4 14.1 42.2 24 44C33.9 42.2 42 33.4 42 24V12L24 4Z" fill="#15803d"/>
          <path d="M26 16H22V22H16V26H22V32H26V26H32V22H26V16Z" fill="white"/>
        </svg>
        <span className={`font-semibold text-xl tracking-tight transition-colors duration-200 ${
          isDarkMode ? "text-white" : "text-[#0f172a]"
        }`}>ResQLink</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={onToggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isDarkMode ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-100 text-slate-500"
          }`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notification Bell */}
        <button 
          className={`relative block p-2 rounded-full transition-colors cursor-pointer ${
            isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
          }`}
          onClick={() => onTabChange("alerts")}
        >
          <Bell className="w-5 h-5" />
          {alertsCount > 0 && (
            <div className="absolute bg-[#dc2626] border border-white dark:border-slate-900 flex items-center justify-center rounded-full w-5 h-5 -top-1 -right-1">
              <span className="text-[11px] font-bold text-white text-center">
                {alertsCount}
              </span>
            </div>
          )}
        </button>

        {/* Profile Tag */}
        <button 
          className={`flex gap-2.5 items-center justify-center py-1 px-3 rounded-full transition-colors border cursor-pointer ${
            isDarkMode ? "border-slate-800 text-slate-200 hover:bg-slate-800" : "border-slate-200 text-[#0f172a] hover:bg-slate-100"
          }`}
          onClick={() => onTabChange("profile")}
        >
          <div className="bg-[#15803d] flex items-center justify-center rounded-full w-7 h-7">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className={`font-semibold text-sm whitespace-nowrap transition-colors ${
            isDarkMode ? "text-slate-200" : "text-[#0f172a]"
          }`}>
            {user?.name || "Kasun Volunteer"}
          </span>
        </button>
      </div>
    </div>
  );
}
