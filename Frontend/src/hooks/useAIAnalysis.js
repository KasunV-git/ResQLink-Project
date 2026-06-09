import { useState, useEffect } from "react";
import { aiService } from "../services/aiService";

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState("Last 24 Hours");

  const [statistics, setStatistics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [chartsData, setChartsData] = useState({
    trendData: [],
    resourceUtilization: [],
    incidentDistribution: [],
    performanceMetrics: [],
  });
  const [mapMarkers, setMapMarkers] = useState([]);

  const loadData = () => {
    setLoading(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setStatistics(aiService.getStatistics());
      setInsights(aiService.getInsights());
      setChartsData(aiService.getChartsData());
      setMapMarkers(aiService.getMapMarkers());
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData();
  };

  // Filter logic for Insights list
  const filteredInsights = insights.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.findings.some((f) => f.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "All" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return {
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
    insights: filteredInsights,
    chartsData,
    mapMarkers,
    handleRefresh,
  };
};
