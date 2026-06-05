import { ClipboardList, Users, ShieldAlert, CheckCircle } from "lucide-react";

export default function Dashboard({ volunteers, assignments, alerts, onTabChange }) {
  const totalVolunteers = volunteers.length;
  const availableVolunteers = volunteers.filter((v) => v.isAvailable).length;
  const activeAssignments = assignments.filter((a) => a.status !== "completed").length;
  const totalAlerts = alerts.length;

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminDashboard">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 text-base">Monitor platform stats, alerts, and volunteer coordination</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 rounded-lg p-3">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-slate-900">{totalVolunteers}</span>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Volunteers</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 rounded-lg p-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-slate-900">{availableVolunteers}</span>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Available Now</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 rounded-lg p-3">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-slate-900">{activeAssignments}</span>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Tasks</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-red-50 text-red-600 rounded-lg p-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-slate-900">{totalAlerts}</span>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Alerts</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-semibold text-base text-slate-900">Recent Assignments</h3>
            <button
              onClick={() => onTabChange("assignments")}
              className="text-emerald-700 font-semibold text-sm hover:underline"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {assignments.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                No assignments logged
              </div>
            ) : (
              assignments.slice(0, 5).map((a) => (
                <div key={a.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm text-slate-900">{a.volunteerName}</span>
                    <span className="text-slate-500 text-xs">{a.disaster} &bull; {a.task}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    a.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : a.status === "in-progress"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-sky-100 text-sky-700"
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Broadcasts */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-semibold text-base text-slate-900">Emergency Alerts</h3>
            <button
              onClick={() => onTabChange("alerts")}
              className="text-emerald-700 font-semibold text-sm hover:underline"
            >
              Broadcast &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {alerts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                No active emergency alerts
              </div>
            ) : (
              alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={`font-bold px-1.5 py-0.5 rounded uppercase ${
                      alert.priority === "high"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : alert.priority === "medium"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}>
                      {alert.priority}
                    </span>
                    <span className="text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-slate-700 text-xs font-medium leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
