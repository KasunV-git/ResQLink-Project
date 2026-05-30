import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DisasterReportsTable from '../../components/disaster/DisasterReportsTable';
import DisasterDetailsModal from '../../components/disaster/DisasterDetailsModal';

// Mock JSON Data
const initialReports = [
  {
    id: '1001',
    type: 'Flood',
    location: 'Colombo, Western Province',
    date: '2026-05-15 08:30 AM',
    severity: 'critical',
    status: 'pending',
    description: 'Severe flooding reported in central Colombo affecting multiple residential areas. Water levels rising rapidly.',
    reportedBy: 'Kamal Perera',
    impact: '500+'
  },
  {
    id: '1002',
    type: 'Landslide',
    location: 'Kandy, Central Province',
    date: '2026-05-15 11:45 AM',
    severity: 'high',
    status: 'pending',
    description: 'Mudslide blocking main access road to rural villages. Evacuation assistance required immediately.',
    reportedBy: 'Sunil Silva',
    impact: '150'
  },
  {
    id: '1003',
    type: 'Storm Warning',
    location: 'Galle, Southern Province',
    date: '2026-05-14 02:15 PM',
    severity: 'medium',
    status: 'verified',
    description: 'High winds and coastal surges expected. Fishing communities have been warned.',
    reportedBy: 'Disaster Management Center',
    impact: 'Coastal Areas'
  },
  {
    id: '1004',
    type: 'Fire',
    location: 'Industrial Zone, Gampaha',
    date: '2026-05-13 09:00 PM',
    severity: 'low',
    status: 'rejected',
    description: 'Report of a large fire. Investigation confirmed it was a controlled burn at a local factory. False alarm.',
    reportedBy: 'Anonymous Citizen',
    impact: 'None'
  }
];

const DisasterReports = () => {
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingReports = reports.filter(r => r.status === 'pending');
  const reviewedReports = reports.filter(r => r.status !== 'pending');

  const handleView = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleApprove = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'verified' } : r));
    if (selectedReport?.id === id) setIsModalOpen(false);
  };

  const handleReject = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    if (selectedReport?.id === id) setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Disaster Management
        </h1>
        <p className="text-foreground/70 text-lg">
          Manage and verify reported disaster incidents.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'pending' 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Pending Reports
          <span className="ml-2 bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 py-0.5 px-2 rounded-full text-xs">
            {pendingReports.length}
          </span>
          {activeTab === 'pending' && (
            <motion.div 
              layoutId="tab-indicator" 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" 
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reviewed')}
          className={`pb-4 px-2 text-sm font-semibold transition-colors relative ${
            activeTab === 'reviewed' 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Reviewed Incidents
          {activeTab === 'reviewed' && (
            <motion.div 
              layoutId="tab-indicator" 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" 
            />
          )}
        </button>
      </div>

      {/* Table Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DisasterReportsTable 
          reports={activeTab === 'pending' ? pendingReports : reviewedReports}
          isPendingTable={activeTab === 'pending'}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </motion.div>

      {/* View Modal */}
      <DisasterDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default DisasterReports;
