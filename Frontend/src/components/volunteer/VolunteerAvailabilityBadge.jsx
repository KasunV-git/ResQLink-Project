import React from 'react';
import Badge from '../common/Badge';
import { FiCheckCircle, FiMinusCircle } from 'react-icons/fi';

const VolunteerAvailabilityBadge = ({ isAvailable }) => {
  if (isAvailable) {
    return (
      <Badge variant="success" className="flex items-center gap-1 w-fit">
        <FiCheckCircle size={12} />
        Available
      </Badge>
    );
  }

  return (
    <Badge variant="danger" className="flex items-center gap-1 w-fit">
      <FiMinusCircle size={12} />
      Unavailable
    </Badge>
  );
};

export default VolunteerAvailabilityBadge;
