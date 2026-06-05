// Service to provide mock data for AI Operational Analysis
export const aiService = {
  getStatistics: () => [
    {
      id: "active-resources",
      label: "Active Resources",
      value: "142",
      trend: "+12.4%",
      trendDirection: "up",
      iconName: "Truck",
    },
    {
      id: "critical-zones",
      label: "Critical Zones",
      value: "5",
      trend: "-2 zones",
      trendDirection: "down",
      iconName: "ShieldAlert",
    },
    {
      id: "response-efficiency",
      label: "Response Efficiency",
      value: "94.2%",
      trend: "+1.8%",
      trendDirection: "up",
      iconName: "Zap",
    },
    {
      id: "available-volunteers",
      label: "Available Volunteers",
      value: "48",
      trend: "Stable",
      trendDirection: "stable",
      iconName: "Users",
    },
  ],

  getInsights: () => [
    {
      id: "insight-1",
      title: "Flash Flood Zone Resource Optimization",
      status: "Critical",
      score: 96,
      category: "Resources",
      updatedAt: "10 mins ago",
      source: "ResQLink-AI Engine v2.4",
      description: "Severe precipitation forecasts indicate high flood risk in District 4. The current allocation model displays an immediate gap in water rescue equipment and emergency medical supplies.",
      findings: [
        "Resource shortage detected in flood-prone areas (District 4 & 5).",
        "Volunteer demand increasing in affected zones, requiring specialized first-aid certification.",
        "Additional medical supplies and water crafts are required at Central Shelter.",
        "Primary transportation routes are experiencing structural delays due to early waterlogging."
      ]
    },
    {
      id: "insight-2",
      title: "Power Grid Failures & Comm Infrastructure",
      status: "High",
      score: 89,
      category: "Infrastructure",
      updatedAt: "25 mins ago",
      source: "Telemetry-AI Analyzer",
      description: "North District grid fluctuations have peaked. AI modeling predicts potential communications blackouts in neighboring grid sectors if emergency backups are not initialized.",
      findings: [
        "Three vital cell towers are currently operating on secondary battery backups.",
        "Emergency radio communication channels need immediate frequency adjustments to avoid congestion.",
        "Backup generator fuel levels at North Community Center are below the 12-hour critical threshold."
      ]
    },
    {
      id: "insight-3",
      title: "Volunteer Coordination & Dispatch Bottlenecks",
      status: "Medium",
      score: 78,
      category: "Operations",
      updatedAt: "1 hour ago",
      source: "ResQLink-AI Engine v2.4",
      description: "Dispatch logs indicate a slight rise in response lag times for medical tasks due to suboptimal matching. Re-routing algorithm adjustments are recommended.",
      findings: [
        "First-aid certified volunteers are being over-assigned to logistics roles.",
        "Automated matching thresholds are overly restrictive on geographical distance metrics.",
        "Direct dispatch notifications require push-alert fallback channels."
      ]
    }
  ],

  getChartsData: () => ({
    trendData: [
      { name: "00:00", incidents: 4, predictedIncidents: 4 },
      { name: "04:00", incidents: 3, predictedIncidents: 5 },
      { name: "08:00", incidents: 6, predictedIncidents: 6 },
      { name: "12:00", incidents: 8, predictedIncidents: 7 },
      { name: "16:00", incidents: 12, predictedIncidents: 10 },
      { name: "20:00", incidents: 9, predictedIncidents: 11 },
      { name: "24:00", incidents: 10, predictedIncidents: 9 },
    ],
    resourceUtilization: [
      { name: "Medical", allocated: 85, available: 15 },
      { name: "Rescue", allocated: 92, available: 8 },
      { name: "Supplies", allocated: 70, available: 30 },
      { name: "Shelters", allocated: 65, available: 35 },
      { name: "Transport", allocated: 78, available: 22 },
    ],
    incidentDistribution: [
      { name: "Floods", value: 45, color: "#a855f7" },
      { name: "Earthquakes", value: 20, color: "#ec4899" },
      { name: "Power Outages", value: 15, color: "#eab308" },
      { name: "Fires", value: 12, color: "#f97316" },
      { name: "Storms", value: 8, color: "#3b82f6" },
    ],
    performanceMetrics: [
      { subject: "Response Time", A: 92, fullMark: 100 },
      { subject: "Resource Match", A: 85, fullMark: 100 },
      { subject: "Coordination", A: 78, fullMark: 100 },
      { subject: "Safety Rating", A: 95, fullMark: 100 },
      { subject: "Recovery Speed", A: 82, fullMark: 100 },
    ],
  }),

  getMapMarkers: () => [
    {
      id: "disaster-1",
      type: "disaster",
      subtype: "Flood",
      position: [37.7749, -122.4194], // Centered around San Francisco as baseline example
      title: "Downtown Flash Flood",
      priority: "high",
      status: "Active",
      description: "Severe water rising. Rescue operations in progress.",
    },
    {
      id: "disaster-2",
      type: "disaster",
      subtype: "Infrastructure",
      position: [37.7894, -122.4014],
      title: "Grid Power Blackout",
      priority: "medium",
      status: "Investigating",
      description: "Local station fire has disrupted District 3 power networks.",
    },
    {
      id: "resource-1",
      type: "resource",
      subtype: "Shelter",
      position: [37.7649, -122.4294],
      title: "Central Shelter Hub",
      status: "Functional",
      capacity: "82% Capacity",
      description: "Providing shelter, medical care, and rations.",
    },
    {
      id: "resource-2",
      type: "resource",
      subtype: "Dispatch",
      position: [37.7801, -122.4414],
      title: "Volunteer Coordination Point B",
      status: "Active",
      capacity: "35 Available Volunteers",
      description: "Logistics, vehicles, and equipment dispatch center.",
    },
  ]
};
