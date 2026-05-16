import React from 'react';
import { FiMapPin, FiCalendar, FiUser, FiInfo, FiCheck, FiX } from 'react-icons/fi';
import Modal from '../common/Modal';
import ActionButton from '../common/ActionButton';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';

const DisasterDetailsModal = ({ isOpen, onClose, report, onApprove, onReject }) => {
  if (!report) return null;

  const isPending = report.status === 'pending';

  const footerActions = (
    <>
      <ActionButton variant="ghost" onClick={onClose} label="Close" />
      {isPending && (
        <>
          <ActionButton 
            variant="danger" 
            onClick={() => onReject(report.id)} 
            label="Reject False Alarm" 
            icon={FiX}
          />
          <ActionButton 
            variant="success" 
            onClick={() => onApprove(report.id)} 
            label="Verify & Approve" 
            icon={FiCheck}
          />
        </>
      )}
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Incident #${report.id}`} 
      footer={footerActions}
    >
      <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{report.type}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-foreground/70">
            <span className="flex items-center gap-1.5"><FiMapPin className="text-primary-500" /> {report.location}</span>
            <span className="flex items-center gap-1.5"><FiCalendar className="text-primary-500" /> {report.date}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <StatusBadge status={report.status} />
          <SeverityBadge severity={report.severity} />
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-lg p-5 mb-6 shadow-sm">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FiInfo className="text-primary-500" /> Description
        </h4>
        <p className="text-foreground/80 leading-relaxed text-sm">
          {report.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-border/10 border border-border/50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">Reported By</h4>
          <p className="text-foreground font-medium flex items-center gap-2">
            <FiUser className="text-primary-500" /> {report.reportedBy}
          </p>
        </div>
        <div className="bg-border/10 border border-border/50 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1">Casualties / Impact</h4>
          <p className="text-foreground font-medium">Est. {report.impact} affected</p>
        </div>
      </div>
    </Modal>
  );
};

export default DisasterDetailsModal;
