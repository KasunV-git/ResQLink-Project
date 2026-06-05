import { ClipboardList, Users, ShieldAlert, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard({ volunteers, assignments, alerts, onTabChange, isDarkMode }) {
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

  const cardClass = `border rounded-xl p-5 shadow-sm flex items-center gap-4 transition-colors duration-200 ${
    isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
  }`;

  const headingColor = isDarkMode ? "text-white" : "text-slate-900";
  const textColorMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";
  const bgList = isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100";

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminDashboard">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${headingColor}`}>
          System Overview
        </h1>
        <p className={`text-base transition-colors ${textColorMuted}`}>
          Monitor platform stats, alerts, and volunteer coordination
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={cardClass}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-emerald-950/40 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-2xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>{totalVolunteers}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${textColorMuted}`}>Total Volunteers</span>
          </div>
        </div>

        <div className={cardClass}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-blue-950/40 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-2xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>{availableVolunteers}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${textColorMuted}`}>Available Now</span>
          </div>
        </div>

        <div className={cardClass}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-amber-950/40 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-2xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>{activeAssignments}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${textColorMuted}`}>Active Tasks</span>
          </div>
        </div>

        <div className={cardClass}>
          <div className={`rounded-lg p-3 ${isDarkMode ? "bg-red-950/40 text-red-400" : "bg-red-50 text-red-600"}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-2xl ${isDarkMode ? "text-white" : "text-slate-900"}`}>{totalAlerts}</span>
            <span className={`text-xs font-semibold uppercase tracking-wider ${textColorMuted}`}>Active Alerts</span>
          </div>
        </div>
      </div>

      {/* Overview Analytics Chart */}
      <div className={`border rounded-xl p-6 shadow-sm h-[320px] flex flex-col transition-colors duration-200 ${
        isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <div className="mb-4">
          <h3 className="font-semibold text-base">Operational Dispatch Trend</h3>
          <p className={`text-xs ${textColorMuted}`}>
            Daily volume of volunteer dispatches and emergency assignments
          </p>
        </div>
        <div className="flex-1 w-full h-full min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDispatches" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="date" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className={`border rounded-xl p-6 shadow-sm flex flex-col h-[400px] transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className={`flex justify-between items-center pb-4 border-b ${borderMuted} mb-4`}>
            <h3 className="font-semibold text-base">Recent Assignments</h3>
            <button
              onClick={() => onTabChange("assignments")}
              className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:underline cursor-pointer"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {assignments.length === 0 ? (
              <div className={`flex-1 flex items-center justify-center text-sm ${textColorMuted}`}>
                No assignments logged
              </div>
            ) : (
              assignments.slice(0, 5).map((a) => (
                <div key={a.id} className={`border rounded-lg p-3 flex justify-between items-center ${bgList}`}>
                  <div className="flex flex-col gap-1">
                    <span className={`font-semibold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>{a.volunteerName}</span>
                    <span className={`text-xs ${textColorMuted}`}>{a.disaster} &bull; {a.task}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    a.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : a.status === "in-progress"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Broadcasts */}
        <div className={`border rounded-xl p-6 shadow-sm flex flex-col h-[400px] transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className={`flex justify-between items-center pb-4 border-b ${borderMuted} mb-4`}>
            <h3 className="font-semibold text-base">Emergency Alerts</h3>
            <button
              onClick={() => onTabChange("alerts")}
              className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm hover:underline cursor-pointer"
            >
              Broadcast &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {alerts.length === 0 ? (
              <div className={`flex-1 flex items-center justify-center text-sm ${textColorMuted}`}>
                No active emergency alerts
              </div>
            ) : (
              alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-3 flex flex-col gap-1.5 ${bgList}`}>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-bold px-1.5 py-0.5 rounded uppercase ${
                      alert.priority === "high"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : alert.priority === "medium"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}>
                      {alert.priority}
                    </span>
                    <span className={textColorMuted}>{alert.time}</span>
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
