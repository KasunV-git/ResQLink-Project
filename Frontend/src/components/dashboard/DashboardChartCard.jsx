import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector, AreaChart, Area, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Premium Custom Glassmorphic Tooltip
const CustomTooltip = ({ active, payload, label, type }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 shadow-xl flex flex-col gap-1 transition-all duration-300">
        <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">
          {type === 'pie' ? 'Resource Category' : label}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span 
            className="w-2.5 h-2.5 rounded-full" 
            style={{ backgroundColor: item.payload.fill || item.color }} 
          />
          <p className="text-sm font-bold text-foreground">
            {item.name}: <span className="text-primary-500 dark:text-primary-400 font-extrabold">{item.value.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Active Shape Renderer for Donut Highlight
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      {/* Glow shadow ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.2}
      />
      {/* Outer sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const DashboardChartCard = ({ title, type, data, delay = 0 }) => {
  // Chart Type State for Incident Chart (type === 'bar')
  const [selectedType, setSelectedType] = useState('bar');
  
  // Interactive Donut Chart States
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hiddenSegments, setHiddenSegments] = useState([]);

  // Process data for Donut Chart
  const filteredPieData = type === 'pie' 
    ? data.filter(item => !hiddenSegments.includes(item.name)) 
    : data;

  const totalValue = filteredPieData.reduce((acc, curr) => acc + curr.value, 0);

  const onPieEnter = (_, index, e) => {
    setActiveIndex(index);
    setHoveredSegment(filteredPieData[index]);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
    setHoveredSegment(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full relative group overflow-hidden"
    >
      {/* Abstract Background Accent for Premium Feel */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      {/* Header with Title & Selector Control */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
        {type === 'bar' && (
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-border/50 gap-0.5 relative z-10">
            {['bar', 'area', 'line'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all duration-200 ${
                  selectedType === t
                    ? 'bg-white text-primary-600 shadow-sm border border-slate-200/50 dark:bg-slate-700 dark:text-white dark:border-none'
                    : 'text-foreground/60 hover:text-foreground hover:bg-white/20 dark:hover:bg-slate-700/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chart Container */}
      <div className="flex-1 w-full min-h-[300px] relative flex flex-col justify-between">
        <div className="flex-1 w-full min-h-[250px] relative">
          {/* Dynamic Center Text for Donut Chart */}
          {type === 'pie' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 mt-[-10px]">
              <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
                {hoveredSegment ? hoveredSegment.name : "Total Allocation"}
              </span>
              <span className="text-3xl font-extrabold text-foreground tracking-tight mt-0.5">
                {hoveredSegment ? hoveredSegment.value.toLocaleString() : totalValue.toLocaleString()}
              </span>
              {hoveredSegment && (
                <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full mt-1.5 animate-in slide-in-from-bottom-2 duration-300">
                  {((hoveredSegment.value / totalValue) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              // Weekly Incidents: Bar / Area / Line Composed Chart
              selectedType === 'bar' ? (
                <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip type="bar" />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 4 }} />
                  <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} animationDuration={1200} />
                </BarChart>
              ) : selectedType === 'area' ? (
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip type="area" />} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#areaGrad)" animationDuration={1200} />
                </AreaChart>
              ) : (
                <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip type="line" />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={3.5} 
                    dot={{ r: 5, fill: '#3b82f6', stroke: 'var(--card-bg)', strokeWidth: 2 }} 
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }}
                    animationDuration={1200} 
                  />
                </LineChart>
              )
            ) : (
              // Donut Chart for Resource Allocation
              <PieChart>
                <Pie
                  data={filteredPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="var(--card-bg)"
                  strokeWidth={3}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationDuration={1000}
                >
                  {filteredPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none transition-all duration-300" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip type="pie" />} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Custom Legend with filtering for Pie/Donut Chart */}
        {type === 'pie' && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs font-semibold select-none border-t border-border/40 pt-4 relative z-10">
            {data.map((entry, index) => {
              const isHidden = hiddenSegments.includes(entry.name);
              const color = COLORS[index % COLORS.length];
              return (
                <button
                  key={`legend-${index}`}
                  onClick={() => {
                    setHiddenSegments(prev => 
                      prev.includes(entry.name) 
                        ? prev.filter(v => v !== entry.name) 
                        : [...prev, entry.name]
                    );
                  }}
                  className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 cursor-pointer py-1"
                >
                  <span 
                    className="w-3 h-3 rounded-full transition-all duration-200" 
                    style={{ 
                      backgroundColor: isHidden ? '#cbd5e1' : color,
                      opacity: isHidden ? 0.3 : 1,
                      transform: isHidden ? 'scale(0.8)' : 'scale(1)'
                    }}
                  />
                  <span 
                    className="transition-colors duration-200"
                    style={{ 
                      color: 'var(--text-color)',
                      opacity: isHidden ? 0.3 : 0.8,
                      textDecoration: isHidden ? 'line-through' : 'none'
                    }}
                  >
                    {entry.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardChartCard;

