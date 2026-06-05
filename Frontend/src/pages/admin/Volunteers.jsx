import { useState } from "react";
import { UserCheck, UserX, Clipboard, MapPin } from "lucide-react";

export default function Volunteers({ volunteers, onToggleAvailability, onAssign }) {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [disaster, setDisaster] = useState("");
  const [task, setTask] = useState("");
  const [location, setLocation] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVolunteer) return;
    
    setAssignLoading(true);
    setMsg("");
    try {
      await onAssign({
        userId: selectedVolunteer.id,
        disaster: disaster.trim(),
        task: task.trim(),
        location: location.trim()
      });
      setMsg("Task assigned successfully!");
      setDisaster("");
      setTask("");
      setLocation("");
      setTimeout(() => {
        setSelectedVolunteer(null);
        setMsg("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMsg("Failed to assign task. Try again.");
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminVolunteers">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">Volunteers Portal</h1>
          <p className="text-slate-500 text-base">Monitor availability, verify volunteer skills, and dispatch personnel</p>
        </div>
      </div>

      {/* Main Layout split if volunteer is selected for assignment */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Volunteers Table List */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-semibold text-slate-800 text-base">Volunteers Directory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Skills</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Active Tasks</th>
                  <th className="px-6 py-3 text-right">Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm font-medium">
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-normal">
                      No volunteers registered on the platform.
                    </td>
                  </tr>
                ) : (
                  volunteers.map((vol) => (
                    <tr key={vol.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">{vol.name}</span>
                          <span className="text-slate-400 text-xs font-normal">{vol.email}</span>
                          {vol.phone && (
                            <span className="text-slate-400 text-[11px] font-normal mt-0.5">{vol.phone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[280px]">
                        <div className="flex flex-wrap gap-1.5">
                          {vol.skills.length === 0 ? (
                            <span className="text-slate-400 text-xs font-normal italic">None specified</span>
                          ) : (
                            vol.skills.map((s) => (
                              <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded border border-slate-200">
                                {s}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onToggleAvailability(vol.id, vol.isAvailable)}
                          title="Click to toggle availability status"
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase border ${
                            vol.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50"
                              : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100/50"
                          }`}
                        >
                          {vol.isAvailable ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Unavailable</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block font-bold text-xs px-2 py-0.5 rounded-full ${
                          vol.activeAssignmentsCount > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {vol.activeAssignmentsCount} Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedVolunteer(vol);
                            setMsg("");
                          }}
                          disabled={!vol.isAvailable}
                          className="inline-flex items-center gap-1 bg-emerald-700 disabled:bg-slate-100 hover:bg-emerald-800 text-white disabled:text-slate-400 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm disabled:shadow-none transition-colors border disabled:border-slate-200"
                        >
                          Assign Task
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch/Task Assignment Sidebar Form */}
        {selectedVolunteer && (
          <div className="w-full xl:w-[380px] bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4 self-start">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div className="flex flex-col">
                <h3 className="font-semibold text-slate-800 text-base">Dispatch Volunteer</h3>
                <span className="text-slate-500 text-xs font-medium">To: {selectedVolunteer.name}</span>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            {msg && (
              <div className={`text-xs font-semibold p-2.5 rounded border text-center ${
                msg.includes("successfully")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-red-50 text-red-700 border-red-100"
              }`}>
                {msg}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Disaster / Incident</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Downtown Flash Flood"
                    value={disaster}
                    onChange={(e) => setDisaster(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Volunteer Task</label>
                <div className="relative">
                  <Clipboard className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Distribute relief packets"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location / Facility</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Central Community Shelter"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <span className="text-xs font-semibold text-slate-400">Volunteer Skills Match:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedVolunteer.skills.length === 0 ? (
                    <span className="text-slate-400 text-xs italic">No skills listed</span>
                  ) : (
                    selectedVolunteer.skills.map((s) => (
                      <span key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={assignLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm py-2 rounded-lg shadow-sm transition-colors mt-2"
              >
                {assignLoading ? "Dispatching..." : "Confirm Dispatch"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
