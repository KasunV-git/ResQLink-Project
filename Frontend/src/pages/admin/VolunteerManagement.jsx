import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VolunteerTable from '../../components/volunteer/VolunteerTable';
import AssignTaskModal from '../../components/volunteer/AssignTaskModal';

// Mock JSON Data
const initialVolunteers = [
  {
    id: 'v101',
    name: 'Kasun Perera',
    email: 'kasun.p@example.com',
    skills: ['Medical First Aid', 'Search & Rescue'],
    isAvailable: true,
    assignedTasks: 0
  },
  {
    id: 'v102',
    name: 'Nimali Fernando',
    email: 'nimali.f@example.com',
    skills: ['Logistics', 'Driving', 'Heavy Machinery'],
    isAvailable: false,
    assignedTasks: 2
  },
  {
    id: 'v103',
    name: 'Chamara Silva',
    email: 'chamara.s@example.com',
    skills: ['Water Rescue', 'Diving'],
    isAvailable: true,
    assignedTasks: 1
  },
  {
    id: 'v104',
    name: 'Sanduni De Silva',
    email: 'sanduni.d@example.com',
    skills: ['Medical Doctor', 'Trauma Care', 'Counseling'],
    isAvailable: true,
    assignedTasks: 0
  },
  {
    id: 'v105',
    name: 'Ruwan Kumara',
    email: 'ruwan.k@example.com',
    skills: ['Communications', 'Drone Operator'],
    isAvailable: false,
    assignedTasks: 1
  }
];

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats for the header
  const totalVolunteers = volunteers.length;
  const availableVolunteers = volunteers.filter(v => v.isAvailable).length;
  const activeTasks = volunteers.reduce((acc, v) => acc + v.assignedTasks, 0);

  const handleOpenAssignModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  const handleAssignTask = (volunteerId, disasterId) => {
    // In a real app, this would hit an API. Here we just update state.
    setVolunteers(volunteers.map(v => {
      if (v.id === volunteerId) {
        return {
          ...v,
          assignedTasks: v.assignedTasks + 1,
          isAvailable: false // Once assigned, we mark them unavailable for now
        };
      }
      return v;
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Volunteer Management
          </h1>
          <p className="text-foreground/70 text-lg">
            Coordinate and assign volunteers to specific disaster zones.
          </p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="flex gap-4 bg-card border border-border p-3 rounded-xl shadow-sm">
          <div className="px-3">
            <p className="text-xs text-foreground/50 uppercase font-semibold">Total</p>
            <p className="text-xl font-bold text-foreground">{totalVolunteers}</p>
          </div>
          <div className="px-3 border-l border-border">
            <p className="text-xs text-foreground/50 uppercase font-semibold">Available</p>
            <p className="text-xl font-bold text-emerald-500">{availableVolunteers}</p>
          </div>
          <div className="px-3 border-l border-border">
            <p className="text-xs text-foreground/50 uppercase font-semibold">Tasks</p>
            <p className="text-xl font-bold text-primary-500">{activeTasks}</p>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <VolunteerTable 
          volunteers={volunteers}
          onAssignTask={handleOpenAssignModal}
        />
      </motion.div>

      {/* Assign Task Modal */}
      <AssignTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        volunteer={selectedVolunteer}
        onAssign={handleAssignTask}
      />
    </div>
  );
};

export default VolunteerManagement;
