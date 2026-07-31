import { useState } from "react";
import { UserCheck, UserX, Clipboard, MapPin } from "lucide-react";

export default function Volunteers({ volunteers, onToggleAvailability, onAssign, isDarkMode }) {
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

  const textHeading = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";
  const bgHeader = isDarkMode ? "bg-slate-950/60" : "bg-slate-50/50";
  const bgRowHover = isDarkMode ? "hover:bg-slate-950/40" : "hover:bg-slate-50/40";
  const divideColor = isDarkMode ? "divide-slate-800" : "divide-slate-100";

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminVolunteers">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${textHeading}`}>Volunteers Portal</h1>
          <p className={`text-base transition-colors ${textMuted}`}>Monitor availability, verify volunteer skills, and dispatch personnel</p>
        </div>
      </div>

      {/* Main Layout split if volunteer is selected for assignment */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Volunteers Table List */}
        <div className={`flex-1 border rounded-xl shadow-sm overflow-hidden transition-colors ${cardBg}`}>
          <div className={`px-6 py-4 border-b ${borderMuted} ${bgHeader}`}>
            <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Volunteers Directory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderMuted} text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500 bg-slate-950/30" : "text-slate-400 bg-slate-50/20"}`}>
                  <th className="px-6 py-3">Volunteer</th>
                  <th className="px-6 py-3">Skills</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Active Tasks</th>
                  <th className="px-6 py-3 text-right">Dispatch</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divideColor} text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-normal">
                      No volunteers registered on the platform.
                    </td>
                  </tr>
                ) : (
                  volunteers.map((vol) => (
                    <tr key={vol.id} className={`${bgRowHover} transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{vol.name}</span>
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
                              <span key={s} className={`text-xs px-2 py-0.5 rounded border ${
                                isDarkMode 
                                  ? "bg-slate-950 text-slate-400 border-slate-800" 
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}>
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
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase border cursor-pointer transition-colors ${
                            vol.isAvailable
                              ? isDarkMode
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50"
                              : isDarkMode
                              ? "bg-slate-800/40 text-slate-500 border-slate-700 hover:bg-slate-800/80"
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
                            ? isDarkMode
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-amber-100 text-amber-700"
                            : isDarkMode
                            ? "bg-slate-800 text-slate-500 border border-slate-700"
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
                          className={`inline-flex items-center gap-1 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors border cursor-pointer ${
                            isDarkMode
                              ? "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-850"
                              : "bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                          }`}
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
          <div className={`w-full xl:w-[380px] border rounded-xl p-6 shadow-sm flex flex-col gap-4 self-start transition-colors ${cardBg}`}>
            <div className={`flex justify-between items-start pb-2 border-b ${borderMuted}`}>
              <div className="flex flex-col">
                <h3 className={`font-semibold text-base ${isDarkMode ? "text-white" : "text-slate-800"}`}>Dispatch Volunteer</h3>
                <span className="text-slate-500 text-xs font-medium">To: {selectedVolunteer.name}</span>
              </div>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className={`text-sm font-medium cursor-pointer transition-colors ${
                  isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                }`}
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
                <label className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-700"
                }`}>Disaster / Incident</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Downtown Flash Flood"
                    value={disaster}
                    onChange={(e) => setDisaster(e.target.value)}
                    className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      isDarkMode 
                        ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-700"
                }`}>Volunteer Task</label>
                <div className="relative">
                  <Clipboard className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Distribute relief packets"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className={`w-full text-sm rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      isDarkMode 
                        ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-700"
                }`}>Location / Facility</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Central Community Shelter"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full text-sm rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      isDarkMode 
                        ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <span className={`text-xs font-semibold ${textMuted}`}>Volunteer Skills Match:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedVolunteer.skills.length === 0 ? (
                    <span className="text-slate-400 text-xs italic">No skills listed</span>
                  ) : (
                    selectedVolunteer.skills.map((s) => (
                      <span key={s} className={`border text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isDarkMode
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-900/50"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}>
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={assignLoading}
                className={`w-full font-semibold text-sm py-2 rounded-lg shadow-sm transition-colors mt-2 cursor-pointer ${
                  isDarkMode
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
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
