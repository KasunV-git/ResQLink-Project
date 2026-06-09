import React from "react";
import { Bell, User, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo & Name Side-cropped.svg";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ user, alertsCount, onTabChange, onMenuToggle }) {
  const { t } = useTranslation();

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

      {/* Left: hamburger (mobile only) + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label={t("header.openMenu")}
        >
          <Menu size={20} />
        </button>
        <img
          src={logo}
          alt="ResQLink"
          className="h-9 w-auto cursor-pointer"
          onClick={() => onTabChange("dashboard")}
        />
      </div>

      {/* Right: language switcher + bell + profile */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Language Switcher */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Bell */}
        <button
          onClick={() => onTabChange("alerts")}
          className="relative bg-transparent border-none cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label={t("header.alertsLabel")}
        >
          <Bell size={20} color="#64748b" />
          {alertsCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white"
              style={{ width: 18, height: 18 }}>
              {alertsCount}
            </span>
          )}
        </button>

        {/* Profile pill */}
        <button
          onClick={() => onTabChange("profile")}
          className="flex items-center gap-2.5 bg-transparent border border-slate-200 rounded-full py-1.5 pr-3.5 pl-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#15803d] flex items-center justify-center flex-shrink-0">
            <User size={15} color="#fff" />
          </div>
          <span className="hidden md:block text-sm font-semibold text-slate-900 whitespace-nowrap">
            {user?.name || t("header.volunteer")}
          </span>
        </button>
      </div>

    </header>
  );
}
