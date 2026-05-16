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

const DisasterTypeChart = () => {
  return (
    <ChartCard title="Incidents by Category" subtitle="Distribution of reported disaster types">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis 
              dataKey="type" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888888', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888888', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)', 
                borderRadius: '8px',
                color: 'var(--foreground)'
              }} 
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default DisasterTypeChart;
