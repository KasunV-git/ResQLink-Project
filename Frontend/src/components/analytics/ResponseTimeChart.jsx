import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

const ResponseTimeChart = () => {
  return (
    <ChartCard title="Avg. Response Time" subtitle="Weekly trend in minutes">
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
            <XAxis 
              dataKey="name" 
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
            <Line 
              type="monotone" 
              dataKey="response" 
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#6366f1' }} 
              activeDot={{ r: 6 }} 
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ResponseTimeChart;
