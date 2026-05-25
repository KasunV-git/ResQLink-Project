import React from 'react';
import StatCard from '../common/StatCard';

const ResourceStatsCard = ({ title, value, icon, trend, trendValue, colorClass }) => {
  return (
    <StatCard 
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      trendValue={trendValue}
      colorClass={colorClass}
    />
  );
};

export default ResourceStatsCard;
