import React from 'react';
import Badge from '../common/Badge';

const ResourceStatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return <Badge variant="success">Available</Badge>;
    case 'in-use':
    case 'in use':
      return <Badge variant="info">In-Use</Badge>;
    case 'depleted':
      return <Badge variant="danger">Depleted</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export default ResourceStatusBadge;
