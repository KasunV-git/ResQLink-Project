import React from 'react';
import { FiCpu } from 'react-icons/fi';
import AIAnalysisCard from '../../components/analytics/AIAnalysisCard';

// Mock JSON Data for AI Insights
const mockInsights = [
  {
    id: 'AI-892',
    disasterTitle: 'Colombo Urban Flood Risk',
    timestamp: 'Today, 08:30 AM',
    riskScore: 85,
    situationAnalysis: 'Satellite imagery and localized weather patterns indicate a 90% probability of severe urban flooding in the Colombo 07 and 08 regions within the next 4 hours. Drainage systems are currently operating at 85% capacity and will likely overflow.',
    recommendations: [
      'Pre-deploy water rescue teams to Colombo 07.',
      'Issue critical evacuation alerts to low-lying residential sectors.',
      'Dispatch 500 sandbags and 5 heavy water pumps from the Central Warehouse immediately.'
    ]
  },
  {
    id: 'AI-891',
    disasterTitle: 'Kandy Landslide Vulnerability',
    timestamp: 'Today, 06:15 AM',
    riskScore: 65,
    situationAnalysis: 'Soil moisture sensors in the central highland region have detected saturation levels nearing critical thresholds. While immediate collapse is not predicted, continued rainfall over the next 24 hours will escalate the risk to severe.',
    recommendations: [
      'Monitor sensor telemetry every 30 minutes.',
      'Place Kandy district emergency responders on standby.',
      'Prepare temporary shelter capacity for 200 potential evacuees.'
    ]
  },
  {
    id: 'AI-890',
    disasterTitle: 'Galle Coastal Swell Warning',
    timestamp: 'Yesterday, 11:45 PM',
    riskScore: 42,
    situationAnalysis: 'Oceanic buoys detect abnormal swell patterns approaching the southern coast. Current models suggest minor coastal flooding during high tide, but no structural damage to infrastructure is expected.',
    recommendations: [
      'Issue advisory warnings to local fishermen and small craft.',
      'Deploy volunteer monitors to key coastal vantage points.',
      'Ensure life jacket inventory is fully stocked at Galle Depot.'
    ]
  }
];

const AIAnalysis = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FiCpu className="text-primary-500" /> AI Insights & Analysis
          </h1>
          <p className="text-foreground/70 text-lg">
            Machine learning predictions and automated risk assessments based on real-time telemetry.
          </p>
        </div>
        
        {/* Quick Summary Badge */}
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </div>
          <span className="text-sm font-semibold text-primary-800 dark:text-primary-400">
            AI Engine Active • Processing 3 streams
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockInsights.map((insight, index) => (
          <AIAnalysisCard 
            key={insight.id} 
            analysis={insight} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default AIAnalysis;
