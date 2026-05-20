import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const colorMap = {
  'bg-rose-500': {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    border: 'border border-rose-500/20 dark:border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.1)] dark:shadow-[0_0_20px_rgba(244,63,94,0.2)]'
  },
  'bg-primary-500': {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    border: 'border border-blue-500/20 dark:border-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
  },
  'bg-amber-500': {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    border: 'border border-amber-500/20 dark:border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)] dark:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
  },
  'bg-emerald-500': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    border: 'border border-emerald-500/20 dark:border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]'
  },
  'bg-blue-500': {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    border: 'border border-blue-500/20 dark:border-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]'
  }
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  const isPositive = trend === 'up';
  
  const styles = colorMap[colorClass] || {
    bg: 'bg-primary-500/10 dark:bg-primary-500/20',
    border: 'border border-primary-500/20',
    text: 'text-primary-600 dark:text-primary-400',
    glow: ''
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 12px 30px -10px rgba(0, 0, 0, 0.15)" }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-full"
    >
      {/* Premium Colored Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass}`} />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground/70 font-semibold text-sm tracking-tight">{title}</h3>
          {/* Glowing Colored Icon Badge Box */}
          <div className={`p-2.5 rounded-xl ${styles.bg} ${styles.border} ${styles.text} ${styles.glow} transition-all duration-300 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">{value}</p>
          </div>
          {/* Dynamic Colored Status/Trend Pill Badge */}
          {trend && (
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-all duration-300 ${
              isPositive 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-500/20'
            }`}>
              {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

