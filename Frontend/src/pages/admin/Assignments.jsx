import { Check, X, MapPin, ClipboardList, ClipboardCheck } from "lucide-react";

export default function Assignments({ assignments, onCancelAssignment, onCompleteAssignment, isDarkMode }) {
  const activeAssignments = assignments.filter((a) => a.status !== "completed");
  const completedAssignments = assignments.filter((a) => a.status === "completed");

  const textHeading = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";
  const bgHeader = isDarkMode ? "bg-slate-950/60" : "bg-slate-50/50";
  const bgRowHover = isDarkMode ? "hover:bg-slate-950/40" : "hover:bg-slate-50/40";
  const divideColor = isDarkMode ? "divide-slate-800" : "divide-slate-100";

  return (
    <div className="w-full flex flex-col gap-8" data-name="AdminAssignments">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${textHeading}`}>Assignments Master Log</h1>
        <p className={`text-base transition-colors ${textMuted}`}>View and manage all volunteer dispatches and incident reports</p>
      </div>

      {/* Active Assignments */}
      <div className={`border rounded-xl shadow-sm overflow-hidden transition-colors ${cardBg}`}>
        <div className={`flex items-center gap-2.5 px-6 py-4 border-b ${borderMuted} ${bgHeader}`}>
          <ClipboardList className="w-5 h-5 text-amber-500" />
          <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
            Active Dispatches ({activeAssignments.length})
          </h2>
        </div>

        {activeAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-normal">
            No active dispatches at this time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderMuted} text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500 bg-slate-950/30" : "text-slate-400 bg-slate-50/20"}`}>
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Disaster / Incident</th>
                  <th className="px-6 py-3">Task Details</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divideColor} text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {activeAssignments.map((item) => (
                  <tr key={item.id} className={`${bgRowHover} transition-colors`}>
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.volunteerName}</td>
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.disaster}</td>
                    <td className={`px-6 py-4 font-normal ${textMuted}`}>{item.task}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 font-normal ${textMuted}`}>
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.status === "in-progress"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center font-normal ${textMuted}`}>{item.assignedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onCompleteAssignment(item.id)}
                          title="Mark Task as Completed"
                          className={`inline-flex items-center gap-1 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-sm transition-colors cursor-pointer ${
                            isDarkMode ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-700 hover:bg-emerald-800"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => onCancelAssignment(item.id)}
                          title="Cancel Dispatch Assignment"
                          className={`inline-flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-sm transition-colors border cursor-pointer ${
                            isDarkMode 
                              ? "bg-slate-950 border-red-500/20 text-red-400 hover:bg-red-500/10" 
                              : "bg-white border-red-200 text-red-600 hover:bg-red-55"
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed Assignments */}
      <div className={`border rounded-xl shadow-sm overflow-hidden transition-colors ${cardBg}`}>
        <div className={`flex items-center gap-2.5 px-6 py-4 border-b ${borderMuted} ${bgHeader}`}>
          <ClipboardCheck className="w-5 h-5 text-emerald-600" />
          <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
            Completed Dispatches ({completedAssignments.length})
          </h2>
        </div>

        {completedAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-normal">
            No completed dispatches logged.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderMuted} text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500 bg-slate-950/30" : "text-slate-400 bg-slate-50/20"}`}>
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Disaster / Incident</th>
                  <th className="px-6 py-3">Task Details</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-center">Completed Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divideColor} text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {completedAssignments.map((item) => (
                  <tr key={item.id} className={`${bgRowHover} transition-colors`}>
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.volunteerName}</td>
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.disaster}</td>
                    <td className={`px-6 py-4 font-normal ${textMuted}`}>{item.task}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 font-normal ${textMuted}`}>
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-center font-normal ${textMuted}`}>{item.assignedDate}</td>
                    <td className="px-6 py-4 text-center text-emerald-500 font-bold">{item.completedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
