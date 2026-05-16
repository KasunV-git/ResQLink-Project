import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground/70 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
