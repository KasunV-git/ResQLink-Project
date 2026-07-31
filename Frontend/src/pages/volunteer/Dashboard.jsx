import React from "react";
import { AlertCircle, MapPin, ClipboardList, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Dashboard({ user, onToggleAvailability, activeAssignments, completedAssignments, alerts, onTabChange }) {
  const { t } = useTranslation();
  const isAvailable    = user?.isAvailable ?? true;
  const activeCount    = activeAssignments.length;
  const completedCount = completedAssignments.length;
  const totalCount     = activeCount + completedCount;

  return (
    <div className="flex flex-col w-full gap-4 md:gap-5">

      {/* Title */}
      <div className="anim-fade-in-up">
        <h1 className="text-2xl md:text-[26px] font-bold text-slate-900 dark:text-white mb-1">{t("dashboard.title")}</h1>
        <p className="text-sm md:text-[14px] text-slate-500 dark:text-slate-400">
          {t("dashboard.subtitle", { name: user?.name || t("header.volunteer") })}
        </p>
      </div>

      {/* Availability toggle card */}
      <div className={`anim-fade-in-up d-100 hover-card bg-white dark:bg-slate-900 rounded-2xl px-5 py-4 md:px-6 border transition-all shadow-xs ${
        isAvailable ? "border-[#15803d] dark:border-emerald-600" : "border-slate-200 dark:border-slate-800"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white mb-1">{t("dashboard.availabilityStatus")}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isAvailable ? t("dashboard.availableDesc") : t("dashboard.unavailableDesc")}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`text-sm font-semibold transition-colors duration-300 ${
              isAvailable ? "text-[#15803d] dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
            }`}>
              {isAvailable ? t("dashboard.available") : t("dashboard.unavailable")}
            </span>
            {/* Toggle switch */}
            <div onClick={onToggleAvailability}
              className={`relative cursor-pointer flex-shrink-0 rounded-full transition-colors duration-300 w-12 h-6.5 ${
                isAvailable ? "bg-[#15803d] ring-4 ring-[#15803d]/20" : "bg-slate-300 dark:bg-slate-700"
              }`}>
              <div className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
                isAvailable ? "translate-x-[22px]" : "translate-x-0"
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Active Assignments */}
        <div className="anim-fade-in-up d-150 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-[#15803d] dark:text-emerald-400" />
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{t("dashboard.activeAssignments")}</span>
            </div>
            <button onClick={() => onTabChange("assignments")}
              className="bg-transparent border-none cursor-pointer text-[13px] font-semibold text-[#15803d] dark:text-emerald-400 hover:opacity-70 transition-opacity">
              {t("dashboard.viewAll")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
            {activeAssignments.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 py-8">
                <CheckCircle size={32} className="text-slate-300 dark:text-slate-700" />
                <span className="text-sm">{t("dashboard.noActiveAssignments")}</span>
              </div>
            ) : activeAssignments.slice(0, 2).map((item) => (
              <div key={item.id}
                className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.disaster}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.status === "in-progress"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                      : "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-1.5">{item.task}</p>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-400 dark:text-slate-500">
                  <MapPin size={12} /><span>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="anim-fade-in-up d-200 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
              <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{t("dashboard.recentAlerts")}</span>
            </div>
            <button onClick={() => onTabChange("alerts")}
              className="bg-transparent border-none cursor-pointer text-[13px] font-semibold text-[#15803d] dark:text-emerald-400 hover:opacity-70 transition-opacity">
              {t("dashboard.viewAll")}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5">
            {alerts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm py-8">{t("dashboard.noActiveAlerts")}</div>
            ) : alerts.slice(0, 3).map(alert => {
              const cfg = alert.priority === "high"
                ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50"
                : alert.priority === "medium"
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50";
              return (
                <div key={alert.id} className={`rounded-xl p-3 border transition-transform hover:translate-x-1 ${cfg}`}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 uppercase">
                      {alert.priority}
                    </span>
                    <span className="text-[11px] opacity-75">{alert.time}</span>
                  </div>
                  <p className="text-[13px] font-medium leading-snug m-0">{alert.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { labelKey: "dashboard.totalAssignments", value: totalCount,    color: "text-[#15803d] dark:text-emerald-400" },
          { labelKey: "dashboard.activeTasks",      value: activeCount,   color: "text-amber-600 dark:text-amber-400" },
          { labelKey: "dashboard.completed",        value: completedCount, color: "text-emerald-600 dark:text-emerald-400" },
        ].map(({ labelKey, value, color }, i) => (
          <div key={labelKey} className={`anim-fade-in-up hover-card d-${(i+2)*100} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center p-4 md:p-5 shadow-xs`}>
            <div className={`text-3xl md:text-4xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-[10px] md:text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider leading-tight">
              {t(labelKey)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
