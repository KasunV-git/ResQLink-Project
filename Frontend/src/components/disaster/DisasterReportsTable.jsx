import React from 'react';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';
import Table from '../common/Table';
import ActionButton from '../common/ActionButton';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';

const DisasterReportsTable = ({ reports, onView, onApprove, onReject, isPendingTable }) => {
  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-semibold text-foreground">#{r.id}</span> },
    { key: 'type', label: 'Type', render: (r) => <span className="font-medium">{r.type}</span> },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date Reported' },
    { key: 'severity', label: 'Severity', render: (r) => <SeverityBadge severity={r.severity} /> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }
  ];

  const renderActions = (report) => (
    <>
      <ActionButton 
        variant="icon" 
        icon={FiEye} 
        onClick={() => onView(report)} 
        title="View Details"
        aria-label="View Details"
        className="text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30"
      />
      {isPendingTable && (
        <>
          <ActionButton 
            variant="icon" 
            icon={FiCheck} 
            onClick={() => onApprove(report.id)} 
            title="Approve Report"
            aria-label="Approve Report"
            className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          />
          <ActionButton 
            variant="icon" 
            icon={FiX} 
            onClick={() => onReject(report.id)} 
            title="Reject False Alarm"
            aria-label="Reject Report"
            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
          />
        </>
      )}
    </>
  );

  return (
    <Table 
      columns={columns} 
      data={reports} 
      renderActions={renderActions}
      emptyMessage={isPendingTable ? 'No pending reports.' : 'No reviewed reports found.'}
    />
  );
};

export default DisasterReportsTable;
