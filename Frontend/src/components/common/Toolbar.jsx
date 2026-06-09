import { Search, RefreshCw } from "lucide-react";

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
            placeholder="Search operational insights..."
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
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
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
            <option value="All">All Categories</option>
            <option value="Resources">Resources</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Operations">Operations</option>
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
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
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
        <span>Refresh</span>
      </button>
    </div>
  );
}
