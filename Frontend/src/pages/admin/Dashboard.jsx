import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiUsers, FiBox, FiCheckCircle } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import DashboardChartCard from '../../components/dashboard/DashboardChartCard';
import DashboardMapCard from '../../components/dashboard/DashboardMapCard';

// Mock Data
const statsData = [
  { id: 1, title: 'Active Disasters', value: '12', icon: FiAlertTriangle, trend: 'up', trendValue: '+2', colorClass: 'bg-rose-500' },
  { id: 2, title: 'Total Volunteers', value: '1,458', icon: FiUsers, trend: 'up', trendValue: '+15%', colorClass: 'bg-primary-500' },
  { id: 3, title: 'Available Resources', value: '842', icon: FiBox, trend: 'down', trendValue: '-5%', colorClass: 'bg-amber-500' },
  { id: 4, title: 'Resolved Incidents', value: '328', icon: FiCheckCircle, trend: 'up', trendValue: '+24', colorClass: 'bg-emerald-500' },
];

const barChartData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 7 },
  { name: 'Wed', value: 5 },
  { name: 'Thu', value: 12 },
  { name: 'Fri', value: 8 },
  { name: 'Sat', value: 3 },
  { name: 'Sun', value: 2 },
];

const pieChartData = [
  { name: 'Medical', value: 400 },
  { name: 'Food', value: 300 },
  { name: 'Water', value: 300 },
  { name: 'Shelter', value: 200 },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-foreground/70 text-lg">
          Overview of the ResQLink system operations and metrics.
        </p>
      </motion.div>

      {/* Stats Grid - 1 mobile, 2 tablet, 4 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {statsData.map((stat, index) => (
          <StatCard 
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            colorClass={stat.colorClass}
          />
        ))}
      </div>

      {/* Charts & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Main Map Span 2 columns on desktop */}
        <div className="lg:col-span-2">
          <DashboardMapCard delay={0.2} />
        </div>
        
        {/* Bar Chart 1 column */}
        <div className="lg:col-span-1">
          <DashboardChartCard 
            title="Incidents This Week" 
            type="bar" 
            data={barChartData} 
            delay={0.3} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Pie Chart */}
        <div className="lg:col-span-1">
          <DashboardChartCard 
            title="Resource Allocation" 
            type="pie" 
            data={pieChartData} 
            delay={0.4} 
          />
        </div>
        
        {/* Placeholder for future detailed list */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-center items-center min-h-[300px]"
        >
          <h3 className="text-lg font-bold text-foreground self-start mb-6 w-full border-b border-border pb-4">Recent Activity Logs</h3>
          <p className="text-foreground/50 italic flex-1 flex items-center">
            Detailed activity logs component will be integrated here.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
