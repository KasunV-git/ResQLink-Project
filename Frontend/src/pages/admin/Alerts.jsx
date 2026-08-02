import { useState } from "react";
import { ShieldAlert, Send, Info, Target, AlertTriangle, Bell, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Alerts({ alerts = [], onCreateAlert, onDeleteAlert, isDarkMode }) {
  const { t } = useTranslation();
  const [priority, setPriority] = useState("high");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("Emergency Services");
  const [target, setTarget] = useState("For Volunteers");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isDisaster, setIsDisaster] = useState(false);
  
  // Filters for Active Broadcasts
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("");

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    let finalMessage = message.trim();
    if (isDisaster) {
      finalMessage = `External Disaster: ${finalMessage}`;
    }

    try {
      await onCreateAlert({
        priority,
        message: finalMessage,
        source: source.trim(),
        target: target.trim(),
      });
      setMessage("");
      setMsg(t("adminAlerts.successMsg"));
      setSource("");
      setIsDisaster(false);
      setTimeout(() => setMsg(""), 2000);
    } catch (error) {
      console.error("Broadcast submission error:", error);
      const serverMsg = error.response?.data?.message || error.message || t("adminAlerts.errorMsg");
      setMsg(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const textHeading = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";
  const bgHeader = isDarkMode ? "bg-slate-950" : "bg-slate-50";
  const bgInnerCard = isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-200";

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminAlerts">
      <div className="flex flex-col gap-1 text-center">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${textHeading}`}>{t("adminAlerts.title")}</h1>
        <p className={`text-base transition-colors ${textMuted}`}>{t("adminAlerts.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`border rounded-xl shadow-sm flex flex-col self-start transition-colors ${cardBg}`}>
          <div className={`px-6 py-4 border-b ${borderMuted} flex items-center gap-2 ${bgHeader}`}>
            <AlertTriangle className={`w-5 h-5 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
            <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{t("adminAlerts.broadcastSystem")}</h2>
          </div>

          <div className="p-6 flex flex-col gap-4">
            {msg && (
              <div className={`text-sm font-semibold p-3 rounded-lg border text-center ${
                msg === t("adminAlerts.successMsg")
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {msg}
            </div>
            )}

            <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{t("adminAlerts.priorityLabel")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setPriority("critical")} className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-all ${priority === "critical" ? "bg-purple-600 text-white border-purple-600 shadow-md" : `bg-transparent border-slate-300 hover:border-purple-400 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}`}>Critical Priority</button>
                  <button type="button" onClick={() => setPriority("high")} className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-all ${priority === "high" ? "bg-red-500 text-white border-red-500 shadow-md" : `bg-transparent border-slate-300 hover:border-red-400 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}`}>{t("adminAlerts.priorityHigh")}</button>
                  <button type="button" onClick={() => setPriority("medium")} className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-all ${priority === "medium" ? "bg-amber-500 text-white border-amber-500 shadow-md" : `bg-transparent border-slate-300 hover:border-amber-400 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}`}>{t("adminAlerts.priorityMedium")}</button>
                  <button type="button" onClick={() => setPriority("low")} className={`px-3 py-2 text-sm font-semibold rounded-lg border transition-all ${priority === "low" ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : `bg-transparent border-slate-300 hover:border-emerald-400 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}`}>{t("adminAlerts.priorityLow")}</button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{t("adminAlerts.messageLabel")}</label>
                <textarea required placeholder={t("adminAlerts.messagePlaceholder")} value={message} onChange={(e) => setMessage(e.target.value)} rows="4" className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="checkbox" 
                    id="isDisaster" 
                    checked={isDisaster} 
                    onChange={(e) => setIsDisaster(e.target.checked)} 
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-100 border-slate-300 cursor-pointer" 
                  />
                  <label htmlFor="isDisaster" className={`text-sm font-semibold cursor-pointer ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    Mark as Active Disaster (Requires Volunteers)
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{t("adminAlerts.sourceLabel")}</label>
                <div className="relative">
                  <Info className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" required placeholder={t("adminAlerts.sourcePlaceholder")} value={source} onChange={(e) => setSource(e.target.value)} className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-bold uppercase tracking-wider ${textMuted}`}>{t("adminAlerts.targetLabel")}</label>
                <div className="relative">
                  <Target className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select value={target} onChange={(e) => setTarget(e.target.value)} className={`w-full text-sm rounded-lg py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-600 transition-colors ${isDarkMode ? "bg-slate-900/50 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"} border`}>
                    <option value="volunteers">{t("adminAlerts.targetVolunteers")}</option>
                    <option value="medical">{t("adminAlerts.targetMedical")}</option>
                    <option value="rescue">{t("adminAlerts.targetRescue")}</option>
                    <option value="logistics">{t("adminAlerts.targetLogistics")}</option>
                    <option value="first_responders">{t("adminAlerts.targetFirstResponders")}</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${loading ? "bg-amber-600/50 cursor-not-allowed text-white/70" : "bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg"}`}>
                <Send className="w-4 h-4" />
                {loading ? t("adminAlerts.broadcasting") : t("adminAlerts.broadcastAlert")}
              </button>
            </form>
          </div>
        </div>

        <div className={`border rounded-xl shadow-sm flex flex-col transition-colors h-[650px] max-h-[calc(100vh-120px)] ${cardBg}`}>
          <div className={`px-6 py-4 border-b ${borderMuted} flex flex-col gap-4 ${bgHeader}`}>
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                {t("adminAlerts.activeBroadcasts", { count: alerts.length })}
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-lg py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? "bg-slate-900 border-slate-700 text-slate-200" 
                      : "bg-white border-slate-300 text-slate-700"
                  }`}
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical Priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  list="disaster-types"
                  placeholder="Filter by type (e.g. Fire, Flood)..."
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`w-full text-xs font-semibold rounded-lg py-1.5 px-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? "bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500" 
                      : "bg-white border-slate-300 text-slate-700 placeholder-slate-400"
                  }`}
                />
                <datalist id="disaster-types">
                  <option value="Flash Flood" />
                  <option value="Landslide" />
                  <option value="Fire" />
                  <option value="Cyclone/Winds" />
                  <option value="Collapse" />
                  <option value="Medical" />
                  <option value="Chemical Spill" />
                  <option value="Earthquake" />
                  <option value="Other" />
                </datalist>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {(() => {
              const filteredAlerts = alerts.filter(alert => {
                const alertPriority = alert.priority ? alert.priority.toLowerCase() : "";
                const matchPriority = filterPriority === "all" || alertPriority === filterPriority.toLowerCase();
                const matchType = filterType === "" || alert.message.toLowerCase().includes(filterType.toLowerCase());
                return matchPriority && matchType;
              });

              if (filteredAlerts.length === 0) {
                return (
                  <div className={`flex h-full items-center justify-center text-sm ${textMuted} py-10`}>
                    No active broadcasts match your filters.
                  </div>
                );
              }

              return filteredAlerts.map((alert) => {
                const p = alert.priority ? alert.priority.toLowerCase() : "";
                const isCritical = p === "critical";
                const isHigh = p === "high";
                const isMedium = p === "medium";
                let borderClass = isCritical ? "border-l-purple-500" : isHigh ? "border-l-red-500" : isMedium ? "border-l-amber-500" : "border-l-emerald-500";
                let badgeClass = isCritical 
                  ? (isDarkMode ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-50 text-purple-700 border-purple-200")
                  : isHigh 
                  ? (isDarkMode ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200")
                  : isMedium
                    ? (isDarkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200")
                    : (isDarkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200");

                return (
                  <div key={alert.id} className={`border border-l-[4px] rounded-xl p-4 flex flex-col gap-3 shadow-sm relative pr-12 transition-colors ${bgInnerCard} ${borderClass}`}>
                    <button onClick={() => onDeleteAlert(alert.id)} title="Delete / Expire Alert" className={`absolute right-4 top-4 p-1.5 rounded transition-colors cursor-pointer ${isDarkMode ? "text-slate-500 hover:text-red-400 hover:bg-slate-800" : "text-slate-400 hover:text-red-650 hover:bg-slate-50"}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded border uppercase ${badgeClass}`}>
                        {t("adminAlerts.priorityPrefix")}: {alert.priority}
                      </span>
                      <span className={`font-medium ${textMuted}`}>{alert.time}</span>
                    </div>

                    <p className={`text-sm font-semibold leading-relaxed ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                      {alert.message}
                    </p>

                    <div className={`flex justify-between items-center text-xs border-t pt-2.5 mt-0.5 ${borderMuted}`}>
                      <span className={`font-medium ${textMuted}`}>
                        {t("adminAlerts.sourcePrefix")}: <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-600"}`}>{alert.source}</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
                        isDarkMode
                          ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-400"
                          : "bg-emerald-50/50 border border-emerald-100 text-emerald-700"
                      }`}>
                        {alert.target || "For Volunteers"}
                      </span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
