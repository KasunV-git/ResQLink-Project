import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { CheckCircle, XCircle, AlertTriangle, Megaphone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DisasterReports({ isDarkMode }) {
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

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/disasters/admin/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const token = localStorage.getItem("token");
      const payload = { action };
      
      if (action === "approve" && announceData.shouldAnnounce) {
        payload.announce = true;
        payload.message = announceData.message;
        payload.priority = announceData.priority;
      }

      await axios.put(`http://localhost:5000/api/disasters/admin/report/${id}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(
        action === "approve" 
          ? t("adminDisasterReports.approveSuccess") 
          : t("adminDisasterReports.rejectSuccess")
      );
      
      setShowAnnounceModal(false);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert(t("adminDisasterReports.errorMsg"));
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

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? "border-slate-800" : "border-slate-200"} bg-white dark:bg-slate-900`}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">{t("adminDisasterReports.title")}</h1>
          <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {t("adminDisasterReports.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
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
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className={`text-xs uppercase ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                    <tr>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableType")}</th>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableLocation")}</th>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableDesc")}</th>
                      <th className="px-6 py-4 font-semibold">{t("adminDisasterReports.tableStatus")}</th>
                      <th className="px-6 py-4 font-semibold text-right">{t("adminDisasterReports.tableActions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {reports.map((report) => (
                      <tr key={report.disaster_id} className={`hover:${isDarkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>
                        <td className="px-6 py-4">
                          <div className="font-medium">{report.type}</div>
                          <div className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {new Date(report.created_at).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">{report.location}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{report.description}</td>
                        <td className="px-6 py-4">
                          {getStatusBadge(report.verification_status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {report.verification_status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleActionClick(report, "approve")}
                                disabled={processingId === report.disaster_id}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                              >
                                {processingId === report.disaster_id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                {t("adminDisasterReports.approveBtn")}
                              </button>
                              <button
                                onClick={() => handleActionClick(report, "reject")}
                                disabled={processingId === report.disaster_id}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                                  isDarkMode ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                                {t("adminDisasterReports.rejectBtn")}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
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
    </div>
  );
}
