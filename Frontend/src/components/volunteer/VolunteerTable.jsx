import React from 'react';
import { FiPlus } from 'react-icons/fi';
import Table from '../common/Table';
import ActionButton from '../common/ActionButton';
import VolunteerAvailabilityBadge from './VolunteerAvailabilityBadge';
import VolunteerSkills from './VolunteerSkills';

const VolunteerTable = ({ volunteers, onAssignTask }) => {
  const columns = [
    { 
      key: 'name', 
      label: 'Volunteer', 
      render: (v) => (
        <div>
          <p className="font-semibold text-foreground">{v.name}</p>
          <p className="text-xs text-foreground/60">{v.email}</p>
        </div>
      ) 
    },
    { 
      key: 'skills', 
      label: 'Skills', 
      render: (v) => <VolunteerSkills skills={v.skills} /> 
    },
    { 
      key: 'availability', 
      label: 'Availability', 
      render: (v) => <VolunteerAvailabilityBadge isAvailable={v.isAvailable} /> 
    },
    { 
      key: 'assignedTasks', 
      label: 'Active Tasks', 
      render: (v) => (
        <span className={`font-semibold ${v.assignedTasks > 0 ? 'text-primary-500' : 'text-foreground/50'}`}>
          {v.assignedTasks}
        </span>
      )
    }
  ];

  const renderActions = (volunteer) => (
    <ActionButton 
      variant="ghost" 
      icon={FiPlus} 
      onClick={() => onAssignTask(volunteer)} 
      label="Assign Task"
      className="text-xs py-1.5 border-border shadow-sm text-primary-600 dark:text-primary-400"
    />
  );

  return (
    <Table 
      columns={columns} 
      data={volunteers} 
      renderActions={renderActions}
      emptyMessage="No registered volunteers found."
    />
  );
};

export default VolunteerTable;
