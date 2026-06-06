import React from "react";
import { Check, MapPin, ClipboardCheck, ClipboardList, CheckCircle } from "lucide-react";

export default function Assignments({ activeAssignments, completedAssignments, onCompleteAssignment }) {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-8" data-name="AssignmentsPage">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">My Assignments</h1>
        <p className="text-slate-500 text-base">View and manage your volunteer tasks</p>
      </div>

      {/* Active Assignments Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-slate-50/50">
          <ClipboardList className="w-5 h-5 text-[#15803d]" />
          <h2 className="font-semibold text-sm md:text-base text-slate-900">
            Active Assignments ({activeAssignments.length})
          </h2>
        </div>

        {activeAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <CheckCircle className="w-10 h-10 text-emerald-600/20" />
            <p className="font-medium">All caught up! No active assignments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3">Disaster</th>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                {activeAssignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.disaster}</td>
                    <td className="px-6 py-4 text-slate-500 font-normal">{item.task}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-normal">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        item.status === "in-progress"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-sky-100 text-sky-700 border border-sky-200"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-normal">{item.assignedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onCompleteAssignment(item.id)}
                        className="inline-flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed Assignments Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 bg-slate-50/50">
          <ClipboardCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="font-semibold text-sm md:text-base text-slate-900">
            Completed Assignments ({completedAssignments.length})
          </h2>
        </div>

        {completedAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="font-medium">No completed assignments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3">Disaster</th>
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {completedAssignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors font-medium">
                    <td className="px-6 py-4 font-semibold text-slate-900">{item.disaster}</td>
                    <td className="px-6 py-4 text-slate-500">{item.task}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">{item.completedDate}</td>
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
