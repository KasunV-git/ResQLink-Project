import { useState } from "react";
import { Check, X, MapPin, ClipboardList, ClipboardCheck, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Assignments({ assignments, onCancelAssignment, onCompleteAssignment, isDarkMode }) {
  const { t } = useTranslation();
  
  // Filter states for Active Assignments
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDisaster, setFilterDisaster] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states for Completed Assignments
  const [filterCompletedDisaster, setFilterCompletedDisaster] = useState("");
  const [searchCompletedQuery, setSearchCompletedQuery] = useState("");

  const activeAssignments = assignments.filter((a) => a.status !== "completed");
  const completedAssignments = assignments.filter((a) => a.status === "completed");

  const uniqueDisasters = Array.from(new Set(activeAssignments.map(a => a.disaster))).filter(Boolean);

  const filteredActiveAssignments = activeAssignments.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchDisaster = filterDisaster === "" || a.disaster === filterDisaster;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = searchQuery === "" || 
      (a.volunteerName && a.volunteerName.toLowerCase().includes(searchLower)) || 
      (a.task && a.task.toLowerCase().includes(searchLower)) ||
      (a.location && a.location.toLowerCase().includes(searchLower));
    return matchStatus && matchDisaster && matchSearch;
  });

  const uniqueCompletedDisasters = Array.from(new Set(completedAssignments.map(a => a.disaster))).filter(Boolean);

  const filteredCompletedAssignments = completedAssignments.filter((a) => {
    const matchDisaster = filterCompletedDisaster === "" || a.disaster === filterCompletedDisaster;
    const searchLower = searchCompletedQuery.toLowerCase();
    const matchSearch = searchCompletedQuery === "" || 
      (a.volunteerName && a.volunteerName.toLowerCase().includes(searchLower)) || 
      (a.task && a.task.toLowerCase().includes(searchLower)) ||
      (a.location && a.location.toLowerCase().includes(searchLower));
    return matchDisaster && matchSearch;
  });

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
      <div className="flex flex-col gap-1 text-center">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${textHeading}`}>{t("adminAssignments.title")}</h1>
        <p className={`text-base transition-colors ${textMuted}`}>{t("adminAssignments.subtitle")}</p>
      </div>

      {/* Active Assignments */}
      <div className={`border rounded-xl shadow-sm overflow-hidden transition-colors ${cardBg}`}>
        <div className={`flex items-center gap-2.5 px-6 py-4 border-b ${borderMuted} ${bgHeader}`}>
          <ClipboardList className="w-5 h-5 text-amber-500" />
          <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
            {t("adminAssignments.activeDispatches", { count: activeAssignments.length })}
          </h2>
        </div>

        {/* Filter Bar */}
        <div className={`flex flex-col md:flex-row gap-3 px-6 py-4 border-b ${borderMuted} ${isDarkMode ? "bg-slate-950/30" : "bg-slate-50/30"}`}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search volunteer, task, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs font-semibold rounded-lg py-1.5 pl-9 pr-3 border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500" 
                  : "bg-white border-slate-300 text-slate-700 placeholder-slate-400"
              }`}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full text-xs font-semibold rounded-lg py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="assigned">Assigned (Not Started)</option>
              <option value="in-progress">In-Progress</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterDisaster}
              onChange={(e) => setFilterDisaster(e.target.value)}
              className={`w-full text-xs font-semibold rounded-lg py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              <option value="">All Disasters</option>
              {uniqueDisasters.map(d => (
                <option key={d} value={d}>{d.length > 25 ? d.substring(0, 25) + "..." : d}</option>
              ))}
            </select>
          </div>
        </div>

        {activeAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-normal">
            {t("adminAssignments.noActive")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderMuted} text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500 bg-slate-950/30" : "text-slate-400 bg-slate-50/20"}`}>
                  <th className="px-6 py-3">{t("adminAssignments.colVolunteer")}</th>
                  <th className="px-6 py-3">{t("adminAssignments.colDisaster")}</th>
                  <th className="px-6 py-3">{t("adminAssignments.colTask")}</th>
                  <th className="px-6 py-3">{t("adminAssignments.colLocation")}</th>
                  <th className="px-6 py-3 text-center">{t("adminAssignments.colStatus")}</th>
                  <th className="px-6 py-3 text-center">{t("adminAssignments.colAssignedDate")}</th>
                  <th className="px-6 py-3 text-right">{t("adminAssignments.colActions")}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divideColor} text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {filteredActiveAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-normal">
                      No assignments match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredActiveAssignments.map((item) => (
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
                          <span>{t("adminAssignments.complete")}</span>
                        </button>
                        <button
                          onClick={() => onCancelAssignment(item.id)}
                          title="Cancel Dispatch Assignment"
                          className={`inline-flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-sm transition-colors border cursor-pointer ${
                            isDarkMode 
                              ? "bg-slate-950 border-red-500/20 text-red-400 hover:bg-red-500/10" 
                              : "bg-white border-red-200 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t("adminAssignments.cancel")}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
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
            {t("adminAssignments.completedDispatches", { count: completedAssignments.length })}
          </h2>
        </div>

        {/* Filter Bar for Completed */}
        <div className={`flex flex-col md:flex-row gap-3 px-6 py-4 border-b ${borderMuted} ${isDarkMode ? "bg-slate-950/30" : "bg-slate-50/30"}`}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search volunteer, task, or location..."
              value={searchCompletedQuery}
              onChange={(e) => setSearchCompletedQuery(e.target.value)}
              className={`w-full text-xs font-semibold rounded-lg py-1.5 pl-9 pr-3 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500" 
                  : "bg-white border-slate-300 text-slate-700 placeholder-slate-400"
              }`}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={filterCompletedDisaster}
              onChange={(e) => setFilterCompletedDisaster(e.target.value)}
              className={`w-full text-xs font-semibold rounded-lg py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                isDarkMode ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              <option value="">All Disasters</option>
              {uniqueCompletedDisasters.map(d => (
                <option key={d} value={d}>{d.length > 35 ? d.substring(0, 35) + "..." : d}</option>
              ))}
            </select>
          </div>
        </div>

        {completedAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-normal">
            {t("adminAssignments.noCompleted")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${borderMuted} text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500 bg-slate-950/30" : "text-slate-400 bg-slate-50/20"}`}>
                  <th className="px-6 py-3">{t("adminAssignments.colVolunteer")}</th>
                  <th className="px-6 py-3">{t("adminAssignments.colDisaster")}</th>
                  <th className="px-6 py-3">{t("adminAssignments.colTask")}</th>
                  <th className="px-6 py-3">{t("adminAssignments.colLocation")}</th>
                  <th className="px-6 py-3 text-center">{t("adminAssignments.colAssignedDate")}</th>
                  <th className="px-6 py-3 text-center">{t("adminAssignments.colCompletedDate")}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${divideColor} text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                {filteredCompletedAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-normal">
                      No completed assignments match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCompletedAssignments.map((item) => (
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
                )))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
