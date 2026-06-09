import { motion } from "framer-motion";

export default function PerformanceSummary({ isDarkMode }) {
  const metrics = [
    {
      label: "Response Efficiency",
      value: 94.2,
      color: "bg-purple-500",
      trackColor: "bg-purple-100 dark:bg-purple-950/40",
      description: "Average dispatch latency and transit matching accuracy",
    },
    {
      label: "Resource Allocation Performance",
      value: 88.5,
      color: "bg-blue-500",
      trackColor: "bg-blue-100 dark:bg-blue-950/40",
      description: "Asset utilization versus emergency demands",
    },
    {
      label: "Volunteer Engagement Rate",
      value: 76.1,
      color: "bg-emerald-500",
      trackColor: "bg-emerald-100 dark:bg-emerald-950/40",
      description: "Active status participation and mission completion",
    },
    {
      label: "System Activity Metrics",
      value: 91.8,
      color: "bg-amber-500",
      trackColor: "bg-amber-100 dark:bg-amber-950/40",
      description: "Service uptime and API message processing sync",
    },
  ];

  return (
    <div
      className={`border rounded-xl p-6 shadow-sm transition-colors duration-200 ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="mb-6">
        <h3 className="font-semibold text-base">Performance KPI Summary</h3>
        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Real-time service indicators matching operational SLA targets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="font-bold">{item.value}%</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className={`w-full h-2 rounded-full ${item.trackColor} overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
                className={`h-full rounded-full ${item.color}`}
              />
            </div>
            
            <span className={`text-[11px] leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
