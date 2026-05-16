import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import ResourceStatsCard from '../../components/resource/ResourceStatsCard';
import ResourceInventoryTable from '../../components/resource/ResourceInventoryTable';
import AssignResourceModal from '../../components/resource/AssignResourceModal';

// Mock JSON Data
const initialResources = [
  {
    id: 'r101',
    name: 'Medical Supply Kits',
    type: 'Medical',
    quantity: 150,
    location: 'Central Warehouse (Colombo)',
    status: 'Available'
  },
  {
    id: 'r102',
    name: 'Heavy Excavator',
    type: 'Machinery',
    quantity: 2,
    location: 'Kandy Depot',
    status: 'In-Use'
  },
  {
    id: 'r103',
    name: 'Purified Water Bottles (1L)',
    type: 'Food & Water',
    quantity: 45,
    location: 'Galle Depot',
    status: 'Available'
  },
  {
    id: 'r104',
    name: 'Emergency Tents',
    type: 'Shelter',
    quantity: 0,
    location: 'Central Warehouse (Colombo)',
    status: 'Depleted'
  },
  {
    id: 'r105',
    name: 'Life Jackets',
    type: 'Safety Gear',
    quantity: 320,
    location: 'Galle Depot',
    status: 'Available'
  }
];

const ResourceManagement = () => {
  const [resources, setResources] = useState(initialResources);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats calculation
  const totalAvailable = resources.filter(r => r.status === 'Available').reduce((acc, r) => acc + r.quantity, 0);
  const totalInUse = resources.filter(r => r.status === 'In-Use').reduce((acc, r) => acc + r.quantity, 0);
  const depletedCount = resources.filter(r => r.status === 'Depleted' || r.quantity === 0).length;

  const handleOpenAssignModal = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleAssignResource = (resourceId, disasterId, amountToAssign) => {
    setResources(resources.map(r => {
      if (r.id === resourceId) {
        const newQuantity = r.quantity - amountToAssign;
        return {
          ...r,
          quantity: newQuantity,
          status: newQuantity <= 0 ? 'Depleted' : r.status
        };
      }
      return r;
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Resource Management
        </h1>
        <p className="text-foreground/70 text-lg">
          Track, allocate, and manage relief supplies and equipment.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <ResourceStatsCard 
          title="Available Stock" 
          value={totalAvailable.toString()} 
          icon={FiBox} 
          trend="up" 
          trendValue="Healthy" 
          colorClass="bg-emerald-500" 
        />
        <ResourceStatsCard 
          title="Items In-Use" 
          value={totalInUse.toString()} 
          icon={FiTrendingUp} 
          trend="up" 
          trendValue="Active" 
          colorClass="bg-primary-500" 
        />
        <ResourceStatsCard 
          title="Depleted Categories" 
          value={depletedCount.toString()} 
          icon={FiAlertTriangle} 
          trend={depletedCount > 0 ? "down" : "up"} 
          trendValue={depletedCount > 0 ? "Needs Restock" : "All Good"} 
          colorClass={depletedCount > 0 ? "bg-rose-500" : "bg-emerald-500"} 
        />
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Inventory Overview</h2>
        </div>
        
        <ResourceInventoryTable 
          resources={resources}
          onAssign={handleOpenAssignModal}
        />
      </motion.div>

      {/* Assign Modal */}
      <AssignResourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resource={selectedResource}
        onAssign={handleAssignResource}
      />
    </div>
  );
};

export default ResourceManagement;
