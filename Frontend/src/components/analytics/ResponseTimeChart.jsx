import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from '../common/ChartCard';

const data = [
  { name: 'Mon', response: 45 },
  { name: 'Tue', response: 52 },
  { name: 'Wed', response: 38 },
  { name: 'Thu', response: 65 },
  { name: 'Fri', response: 48 },
  { name: 'Sat', response: 32 },
  { name: 'Sun', response: 28 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    let statusColor = "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10";
    let statusText = "Excellent Response";
    if (val > 50) {
      statusColor = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10";
      statusText = "Needs Attention";
    } else if (val > 35) {
      statusColor = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10";
      statusText = "Standard Speed";
    }

    return (
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 shadow-xl flex flex-col gap-1 transition-all duration-300">
        <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">{label} Report</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <p className="text-sm font-bold text-foreground">
            Avg Time: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{val} mins</span>
          </p>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1.5 self-start ${statusColor}`}>
          {statusText}
        </span>
      </div>
    );
  }
  return null;
};

const ResponseTimeChart = () => {
  return (
    <ChartCard title="Avg. Response Time" subtitle="Weekly trend in dispatch-to-arrival duration">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="responseTimeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-color)', opacity: 0.6, fontSize: 11 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="response" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fill="url(#responseTimeGrad)"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: 'var(--card-bg)' }} 
              activeDot={{ r: 7, strokeWidth: 0, fill: '#4f46e5' }} 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ResponseTimeChart;

