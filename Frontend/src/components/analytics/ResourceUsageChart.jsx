import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from '../common/ChartCard';

const data = [
  { region: 'North', allocated: 450, used: 380 },
  { region: 'South', allocated: 620, used: 590 },
  { region: 'East', allocated: 380, used: 320 },
  { region: 'West', allocated: 840, used: 710 },
  { region: 'Central', allocated: 510, used: 420 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const allocated = payload.find(p => p.dataKey === 'allocated')?.value || 0;
    const used = payload.find(p => p.dataKey === 'used')?.value || 0;
    const efficiency = allocated > 0 ? ((used / allocated) * 100).toFixed(1) : 0;
    
    let statusClass = "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10";
    let statusText = "Highly Efficient";
    if (efficiency < 60) {
      statusClass = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10";
      statusText = "Underutilized";
    } else if (efficiency < 85) {
      statusClass = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10";
      statusText = "Moderate Utilization";
    }

    return (
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 shadow-xl flex flex-col gap-1 transition-all duration-300">
        <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">{label} Region</p>
        <div className="flex flex-col gap-1.5 mt-0.5 border-b border-border/40 pb-2">
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground/75">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Allocated:</span>
            </div>
            <span className="font-extrabold text-foreground">{allocated.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground/75">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Actual Used:</span>
            </div>
            <span className="font-extrabold text-foreground">{used.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-1">
          <span className="text-[10px] font-bold text-foreground/60">Utilization Rate:</span>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{efficiency}%</span>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1.5 self-start ${statusClass}`}>
          {statusText}
        </span>
      </div>
    );
  }
  return null;
};

const ResourceUsageChart = () => {
  return (
    <ChartCard title="Resource Allocation" subtitle="Allocated vs Actual usage by region">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="allocatedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="usedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
            <XAxis 
              dataKey="region" 
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
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600', color: 'var(--text-color)' }} 
            />
            <Bar dataKey="allocated" fill="url(#allocatedGrad)" radius={[6, 6, 0, 0]} animationDuration={1500} />
            <Bar dataKey="used" fill="url(#usedGrad)" radius={[6, 6, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ResourceUsageChart;

