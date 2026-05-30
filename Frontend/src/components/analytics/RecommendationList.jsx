import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

const RecommendationList = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-4 bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30">
      <h4 className="text-sm font-bold text-primary-800 dark:text-primary-400 flex items-center gap-2 mb-1">
        <FiCheckCircle /> AI Recommended Actions
      </h4>
      <ul className="flex flex-col gap-2.5">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-200 dark:bg-primary-800/50 text-primary-700 dark:text-primary-300 text-xs font-bold flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <span className="text-sm text-foreground/80 leading-relaxed pt-0.5">
              {rec}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationList;
