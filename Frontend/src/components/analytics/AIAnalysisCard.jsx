import React from 'react';
import Card from '../common/Card';
import RiskScoreBadge from './RiskScoreBadge';
import RecommendationList from './RecommendationList';
import { FiCpu, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AIAnalysisCard = ({ analysis, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-300">
        <div className="p-1 pb-4 flex justify-between items-start border-b border-border/50 mb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary-500 font-semibold text-xs tracking-wider uppercase mb-1">
              <FiCpu size={14} />
              <span>AI Insight #{analysis.id}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground leading-tight">
              {analysis.disasterTitle}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-foreground/50 mt-1">
              <FiClock size={12} />
              <span>Generated: {analysis.timestamp}</span>
            </div>
          </div>
          
          <RiskScoreBadge score={analysis.riskScore} />
        </div>

        <div className="flex flex-col flex-1">
          <div className="mb-2">
            <h4 className="text-sm font-semibold text-foreground/80 mb-2 uppercase tracking-wider">Situation Analysis</h4>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {analysis.situationAnalysis}
            </p>
          </div>

          <div className="mt-auto pt-2">
            <RecommendationList recommendations={analysis.recommendations} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIAnalysisCard;
