import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({ title, subtitle, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col ${className}`}
    >
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-foreground/60 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6 flex-1 min-h-[300px]">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
