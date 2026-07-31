import React from "react";
import { Bell, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo & Name Side-cropped.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import ProfileAvatar from "./ProfileAvatar";

export default function Header({ user, alertsCount, onTabChange, onMenuToggle, onToggleSidebar }) {
  const { t } = useTranslation();

  const handleMenu = onMenuToggle || onToggleSidebar;

  return (
    <header className="w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 shadow-xs">

      {/* Left: hamburger (mobile only) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleMenu}
          className="md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={t("header.openMenu") || "Open menu"}
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
          aria-label={t("header.alertsLabel") || "Alerts"}
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
            {user?.name || t("header.volunteer") || "Profile"}
          </span>
        </button>
      </div>

    </header>
  );
}
