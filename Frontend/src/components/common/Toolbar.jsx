import { Search, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Toolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  dateRange,
  setDateRange,
  onRefresh,
  loading,
  isDarkMode,
}) {
  const { t } = useTranslation();
  return (
    <div
      className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex-1 flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("adminAIToolbar.searchPlaceholder")}
            className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-2">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          >
            <option value="All">{t("adminAIToolbar.allPriorities")}</option>
            <option value="Critical">{t("adminAIToolbar.critical")}</option>
            <option value="High">{t("adminAIToolbar.high")}</option>
            <option value="Medium">{t("adminAIToolbar.medium")}</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          >
            <option value="All">{t("adminAIToolbar.allCategories")}</option>
            <option value="Resources">{t("adminAIToolbar.resources")}</option>
            <option value="Infrastructure">{t("adminAIToolbar.infrastructure")}</option>
            <option value="Operations">{t("adminAIToolbar.operations")}</option>
          </select>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
              isDarkMode
                ? "bg-slate-950 border-slate-800 text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          >
            <option value="Last 24 Hours">{t("adminAIToolbar.last24h")}</option>
            <option value="Last 7 Days">{t("adminAIToolbar.last7d")}</option>
            <option value="Last 30 Days">{t("adminAIToolbar.last30d")}</option>
          </select>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm focus:outline-none hover:bg-purple-700 hover:text-white cursor-pointer ${
          isDarkMode
            ? "bg-purple-900 text-purple-100 disabled:bg-slate-800 disabled:text-slate-600"
            : "bg-purple-600 text-white disabled:bg-slate-100 disabled:text-slate-400"
        }`}
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        <span>{t("adminAIToolbar.refresh")}</span>
      </button>
    </div>
  );
}
