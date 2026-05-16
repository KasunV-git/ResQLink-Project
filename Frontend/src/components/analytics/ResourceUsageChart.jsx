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

const ResourceUsageChart = () => {
  return (
    <ChartCard title="Resource Allocation" subtitle="Allocated vs Actual usage by region">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis 
              dataKey="region" 
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
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)', 
                borderRadius: '8px',
                color: 'var(--foreground)'
              }} 
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="allocated" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={1500} />
            <Bar dataKey="used" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ResourceUsageChart;
