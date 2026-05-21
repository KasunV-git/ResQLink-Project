import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiAlertTriangle, FiUsers, FiBox, FiCheckCircle, 
  FiSearch, FiClock 
} from 'react-icons/fi';
import StatCard from '../../components/common/StatCard';
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

// Mock Recent Activity Logs
const activityLogsData = [
  { id: 1, type: 'disaster', severity: 'critical', message: 'Critical Landslide threat warning issued for Kandy District', time: '2 mins ago', region: 'Kandy' },
  { id: 2, type: 'resource', severity: 'success', message: '200 Water Purifiers and 50 Tents delivered to Galle Relief Camp', time: '12 mins ago', region: 'Galle' },
  { id: 3, type: 'volunteer', severity: 'info', message: '45 Emergency medical volunteers registered for Colombo dispatch', time: '45 mins ago', region: 'Colombo' },
  { id: 4, type: 'incident', severity: 'success', message: 'Galle storm hazard incident successfully marked as RESOLVED', time: '2 hours ago', region: 'Galle' },
  { id: 5, type: 'resource', severity: 'warning', message: 'Medical supplies running low (< 15% stock) in Jaffna Central Warehouse', time: '4 hours ago', region: 'Jaffna' },
  { id: 6, type: 'disaster', severity: 'info', message: 'Precautionary flood alert issued for Kelani River banks', time: '5 hours ago', region: 'Colombo' },
];

const severityColors = {
  critical: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-500/20',
  warning: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-500/20',
  success: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-500/20',
  info: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/20',
};

const typeIcons = {
  disaster: FiAlertTriangle,
  resource: FiBox,
  volunteer: FiUsers,
  incident: FiCheckCircle,
};

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Filter logs based on search query and selected severity
  const filteredLogs = activityLogsData.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

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
        
        {/* Upgraded Recent Activity Logs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Recent Activity Logs</h3>
              <p className="text-xs text-foreground/50 mt-0.5">Live system queries, resource dispatches, and incident logs</p>
            </div>
            
            {/* Search Input Query */}
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs by region or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-foreground/30"
              />
            </div>
          </div>

          {/* Severity Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mr-1">Severity:</span>
            {['all', 'critical', 'warning', 'success', 'info'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeverity(s)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all duration-200 capitalize ${
                  selectedSeverity === s
                    ? 'bg-primary-500 text-white border-primary-500 shadow-sm dark:bg-primary-600 dark:border-primary-600'
                    : 'text-foreground/60 bg-transparent border-border/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Logs Feed Container */}
          <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-3 scrollbar-thin">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const LogIcon = typeIcons[log.type];
                const badgeStyle = severityColors[log.severity];
                return (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-4 p-3 rounded-lg border border-border/40 bg-slate-50/20 hover:bg-slate-50/60 dark:bg-slate-800/5 dark:hover:bg-slate-800/15 transition-all duration-200"
                  >
                    <div className={`p-2 rounded-lg ${badgeStyle} shrink-0 mt-0.5`}>
                      <LogIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {log.message}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-foreground/50">
                          <span className="font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 px-1.5 py-0.5 rounded">
                            {log.region}
                          </span>
                          <span className="capitalize">{log.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground/40 shrink-0 self-start sm:self-center">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>{log.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-foreground/50 italic text-sm">No activity logs match your filter query.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSeverity('all');
                  }}
                  className="mt-2 text-xs font-bold text-primary-500 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
