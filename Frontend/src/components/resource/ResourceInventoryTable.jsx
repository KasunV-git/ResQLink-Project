import React from 'react';
import { FiSend, FiAlertCircle } from 'react-icons/fi';
import Table from '../common/Table';
import ActionButton from '../common/ActionButton';
import ResourceStatusBadge from './ResourceStatusBadge';

const ResourceInventoryTable = ({ resources, onAssign }) => {
  const columns = [
    { 
      key: 'name', 
      label: 'Resource Name', 
      render: (r) => <span className="font-semibold text-foreground">{r.name}</span> 
    },
    { 
      key: 'type', 
      label: 'Type',
      render: (r) => <span className="text-foreground/80">{r.type}</span> 
    },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      render: (r) => (
        <div className="flex items-center gap-2 justify-end md:justify-start">
          <span className="font-bold text-foreground">{r.quantity}</span>
          {r.quantity > 0 && r.quantity <= 50 && (
            <span className="text-amber-500 flex items-center gap-1" title="Low Stock Warning">
              <FiAlertCircle size={14} />
              <span className="text-[10px] uppercase font-bold tracking-wider hidden lg:inline">Low</span>
            </span>
          )}
        </div>
      )
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (r) => <span className="text-foreground/80">{r.location}</span> 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r) => <ResourceStatusBadge status={r.status} /> 
    }
  ];

  const renderActions = (resource) => (
    <ActionButton 
      variant="ghost" 
      icon={FiSend} 
      onClick={() => onAssign(resource)} 
      label="Assign"
      className="text-xs py-1.5 border-border shadow-sm text-primary-600 dark:text-primary-400"
      disabled={resource.status === 'Depleted' || resource.quantity <= 0}
    />
  );

  return (
    <Table 
      columns={columns} 
      data={resources} 
      renderActions={renderActions}
      emptyMessage="No resources found in inventory."
    />
  );
};

export default ResourceInventoryTable;
