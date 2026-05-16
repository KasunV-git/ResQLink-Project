import React from 'react';
import { FiActivity } from 'react-icons/fi';

const RiskScoreBadge = ({ score }) => {
  // Determine color based on score severity
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  let textLabel = 'Unknown';

  if (score >= 80) {
    colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    textLabel = 'Critical Risk';
  } else if (score >= 60) {
    colorClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    textLabel = 'High Risk';
  } else if (score >= 40) {
    colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    textLabel = 'Medium Risk';
  } else {
    colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    textLabel = 'Low Risk';
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-sm ${colorClass}`}>
      <FiActivity size={16} />
      <span>{score}/100</span>
      <span className="hidden sm:inline-block font-medium opacity-80 border-l border-current pl-2 ml-1">
        {textLabel}
      </span>
    </div>
  );
};

export default RiskScoreBadge;
