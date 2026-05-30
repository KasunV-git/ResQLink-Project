import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartCard from '../common/ChartCard';

const data = [
  { type: 'Flood', count: 120, color: '#3b82f6' },
  { type: 'Fire', count: 85, color: '#ef4444' },
  { type: 'Storm', count: 65, color: '#6366f1' },
  { type: 'Landslide', count: 45, color: '#f59e0b' },
  { type: 'Other', count: 30, color: '#10b981' },
];

const totalReports = data.reduce((sum, item) => sum + item.count, 0);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    const percentage = ((entry.count / totalReports) * 100).toFixed(1);
    
    return (
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 shadow-xl flex flex-col gap-1 transition-all duration-300">
        <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">{entry.type} Disaster</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <p className="text-sm font-bold text-foreground">
            Incidents: <span className="text-primary-500 font-extrabold">{entry.count}</span>
          </p>
        </div>
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full mt-1.5 self-start">
          {percentage}% of Total Reports
        </span>
      </div>
    );
  }
  return null;
};

const DisasterTypeChart = () => {
  return (
    <ChartCard title="Incidents by Category" subtitle="Distribution of reported disaster types">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="FloodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="FireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="StormGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4338ca" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="LandslideGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#b45309" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="OtherGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#047857" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
            <XAxis 
              dataKey="type" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)', radius: 4 }}
              content={<CustomTooltip />} 
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]} 
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#${entry.type}Grad)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default DisasterTypeChart;

