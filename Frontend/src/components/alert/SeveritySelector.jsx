import React from 'react';
import { FiAlertCircle, FiAlertTriangle, FiInfo, FiZap } from 'react-icons/fi';

const severities = [
  { id: 'low', label: 'Low', icon: FiInfo, color: 'text-blue-500', bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20', bgActive: 'bg-blue-100 dark:bg-blue-900/40 border-blue-500' },
  { id: 'medium', label: 'Medium', icon: FiAlertCircle, color: 'text-yellow-500', bgHover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20', bgActive: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-500' },
  { id: 'high', label: 'High', icon: FiAlertTriangle, color: 'text-orange-500', bgHover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20', bgActive: 'bg-orange-100 dark:bg-orange-900/40 border-orange-500' },
  { id: 'critical', label: 'Critical', icon: FiZap, color: 'text-red-500', bgHover: 'hover:bg-red-50 dark:hover:bg-red-900/20', bgActive: 'bg-red-100 dark:bg-red-900/40 border-red-500' },
];

const SeveritySelector = ({ value, onChange, error }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground/80 flex justify-between">
        <span>Severity Level <span className="text-rose-500">*</span></span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {severities.map((sev) => {
          const isActive = value === sev.id;
          const Icon = sev.icon;
          return (
            <button
              key={sev.id}
              type="button"
              onClick={() => onChange(sev.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                isActive 
                  ? sev.bgActive 
                  : `border-border bg-background ${sev.bgHover}`
              }`}
            >
              <Icon className={`${sev.color} mb-2`} size={24} />
              <span className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                {sev.label}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-rose-500 mt-0.5 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};

export default SeveritySelector;
