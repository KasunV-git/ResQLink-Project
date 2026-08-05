import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import { CheckCircle, XCircle, AlertTriangle, Megaphone, Loader2, ChevronDown, ChevronUp, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function ReportRow({ report, isDarkMode, getStatusBadge, handleActionClick, processingId, t, onViewMap }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <>
      <tr 
        className={`hover:${isDarkMode ? "bg-slate-800/50" : "bg-slate-50"} cursor-pointer transition-colors`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{report.type}</span>
            <span className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {new Date(report.created_at).toLocaleString()}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate max-w-[200px] block" title={report.location}>{report.location}</span>
            {report.lat && report.lng && (
              <button 
                onClick={(e) => { e.stopPropagation(); onViewMap(report); }} 
                className={`p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 ${isDarkMode ? "hover:bg-slate-700 text-blue-400" : "hover:bg-slate-200 text-blue-600"}`}
                title="View Exact Location"
              >
                <MapPin className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{report.reporter?.name || 'Unknown'}</span>
            <span className={`text-xs mt-0.5 capitalize ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {report.reporter?.role || 'Citizen'}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          {getStatusBadge(report.verification_status)}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-4">
            {report.verification_status === "pending" && (
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleActionClick(report, "approve"); }}
                  disabled={processingId === report.disaster_id}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {processingId === report.disaster_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  {t("adminDisasterReports.approveBtn")}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleActionClick(report, "reject"); }}
                  disabled={processingId === report.disaster_id}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer ${
                    isDarkMode ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  {t("adminDisasterReports.rejectBtn")}
                </button>
              </div>
            )}
            <div className={`p-1 rounded-md transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </td>
      </tr>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <tr className="bg-slate-50 dark:bg-slate-800/40">
            <td colSpan={5} className="p-0 border-b border-slate-100 dark:border-slate-800">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                  <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Description</strong>
                      <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-medium">{report.description || 'Not Mentioned'}</p>
                    </div>
                    <div>
                      <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nearest Landmark</strong>
                      <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-medium">{report.landmark || 'Not Mentioned'}</p>
                    </div>
                    <div>
                      <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estimated People Affected</strong>
                      <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-medium">{report.people_affected || 'Not Mentioned'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DisasterReports({ isDarkMode, onReportsUpdated }) {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for announcement modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceData, setAnnounceData] = useState({
    shouldAnnounce: false,
    priority: "High",
    message: ""
  });
  const [processingId, setProcessingId] = useState(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Map modal state
  const [selectedMapReport, setSelectedMapReport] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/disasters/admin/reports");
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert(t("adminDisasterReports.errorMsg"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleActionClick = (report, action) => {
    if (action === "approve") {
      setSelectedReport(report);
      setAnnounceData({
        shouldAnnounce: true,
        priority: "High",
        message: `Verified Disaster: ${report.type} at ${report.location}. Please exercise caution.`
      });
      setShowAnnounceModal(true);
    } else {
      processAction(report.disaster_id, "reject");
    }
  };

  const processAction = async (id, action) => {
    try {
      setProcessingId(id);
      // Close the modal instantly to remove the "lagging" feel for the user
      setShowAnnounceModal(false);

      const payload = { action };
      
      if (action === "approve" && announceData.shouldAnnounce) {
        payload.announce = true;
        payload.message = announceData.message;
        payload.priority = announceData.priority;
      }

      // Optimistically update the UI so it feels instantaneous
      setReports((prev) => 
        prev.map((r) => 
          r.disaster_id === id 
            ? { ...r, verification_status: action === "approve" ? "verified" : "rejected" } 
            : r
        )
      );

      // Execute the request in the background
      await axios.put(`/disasters/admin/report/${id}/status`, payload);

      // Refresh quietly in the background to ensure sync
      fetchReports();
      if (onReportsUpdated) onReportsUpdated();
    } catch (err) {
      console.error(err);
      alert(t("adminDisasterReports.errorMsg"));
      // Revert if failed
      fetchReports();
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">Pending</span>;
      case "verified":
        return <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">Verified</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchStatus = statusFilter ? report.verification_status?.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchType = typeFilter ? report.type === typeFilter : true;
    const matchRole = roleFilter ? report.reporter?.role?.toLowerCase() === roleFilter.toLowerCase() : true;
    return matchStatus && matchType && matchRole;
  });

  // Extract unique disaster types for filter dropdown
  const uniqueTypes = Array.from(new Set(reports.map(r => r.type))).filter(Boolean);

  return (
    <div className="w-full flex flex-col gap-8 h-full" data-name="AdminDisasterReports">
      {/* Header */}
      <div className="flex flex-col gap-1 text-center">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t("adminDisasterReports.title")}</h1>
        <p className={`text-base transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          {t("adminDisasterReports.subtitle")}
        </p>
      </div>

      {/* Main Container Card */}
      <div className={`border rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-230px)] transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
        
        {/* Reports Count Header */}
        <div className={`px-6 py-4 border-b flex items-center gap-3 ${isDarkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50"}`}>
          <h2 className="text-base font-semibold tracking-tight">Total Arrived Reports: <span className="text-blue-500">{reports.length}</span></h2>
        </div>

        {/* Filters */}
        <div className={`px-6 py-4 border-b flex flex-col sm:flex-row gap-4 ${isDarkMode ? "border-slate-800 bg-slate-950/30" : "border-slate-100 bg-slate-50/30"}`}>
          <div className="flex flex-col w-full sm:w-48">
            <label className={`text-[10px] font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-48">
            <label className={`text-[10px] font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Filter by Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-48">
            <label className={`text-[10px] font-bold mb-1.5 uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200" 
                  : "bg-white border-slate-300 text-slate-700"
              }`}
            >
              <option value="">All Roles</option>
              <option value="citizen">Citizen</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : reports.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-64 rounded-xl border ${isDarkMode ? "border-slate-800 bg-slate-800/50" : "border-slate-200 bg-white"}`}>
              <AlertTriangle className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-slate-500">{t("adminDisasterReports.noReports")}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left relative">
                  <thead className={`text-xs uppercase sticky top-0 z-10 shadow-sm ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                    <tr>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableType")}</th>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableLocation")}</th>
                      <th className="px-6 py-4 font-semibold">Sender</th>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableStatus")}</th>
                      <th className="px-6 py-4 font-semibold text-right">{t("adminDisasterReports.tableActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredReports.map((report) => (
                      <ReportRow 
                        key={report.disaster_id} 
                        report={report} 
                        isDarkMode={isDarkMode} 
                        getStatusBadge={getStatusBadge} 
                        handleActionClick={handleActionClick} 
                        processingId={processingId} 
                        t={t} 
                        onViewMap={(r) => setSelectedMapReport(r)}
                      />
                    ))}
                    {filteredReports.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No reports match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Announce Modal */}
      <AnimatePresence>
        {showAnnounceModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
            >
              <div className="flex items-center gap-3 mb-4 text-blue-500">
                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-500/10" : "bg-blue-50"}`}>
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Verify & Announce
                </h3>
              </div>
              
              <p className={`mb-5 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                You are about to verify the <strong>{selectedReport.type}</strong> report at {selectedReport.location}.
              </p>

              {selectedReport.media_url && (
                <div className="mb-5">
                  <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Attached Evidence
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {selectedReport.media_url.split(',').map((url, idx) => {
                      const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
                      const fullUrl = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
                      return (
                        <a key={idx} href={fullUrl} target="_blank" rel="noopener noreferrer">
                          <img src={fullUrl} alt={`Evidence ${idx+1}`} className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity shadow-sm" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              <label className="flex items-start gap-3 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announceData.shouldAnnounce}
                  onChange={(e) => setAnnounceData({ ...announceData, shouldAnnounce: e.target.checked })}
                  className="mt-1 rounded text-blue-500 focus:ring-blue-500 bg-slate-800 border-slate-600"
                />
                <span className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {t("adminDisasterReports.announceToggle")}
                </span>
              </label>

              {announceData.shouldAnnounce && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Alert Message
                    </label>
                    <textarea
                      value={announceData.message}
                      onChange={(e) => setAnnounceData({ ...announceData, message: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Priority Level
                    </label>
                    <select
                      value={announceData.priority}
                      onChange={(e) => setAnnounceData({ ...announceData, priority: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                        isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowAnnounceModal(false)}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => processAction(selectedReport.disaster_id, "approve")}
                  disabled={processingId === selectedReport.disaster_id}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {processingId === selectedReport.disaster_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {selectedMapReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white"}`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Disaster Location: {selectedMapReport.type}
                </h3>
                <button 
                  onClick={() => setSelectedMapReport(null)}
                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[60vh] w-full relative bg-slate-100 dark:bg-slate-800">
                <MapContainer 
                  center={[selectedMapReport.lat, selectedMapReport.lng]} 
                  zoom={14} 
                  style={{ height: "100%", width: "100%", zIndex: 10 }}
                >
                  <TileLayer
                    url={isDarkMode 
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[selectedMapReport.lat, selectedMapReport.lng]} />
                </MapContainer>
              </div>
              <div className={`p-4 text-sm font-medium ${isDarkMode ? "bg-slate-800/50 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                {selectedMapReport.location}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
