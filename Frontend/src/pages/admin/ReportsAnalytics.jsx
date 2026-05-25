import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiBox, FiClock, FiDownload } from 'react-icons/fi';
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard';
import ResponseTimeChart from '../../components/analytics/ResponseTimeChart';
import DisasterTypeChart from '../../components/analytics/DisasterTypeChart';
import ResourceUsageChart from '../../components/analytics/ResourceUsageChart';
import VolunteerPerformanceTable from '../../components/analytics/VolunteerPerformanceTable';
import ActionButton from '../../components/common/ActionButton';

const ReportsAnalytics = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-foreground/70 text-lg">
            Comprehensive overview of system performance and operational efficiency.
          </p>
        </div>
        
        <ActionButton 
          variant="primary" 
          label="Export Report" 
          icon={FiDownload}
          className="w-full md:w-auto"
        />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsStatCard 
          title="Total Reports" 
          value="1,248" 
          icon={FiTrendingUp} 
          trend="up" 
          trendValue="+12%" 
          colorClass="bg-primary-500" 
        />
        <AnalyticsStatCard 
          title="Avg Response" 
          value="24m" 
          icon={FiClock} 
          trend="down" 
          trendValue="-5m" 
          colorClass="bg-emerald-500" 
        />
        <AnalyticsStatCard 
          title="Total Volunteers" 
          value="850" 
          icon={FiUsers} 
          trend="up" 
          trendValue="+45" 
          colorClass="bg-blue-500" 
        />
        <AnalyticsStatCard 
          title="Resources Used" 
          value="82%" 
          icon={FiBox} 
          trend="up" 
          trendValue="Optimized" 
          colorClass="bg-amber-500" 
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseTimeChart />
        <DisasterTypeChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Large Resource Chart */}
        <div className="xl:col-span-2">
          <ResourceUsageChart />
        </div>
        
        {/* Performance Table */}
        <div className="xl:col-span-1">
          <VolunteerPerformanceTable />
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
