<<<<<<< HEAD
import React from "react";
import { Bell, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo & Name Side-cropped.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import ProfileAvatar from "./ProfileAvatar";

export default function Header({ user, alertsCount, onTabChange, onMenuToggle }) {
  const { t } = useTranslation();

  return (
    <header className="w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 shadow-xs">

      {/* Left: hamburger (mobile only) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={t("header.openMenu")}
        >
          <Menu size={20} />
        </button>
        <img
          src={logo}
          alt="ResQLink"
          className="h-9 w-auto cursor-pointer brightness-100 dark:brightness-110"
          onClick={() => onTabChange("dashboard")}
        />
      </div>

      {/* Right: theme toggle + language switcher + bell + profile */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Theme Toggle */}
        <ThemeToggle size={18} />

        {/* Language Switcher */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Bell */}
        <button
          onClick={() => onTabChange("alerts")}
          className="relative bg-transparent border-none cursor-pointer p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          aria-label={t("header.alertsLabel")}
        >
          <Bell size={20} className="text-slate-500 dark:text-slate-400" />
          {alertsCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900"
              style={{ width: 18, height: 18 }}>
              {alertsCount}
            </span>
          )}
        </button>

        {/* Profile pill */}
        <button
          onClick={() => onTabChange("profile")}
          className="flex items-center gap-2.5 bg-transparent border border-slate-200 dark:border-slate-700 rounded-full p-1 md:pr-3.5 md:pl-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ProfileAvatar user={user} size="sm" />
          <span className="hidden md:block text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {user?.name || t("header.volunteer")}
          </span>
        </button>
      </div>

    </header>
=======
import { Bell, User, Sun, Moon, Menu } from "lucide-react";

export default function Header({ user, alertsCount, onTabChange, isDarkMode, onToggleTheme, onToggleSidebar }) {
  return (
    <div className={`border-b-[0.8px] border-solid h-[64px] shrink-0 w-full flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm transition-colors duration-200 ${
      isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-[#e5e7eb] text-slate-900"
    }`}>
      {/* Brand Logo & Menu Button */}
      <div className="flex items-center gap-2">
        {/* Mobile Menu Button */}
        <button 
          onClick={onToggleSidebar}
          className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer mr-1 ${
            isDarkMode ? "hover:bg-slate-800 text-white hover:text-slate-200" : "hover:bg-slate-100 text-slate-700 hover:text-slate-900"
          }`}
          title="Toggle Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

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
          <span className={`hidden sm:inline font-semibold text-sm whitespace-nowrap transition-colors ${
            isDarkMode ? "text-slate-200" : "text-[#0f172a]"
          }`}>
            {user?.name || "Kasun Volunteer"}
          </span>
        </button>
      </div>
    </div>
>>>>>>> kasuni-development
  );
}
