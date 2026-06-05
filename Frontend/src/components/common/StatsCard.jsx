import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function StatsCard({ label, value, trend, trendDirection, iconName, isDarkMode }) {
  // Dynamically resolve icon from lucide-react
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-emerald-500 bg-emerald-500/10";
      case "down":
        return "text-rose-500 bg-rose-500/10";
      default:
        return "text-slate-500 bg-slate-500/10 dark:text-slate-400 dark:bg-slate-800/50";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-xl p-5 border shadow-sm flex items-center justify-between transition-colors ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg ${
            isDarkMode ? "bg-purple-950/40 text-purple-400" : "bg-purple-50 text-purple-600"
          }`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-2xl tracking-tight">{value}</span>
          <span className={`text-xs font-medium uppercase tracking-wider ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            {label}
          </span>
        </div>
      </div>

      <div className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${getTrendColor()}`}>
        {trendDirection === "up" && "↑"}
        {trendDirection === "down" && "↓"}
        <span>{trend}</span>
      </div>
    </motion.div>
  );
}
