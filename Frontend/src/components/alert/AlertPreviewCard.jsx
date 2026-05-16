import React from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiSmartphone, FiClock } from 'react-icons/fi';

const AlertPreviewCard = ({ message, severity }) => {
  const isPlaceholder = !message;
  const displayMessage = message || "This is a live preview of how the alert will appear on recipients' devices.";

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-border/20 rounded-xl p-6 border border-border/50 items-center justify-center">
      <div className="flex items-center gap-2 mb-6 text-foreground/50">
        <FiSmartphone size={20} />
        <span className="text-sm font-semibold tracking-wider uppercase">Live Device Preview</span>
      </div>

      <motion.div
        layout
        className="w-full max-w-[320px] bg-card rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col"
      >
        <div className={`${getSeverityColor()} px-4 py-3 flex items-center justify-between transition-colors duration-300`}>
          <div className="flex items-center gap-2 text-white">
            <FiBell size={16} />
            <span className="font-bold text-sm tracking-wide">EMERGENCY ALERT</span>
          </div>
          <span className="text-white/80 text-xs font-semibold capitalize bg-black/20 px-2 py-0.5 rounded-full">
            {severity || 'Unknown'}
          </span>
        </div>
        
        <div className="p-5 flex flex-col gap-3 min-h-[140px]">
          <p className={`text-sm leading-relaxed transition-all duration-300 ${isPlaceholder ? 'text-foreground/40 italic' : 'text-foreground font-medium'}`}>
            {displayMessage}
          </p>
          
          <div className="mt-auto flex items-center gap-1.5 text-xs text-foreground/40 pt-4 border-t border-border/50">
            <FiClock size={12} />
            <span>Just now</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlertPreviewCard;
