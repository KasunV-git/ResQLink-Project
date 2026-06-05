import { Check, X, MapPin, ClipboardList, ClipboardCheck } from "lucide-react";

export default function Assignments({ assignments, onCancelAssignment, onCompleteAssignment }) {
  const activeAssignments = assignments.filter((a) => a.status !== "completed");
  const completedAssignments = assignments.filter((a) => a.status === "completed");

  return (
    <div className="w-full flex flex-col gap-8" data-name="AdminAssignments">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">Assignments Master Log</h1>
        <p className="text-slate-500 text-base">View and manage all volunteer dispatches and incident reports</p>
      </div>

      {/* Active Assignments */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <ClipboardList className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-base text-slate-800">
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
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Disaster / Incident</th>
                  <th className="px-6 py-3">Task Details</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                {activeAssignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.volunteerName}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">{item.disaster}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{item.task}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-normal">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.status === "in-progress"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-sky-100 text-sky-700 border border-sky-200"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-normal">{item.assignedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onCompleteAssignment(item.id)}
                          title="Mark Task as Completed"
                          className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-sm transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => onCancelAssignment(item.id)}
                          title="Cancel Dispatch Assignment"
                          className="inline-flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-sm transition-colors"
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <ClipboardCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-semibold text-base text-slate-800">
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
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Disaster / Incident</th>
                  <th className="px-6 py-3">Task Details</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-center">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                {completedAssignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.volunteerName}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">{item.disaster}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{item.task}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-normal">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-normal">{item.assignedDate}</td>
                    <td className="px-6 py-4 text-center text-emerald-600">{item.completedDate}</td>
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
