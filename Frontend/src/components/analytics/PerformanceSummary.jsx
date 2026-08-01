import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function PerformanceSummary({ isDarkMode }) {
  const { t } = useTranslation();
  const metrics = [
    {
      label: t("adminAIPerformance.label1"),
      value: 94.2,
      color: "bg-purple-500",
      trackColor: "bg-purple-100 dark:bg-purple-950/40",
      description: t("adminAIPerformance.desc1"),
    },
    {
      label: t("adminAIPerformance.label2"),
      value: 88.5,
      color: "bg-blue-500",
      trackColor: "bg-blue-100 dark:bg-blue-950/40",
      description: t("adminAIPerformance.desc2"),
    },
    {
      label: t("adminAIPerformance.label3"),
      value: 76.1,
      color: "bg-emerald-500",
      trackColor: "bg-emerald-100 dark:bg-emerald-950/40",
      description: t("adminAIPerformance.desc3"),
    },
    {
      label: t("adminAIPerformance.label4"),
      value: 91.8,
      color: "bg-amber-500",
      trackColor: "bg-amber-100 dark:bg-amber-950/40",
      description: t("adminAIPerformance.desc4"),
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
        <h3 className="font-semibold text-base">{t("adminAIPerformance.title")}</h3>
        <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          {t("adminAIPerformance.subtitle")}
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
