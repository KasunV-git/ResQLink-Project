import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

export default function Charts({ data, isDarkMode }) {
  const { trendData, resourceUtilization, incidentDistribution, performanceMetrics } = data;

  const cardClass = `border rounded-xl p-5 shadow-sm flex flex-col h-[350px] transition-colors duration-200 ${
    isDarkMode
      ? "bg-slate-900 border-slate-800 text-white"
      : "bg-white border-slate-200 text-slate-900"
  }`;

  const textMutedClass = isDarkMode ? "text-slate-400" : "text-slate-500";
  const gridColor = isDarkMode ? "#334155" : "#e2e8f0";
  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
      borderColor: isDarkMode ? "#1e293b" : "#e2e8f0",
      color: isDarkMode ? "#ffffff" : "#0f172a",
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Incident Trend Line Chart */}
      <div className={cardClass}>
        <div className="mb-4">
          <h3 className="font-semibold text-base">Incidents & Predictions Trend</h3>
          <p className={`text-xs ${textMutedClass}`}>AI predicted vs active logged incidents (24h)</p>
        </div>
        <div className="flex-1 w-full h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="incidents"
                stroke="#a855f7"
                strokeWidth={2}
                name="Active Incidents"
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="predictedIncidents"
                stroke="#ec4899"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="AI Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Resource Utilization Bar Chart */}
      <div className={cardClass}>
        <div className="mb-4">
          <h3 className="font-semibold text-base">Resource Utilization</h3>
          <p className={`text-xs ${textMutedClass}`}>Allocated vs available reserves by sector</p>
        </div>
        <div className="flex-1 w-full h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceUtilization} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
              <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={11} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="allocated" fill="#a855f7" name="Allocated (%)" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="available" fill="#38bdf8" name="Available (%)" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Incident Distribution Pie Chart */}
      <div className={cardClass}>
        <div className="mb-4">
          <h3 className="font-semibold text-base">Incident Distribution</h3>
          <p className={`text-xs ${textMutedClass}`}>Share of ongoing operational incidents by type</p>
        </div>
        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="w-[180px] h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {incidentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-2">
            {incidentDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                <span className="font-medium truncate max-w-[100px]">{entry.name}</span>
                <span className={textMutedClass}>({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Performance Metrics Radar Chart */}
      <div className={cardClass}>
        <div className="mb-4">
          <h3 className="font-semibold text-base">Operational Performance KPIs</h3>
          <p className={`text-xs ${textMutedClass}`}>AI benchmark efficiency vs target thresholds</p>
        </div>
        <div className="flex-1 w-full h-full min-h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceMetrics}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="subject" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} />
              <Radar
                name="AI Efficiency Rating"
                dataKey="A"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.4}
              />
              <Tooltip {...tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
