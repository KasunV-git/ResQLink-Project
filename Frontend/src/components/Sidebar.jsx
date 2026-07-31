<<<<<<< HEAD
import React from "react";
import { LayoutDashboard, ClipboardList, Award, Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const ITEMS = [
  { id: "dashboard",   key: "sidebar.dashboard",   Icon: LayoutDashboard },
  { id: "assignments", key: "sidebar.assignments",  Icon: ClipboardList   },
  { id: "skills",      key: "sidebar.skills",       Icon: Award           },
  { id: "alerts",      key: "sidebar.alerts",       Icon: Bell            },
  { id: "profile",     key: "sidebar.profile",      Icon: User            },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const { t } = useTranslation();

  return (
    <aside className="w-60 min-w-[240px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-1 overflow-y-auto">
      {ITEMS.map(({ id, key, Icon }, i) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`sidebar-item anim-fade-in-left d-${(i + 1) * 50} w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-none cursor-pointer text-sm font-medium text-left transition-all ${
              active
                ? "bg-[#15803d]/10 dark:bg-[#15803d]/20 text-[#15803d] dark:text-emerald-400 font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Icon
              size={18}
              className={
                active
                  ? "text-[#15803d] dark:text-emerald-400"
                  : "text-slate-400 dark:text-slate-500"
              }
            />
            {t(key)}
          </button>
        );
      })}
    </aside>
=======
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
>>>>>>> kasuni-development
  );
}
