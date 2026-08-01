import { ClipboardList, Users, ShieldAlert, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { useTranslation } from "react-i18next";

// Extracted Component for Assignment Records
const AssignmentRecord = ({ a, isDarkMode }) => {
  const { t } = useTranslation();
  return (
  <div className={`flex flex-col py-4 px-2 sm:px-4 border-b last:border-0 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
    {/* Top Header */}
    <div className="flex justify-between items-center pb-2">
      <span className={`text-xs ${isDarkMode ? "text-white/60" : "text-slate-500"}`}>
        {t("adminDashboard.volunteer")}: <span className={`text-sm font-medium ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>{a.volunteerName}</span>
      </span>
      <span className={`text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wide ${isDarkMode ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-600"}`}>
        {a.status}
      </span>
    </div>
    {/* Bottom Content */}
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <span className={`text-[15px] font-medium ${isDarkMode ? "text-white/90" : "text-slate-900"}`}>{a.disaster}</span>
        <span className={`text-[13px] ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>{t("adminDashboard.task")}: {a.task}</span>
      </div>
    </div>
  </div>
  );
};

// Extracted Component for Emergency Alert Records
const AlertRecord = ({ alert, isDarkMode }) => {
  const { t } = useTranslation();
  return (
  <div className={`flex flex-col py-4 px-2 sm:px-4 border-b last:border-0 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
    {/* Top Header */}
    <div className="flex justify-between items-center pb-2">
      <span className={`text-xs ${isDarkMode ? "text-white/60" : "text-slate-500"}`}>
        {t("adminDashboard.priority")}: <span className={`text-sm font-medium ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>{alert.priority.toUpperCase()}</span>
      </span>
      <span className={`text-[10px] font-medium px-3 py-1 rounded-full tracking-wide ${isDarkMode ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-600"}`}>
        {alert.time}
      </span>
    </div>
    {/* Bottom Content */}
    <div className="flex flex-col">
      <p className={`text-[13px] leading-relaxed ${isDarkMode ? "text-white/90" : "text-slate-700"}`}>{alert.message}</p>
    </div>
  </div>
  );
};

export default function Dashboard({ volunteers, assignments, alerts, onTabChange, isDarkMode }) {
  const { t } = useTranslation();
  const totalVolunteers = volunteers.length;
  const availableVolunteers = volunteers.filter((v) => v.isAvailable).length;
  const activeAssignments = assignments.filter((a) => a.status !== "completed").length;
  const totalAlerts = alerts.length;

  // Group assignments by date for Recharts Overview Graph
  const dateCounts = {};
  assignments.forEach((a) => {
    const rawDate = a.assignedDate || a.assigned_date;
    if (rawDate) {
      // simplify date (e.g. "4/3/2026" -> "4/3")
      const cleanDate = rawDate.split("/").slice(0, 2).join("/");
      dateCounts[cleanDate] = (dateCounts[cleanDate] || 0) + 1;
    }
  });

  const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
  const trendData = sortedDates.map((date) => ({
    date,
    Dispatches: dateCounts[date],
  }));

  // Fallback dummy historical data if empty
  const chartData = trendData.length > 0 ? trendData : [
    { date: "6/01", Dispatches: 2 },
    { date: "6/02", Dispatches: 4 },
    { date: "6/03", Dispatches: 3 },
    { date: "6/04", Dispatches: 6 },
    { date: "6/05", Dispatches: assignments.length || 5 },
  ];

  const cardClass = `border rounded-lg p-5 shadow-sm flex items-center gap-4 transition-colors duration-200 ${
    isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  }`;

  const headingColor = isDarkMode ? "text-white" : "text-slate-900";
  const textColorMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";
  const bgList = isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100";

  return (
    <div className="w-full max-w-[1000px] flex flex-col gap-8 items-center" data-name="AdminDashboard">
      {/* Title */}
      <div className="flex flex-col gap-1 text-center">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${headingColor}`}>
          {t("adminDashboard.title")}
        </h1>
        <p className={`text-base transition-colors ${textColorMuted}`}>
          {t("adminDashboard.subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="flex flex-wrap justify-center gap-6 w-full">
        <div className={`w-[220px] ${cardClass}`}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-bold text-2xl truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{totalVolunteers}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider truncate ${textColorMuted}`}>{t("adminDashboard.totalVolunteers")}</span>
          </div>
        </div>

        <div className={`w-[220px] ${cardClass}`}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-blue-950/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-bold text-2xl truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{availableVolunteers}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider truncate ${textColorMuted}`}>{t("adminDashboard.availableNow")}</span>
          </div>
        </div>

        <div className={`w-[220px] ${cardClass}`}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-amber-950/40 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-bold text-2xl truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{activeAssignments}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider truncate ${textColorMuted}`}>{t("adminDashboard.activeTasks")}</span>
          </div>
        </div>

        <div className={`w-[220px] ${cardClass}`}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-red-950/40 text-red-400" : "bg-red-50 text-red-600"}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-bold text-2xl truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{totalAlerts}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider truncate ${textColorMuted}`}>{t("adminDashboard.activeAlerts")}</span>
          </div>
        </div>
      </div>

      {/* Overview Analytics Chart */}
      <div className="flex flex-col gap-2 w-full max-w-[900px]">
        <div className="flex flex-col px-1">
          <h3 className={`font-semibold text-lg tracking-tight ${headingColor}`}>{t("adminDashboard.trendTitle")}</h3>
          <p className={`text-xs ${textColorMuted}`}>
            {t("adminDashboard.trendSubtitle")}
          </p>
        </div>
        <div className={`border rounded-lg p-5 md:p-6 shadow-sm flex flex-col transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="flex-1 w-full h-full min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 20 }}>
              <defs>
                <linearGradient id="colorDispatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="date" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11}>
                <Label
                  value={t("adminDashboard.date")}
                  offset={-5}
                  position="insideBottom"
                  style={{
                    fill: isDarkMode ? "#94a3b8" : "#64748b",
                    fontSize: 11,
                    fontWeight: 600
                  }}
                />
              </XAxis>
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11}>
                <Label
                  value={t("adminDashboard.dispatches")}
                  angle={-90}
                  position="insideLeft"
                  offset={0}
                  style={{
                    textAnchor: "middle",
                    fill: isDarkMode ? "#94a3b8" : "#64748b",
                    fontSize: 11,
                    fontWeight: 600
                  }}
                />
              </YAxis>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                  borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                }}
              />
              <Area type="monotone" dataKey="Dispatches" stroke="#10b981" fillOpacity={1} fill="url(#colorDispatches)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-[1000px]">
        {/* Recent Assignments */}
        <div className="flex-1 min-w-[350px] max-w-[500px] flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <h3 className={`font-semibold text-lg tracking-tight ${headingColor}`}>{t("adminDashboard.recentAssignments")}</h3>
            <button
              onClick={() => onTabChange("assignments")}
              className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:underline cursor-pointer"
            >
              {t("adminDashboard.manage")}
            </button>
          </div>
          <div className={`border rounded-2xl p-6 md:p-8 shadow-xl flex flex-col transition-colors duration-200 backdrop-blur-xl ${
            isDarkMode ? "bg-[#333333]/70 border-white/10" : "bg-white/60 border-slate-200/50"
          }`}>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {assignments.length === 0 ? (
              <div className={`flex-1 flex items-center justify-center text-sm ${textColorMuted}`}>
                {t("adminDashboard.noAssignments")}
              </div>
            ) : (
              assignments.slice(0, 5).map((a) => (
                <AssignmentRecord key={a.id} a={a} isDarkMode={isDarkMode} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Broadcasts */}
        <div className="flex-1 min-w-[350px] max-w-[500px] flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <h3 className={`font-semibold text-lg tracking-tight ${headingColor}`}>{t("adminDashboard.emergencyAlerts")}</h3>
            <button
              onClick={() => onTabChange("alerts")}
              className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:underline cursor-pointer"
            >
              {t("adminDashboard.broadcast")}
            </button>
          </div>
          <div className={`border rounded-2xl p-6 md:p-8 shadow-xl flex flex-col transition-colors duration-200 backdrop-blur-xl ${
            isDarkMode ? "bg-[#333333]/70 border-white/10" : "bg-white/60 border-slate-200/50"
          }`}>
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {alerts.length === 0 ? (
              <div className={`flex-1 flex items-center justify-center text-sm ${textColorMuted}`}>
                {t("adminDashboard.noAlerts")}
              </div>
            ) : (
              alerts.slice(0, 4).map((alert) => (
                <AlertRecord key={alert.id} alert={alert} isDarkMode={isDarkMode} />
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
