import { useState } from "react";
import { Bell, Trash2, Megaphone } from "lucide-react";

export default function Alerts({ alerts, onCreateAlert, onDeleteAlert, isDarkMode }) {
  const [priority, setPriority] = useState("high");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("Emergency Services");
  const [target, setTarget] = useState("For Volunteers");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await onCreateAlert({
        priority,
        message: message.trim(),
        source: source.trim(),
        target: target.trim(),
      });
      setMessage("");
      setMsg("Alert broadcasted successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setMsg("Failed to broadcast alert. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const textHeading = isDarkMode ? "text-white" : "text-slate-900";
  const textMuted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";
  const borderMuted = isDarkMode ? "border-slate-800" : "border-slate-100";
  const bgInnerCard = isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-200";

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminAlerts">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className={`font-semibold text-3xl tracking-tight transition-colors ${textHeading}`}>Emergency Broadcasts</h1>
        <p className={`text-base transition-colors ${textMuted}`}>Issue real-time alerts and manage active notifications for responders</p>
      </div>

      {/* Main Grid: Form Left, Broadcasts Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <div className={`border rounded-xl p-6 shadow-sm flex flex-col gap-4 self-start transition-colors ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-2 border-b ${borderMuted}`}>
            <Megaphone className="w-5 h-5 text-red-600" />
            <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Broadcast System</h2>
          </div>

          {msg && (
            <div className={`text-xs font-semibold p-2.5 rounded border text-center ${
              msg.includes("successfully")
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                }`}
                required
              >
                <option value="high" className={isDarkMode ? "bg-slate-950 text-white" : ""}>🚨 High Priority</option>
                <option value="medium" className={isDarkMode ? "bg-slate-950 text-white" : ""}>⚠️ Medium Priority</option>
                <option value="low" className={isDarkMode ? "bg-slate-950 text-white" : ""}>ℹ️ Low Priority</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>Alert Message</label>
              <textarea
                placeholder="Describe the emergency or volunteer action required..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>Source Agency</label>
              <input
                type="text"
                placeholder="e.g. Weather Service"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>Target Recipients</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={`w-full text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-white focus:bg-slate-950 focus:border-emerald-500" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-emerald-600"
                }`}
                required
              >
                <option value="For Volunteers" className={isDarkMode ? "bg-slate-950 text-white" : ""}>👥 For Volunteers</option>
                <option value="Medical Responders" className={isDarkMode ? "bg-slate-950 text-white" : ""}>🏥 Medical Responders</option>
                <option value="Search & Rescue" className={isDarkMode ? "bg-slate-950 text-white" : ""}>🔍 Search & Rescue</option>
                <option value="Logistics & Supply" className={isDarkMode ? "bg-slate-950 text-white" : ""}>📦 Logistics & Supply</option>
                <option value="First Responders" className={isDarkMode ? "bg-slate-950 text-white" : ""}>🚨 First Responders</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold text-sm py-2 rounded-lg shadow-sm transition-colors mt-2 cursor-pointer ${
                isDarkMode 
                  ? "bg-red-700 hover:bg-red-800 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {loading ? "Broadcasting..." : "Broadcast Alert"}
            </button>
          </form>
        </div>

        {/* Active Alerts List */}
        <div className={`lg:col-span-2 border rounded-xl p-6 shadow-sm flex flex-col min-h-[450px] transition-colors ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-4 border-b ${borderMuted} mb-4`}>
            <Bell className="w-5 h-5 text-slate-800 dark:text-slate-200" />
            <h2 className={`font-semibold text-base ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Active Broadcasts ({alerts.length})</h2>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            {alerts.length === 0 ? (
              <div className={`flex-1 flex items-center justify-center font-normal ${textMuted}`}>
                No active notifications broadcasted yet.
              </div>
            ) : (
              alerts.map((alert) => {
                const isHigh = alert.priority === "high";
                const isMedium = alert.priority === "medium";

                let borderClass = "border-l-emerald-500";
                let badgeClass;

                if (isHigh) {
                  borderClass = "border-l-red-500";
                  badgeClass = isDarkMode 
                    ? "bg-red-500/10 text-red-400 border-red-500/20" 
                    : "bg-red-50 text-red-700 border-red-200";
                } else if (isMedium) {
                  borderClass = "border-l-amber-500";
                  badgeClass = isDarkMode 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                    : "bg-amber-50 text-amber-700 border-amber-200";
                } else {
                  badgeClass = isDarkMode
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200";
                }

                return (
                  <div
                    key={alert.id}
                    className={`border border-l-[4px] rounded-xl p-4 flex flex-col gap-3 shadow-sm relative pr-12 transition-colors ${bgInnerCard} ${borderClass}`}
                  >
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      title="Delete / Expire Alert"
                      className={`absolute right-4 top-4 p-1.5 rounded transition-colors cursor-pointer ${
                        isDarkMode 
                          ? "text-slate-500 hover:text-red-400 hover:bg-slate-800" 
                          : "text-slate-400 hover:text-red-650 hover:bg-slate-50"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded border uppercase ${badgeClass}`}>
                        {alert.priority} Priority
                      </span>
                      <span className={`font-medium ${textMuted}`}>{alert.time}</span>
                    </div>

                    <p className={`text-sm font-semibold leading-relaxed ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                      {alert.message}
                    </p>

                    <div className={`flex justify-between items-center text-xs border-t pt-2.5 mt-0.5 ${borderMuted}`}>
                      <span className={`font-medium ${textMuted}`}>
                        Source: <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-600"}`}>{alert.source}</span>
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
