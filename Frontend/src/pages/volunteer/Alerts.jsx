import React from "react";
import { Bell, Info } from "lucide-react";

export default function Alerts({ alerts }) {
  return (
    <div className="w-full flex flex-col gap-6" data-name="AlertsPage">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">Emergency Alerts</h1>
        <p className="text-slate-500 text-base">Stay updated with alerts and instructions for volunteers</p>
      </div>

      {/* Active Alerts List Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-base text-slate-900">
            Active Alerts ({alerts.length})
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="font-medium">No active emergency alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isHigh = alert.priority === "high";
              const isMedium = alert.priority === "medium";
              
              let borderClass = "border-l-emerald-500";
              let textBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
              
              if (isHigh) {
                borderClass = "border-l-red-500";
                textBg = "bg-red-50 text-red-700 border-red-200";
              } else if (isMedium) {
                borderClass = "border-l-amber-500";
                textBg = "bg-amber-50 text-amber-700 border-amber-200";
              }

              return (
                <div
                  key={alert.id}
                  className={`border border-slate-200 border-l-[4px] rounded-xl p-4 flex flex-col gap-3 shadow-sm ${borderClass}`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded border uppercase ${textBg}`}>
                      {alert.priority} Priority
                    </span>
                    <span className="text-slate-400 font-medium">{alert.time}</span>
                  </div>

                  <p className="text-slate-900 text-base font-semibold leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2.5 mt-0.5">
                    <span className="text-slate-400 font-medium">
                      Source: <span className="text-slate-600 font-semibold">{alert.source}</span>
                    </span>
                    <span className="text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                      {alert.target || "For Volunteers"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
