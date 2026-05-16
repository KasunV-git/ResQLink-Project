import React from 'react';
import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ message = 'No data available.', subMessage, icon: Icon = FiInbox }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-12 flex flex-col items-center justify-center text-center rounded-xl bg-card border border-border border-dashed shadow-sm"
    >
      <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center mb-4 text-foreground/40">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{message}</h3>
      {subMessage && <p className="text-sm text-foreground/60">{subMessage}</p>}
    </motion.div>
  );
};

export default EmptyState;
