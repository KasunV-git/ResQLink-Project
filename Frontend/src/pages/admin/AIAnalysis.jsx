import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import * as Icons from "lucide-react";
import "leaflet/dist/leaflet.css";

import { useAIAnalysis } from "../../hooks/useAIAnalysis";
import { getStatusColor, getScoreColor } from "../../utils/helpers";
import StatsCard from "../../components/common/StatsCard";
import Toolbar from "../../components/common/Toolbar";
import Charts from "../../components/analytics/Charts";
import PerformanceSummary from "../../components/analytics/PerformanceSummary";

// Resolve Leaflet default icon path issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons for Map markers to look emergency-themed
const createMarkerIcon = (color) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
    className: "custom-div-icon",
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const disasterIcon = createMarkerIcon("#ef4444"); // Red
const resourceIcon = createMarkerIcon("#3b82f6"); // Blue

export default function AIAnalysis({ isDarkMode }) {
  const {
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    statistics,
    insights,
    chartsData,
    mapMarkers,
    handleRefresh,
  } = useAIAnalysis();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const getInsightIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "resources":
        return Icons.Package;
      case "infrastructure":
        return Icons.Radio;
      case "operations":
        return Icons.Cpu;
      default:
        return Icons.AlertTriangle;
    }
  };

  const mapCenter = [37.7749, -122.4194]; // San Francisco center

  return (
    <div
      className={`min-h-screen p-1 -m-4 md:-m-8 px-4 md:px-8 py-4 md:py-8 transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-[1100px] mx-auto pb-16"
      >
        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center pb-4 border-b border-solid border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-3xl tracking-tight text-purple-600 dark:text-purple-400">
              Intelligence Center
            </h1>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Monitor operational insights, resource trends, and AI-predicted disaster response metrics.
            </p>
          </div>
        </motion.div>

        {/* Summary Statistics Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat) => (
            <StatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendDirection={stat.trendDirection}
              iconName={stat.iconName}
              isDarkMode={isDarkMode}
            />
          ))}
        </motion.div>

        {/* Filter and Search Toolbar */}
        <motion.div variants={itemVariants}>
          <Toolbar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onRefresh={handleRefresh}
            loading={loading}
            isDarkMode={isDarkMode}
          />
        </motion.div>

        {/* Main Insights Stack & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left / Middle: Insights List (2 cols on large screen) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">AI Recommendations & Analysis</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white"}`}>
                  Showing {insights.length} insight{insights.length !== 1 && "s"}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Icons.Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : insights.length === 0 ? (
                <div className={`text-center py-16 border border-dashed rounded-xl ${isDarkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                  <Icons.Search className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-medium">No operational insights match your filters.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {insights.map((insight) => {
                    const CategoryIcon = getInsightIcon(insight.category);
                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-xl p-6 shadow-sm flex flex-col gap-4 transition-colors duration-200 ${
                          isDarkMode
                            ? "bg-slate-900 border-slate-800 text-white"
                            : "bg-white border-slate-200 text-slate-900"
                        }`}
                      >
                        {/* Header Area */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${isDarkMode ? "bg-purple-950/40 text-purple-400" : "bg-purple-50 text-purple-600"}`}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-semibold text-base tracking-tight">{insight.title}</h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getStatusColor(insight.status)}`}>
                                  {insight.status} Priority
                                </span>
                                <span className={`text-xs font-semibold ${getScoreColor(insight.score)}`}>
                                  {insight.score}% Confidence Score
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description Area */}
                        <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                          {insight.description}
                        </p>

                        {/* Findings Recommendations List */}
                        <div className="flex flex-col gap-2.5">
                          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Recommendations & Observations
                          </h4>
                          <div className="flex flex-col gap-2">
                            {insight.findings.map((finding, idx) => (
                              <motion.div
                                key={idx}
                                whileHover={{ x: 4 }}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                  isDarkMode
                                    ? "bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-900"
                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-200"
                                }`}
                              >
                                <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-purple-600 shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-medium leading-relaxed">{finding}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Footer Area */}
                        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                            Last Analyzed: <strong className="font-semibold">{insight.updatedAt}</strong>
                          </span>
                          <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded border ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                              {insight.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${isDarkMode ? "bg-purple-950/40 border-purple-900/40 text-purple-400" : "bg-purple-50 border-purple-100 text-purple-700"}`}>
                              {insight.source}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Live Map (1 col on large screen) */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <h2 className="font-semibold text-lg">AI Operations Mapping</h2>
              
              <div
                className={`border rounded-xl overflow-hidden shadow-sm h-[400px] lg:h-[580px] flex flex-col transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Disaster & Resource Overlay</span>
                    <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Live telemetry map centered at incident coordinates
                    </span>
                  </div>
                  <div className="flex gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span> Disaster
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span> Resource
                    </span>
                  </div>
                </div>

                {/* Leaflet Map Integration */}
                <div className="flex-1 w-full h-full relative z-0">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url={
                        isDarkMode
                          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      }
                    />
                    {mapMarkers.map((marker) => (
                      <Marker
                        key={marker.id}
                        position={marker.position}
                        icon={marker.type === "disaster" ? disasterIcon : resourceIcon}
                      >
                        <Popup>
                          <div className="text-slate-900 flex flex-col gap-1 min-w-[150px]">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs">{marker.title}</span>
                              <span className={`text-[8px] font-bold px-1 rounded uppercase ${getStatusColor(marker.priority || marker.status)}`}>
                                {marker.subtype}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 leading-tight">{marker.description}</span>
                            {marker.capacity && (
                              <span className="text-[10px] font-semibold text-purple-600 mt-0.5">{marker.capacity}</span>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Analytics Section (Charts) */}
        <motion.div variants={itemVariants}>
          <Charts data={chartsData} isDarkMode={isDarkMode} />
        </motion.div>

        {/* Performance Summary Section */}
        <motion.div variants={itemVariants}>
          <PerformanceSummary isDarkMode={isDarkMode} />
        </motion.div>

      </motion.div>
    </div>
  );
}
