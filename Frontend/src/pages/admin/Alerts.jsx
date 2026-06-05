import { useState } from "react";
import { Bell, Trash2, Megaphone } from "lucide-react";

export default function Alerts({ alerts, onCreateAlert, onDeleteAlert }) {
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

  return (
    <div className="w-full flex flex-col gap-6" data-name="AdminAlerts">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-3xl text-slate-900 tracking-tight">Emergency Broadcasts</h1>
        <p className="text-slate-500 text-base">Issue real-time alerts and manage active notifications for responders</p>
      </div>

      {/* Main Grid: Form Left, Broadcasts Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4 self-start">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Megaphone className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-slate-800 text-base">Broadcast System</h2>
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

          <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              >
                <option value="high">🚨 High Priority</option>
                <option value="medium">⚠️ Medium Priority</option>
                <option value="low">ℹ️ Low Priority</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alert Message</label>
              <textarea
                placeholder="Describe the emergency or volunteer action required..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Source Agency</label>
              <input
                type="text"
                placeholder="e.g. Weather Service"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Recipients</label>
              <input
                type="text"
                placeholder="e.g. All Volunteers"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2 rounded-lg shadow-sm transition-colors mt-2"
            >
              {loading ? "Broadcasting..." : "Broadcast Alert"}
            </button>
          </form>
        </div>

        {/* Active Alerts List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col min-h-[450px]">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
            <Bell className="w-5 h-5 text-slate-800" />
            <h2 className="font-semibold text-slate-800 text-base">Active Broadcasts ({alerts.length})</h2>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            {alerts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 font-normal">
                No active notifications broadcasted yet.
              </div>
            ) : (
              alerts.map((alert) => {
                const isHigh = alert.priority === "high";
                const isMedium = alert.priority === "medium";

                let borderClass = "border-l-emerald-500";
                let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

                if (isHigh) {
                  borderClass = "border-l-red-500";
                  badgeClass = "bg-red-50 text-red-700 border-red-200";
                } else if (isMedium) {
                  borderClass = "border-l-amber-500";
                  badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                }

                return (
                  <div
                    key={alert.id}
                    className={`border border-slate-200 border-l-[4px] rounded-xl p-4 flex flex-col gap-3 shadow-sm relative pr-12 ${borderClass}`}
                  >
                    <button
                      onClick={() => onDeleteAlert(alert.id)}
                      title="Delete / Expire Alert"
                      className="absolute right-4 top-4 text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-slate-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded border uppercase ${badgeClass}`}>
                        {alert.priority} Priority
                      </span>
                      <span className="text-slate-400 font-medium">{alert.time}</span>
                    </div>

                    <p className="text-slate-900 text-sm font-semibold leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2.5 mt-0.5">
                      <span className="text-slate-400 font-medium">
                        Source: <span className="text-slate-600 font-semibold">{alert.source}</span>
                      </span>
                      <span className="text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
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
