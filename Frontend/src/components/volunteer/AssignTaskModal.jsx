import React, { useState } from 'react';
import Modal from '../common/Modal';
import ActionButton from '../common/ActionButton';
import { FiCheck, FiUser } from 'react-icons/fi';

const mockDisasters = [
  { id: '1001', title: 'Flood in Colombo' },
  { id: '1002', title: 'Landslide in Kandy' },
  { id: '1003', title: 'Storm Warning Galle' },
];

const AssignTaskModal = ({ isOpen, onClose, volunteer, onAssign }) => {
  const [selectedDisaster, setSelectedDisaster] = useState('');

  if (!volunteer) return null;

  const handleAssign = () => {
    if (!selectedDisaster) return;
    onAssign(volunteer.id, selectedDisaster);
    setSelectedDisaster('');
    onClose();
  };

  const footerActions = (
    <>
      <ActionButton variant="ghost" onClick={onClose} label="Cancel" />
      <ActionButton 
        variant="primary" 
        onClick={handleAssign} 
        label="Assign Task" 
        icon={FiCheck}
        disabled={!selectedDisaster}
      />
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Assign Volunteer to Disaster" 
      footer={footerActions}
      maxWidth="max-w-md"
    >
      <div className="mb-6 flex items-center gap-3 bg-border/20 p-3 rounded-lg border border-border/50">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
          <FiUser size={20} />
        </div>
        <div>
          <p className="font-semibold text-foreground leading-tight">{volunteer.name}</p>
          <p className="text-xs text-foreground/60">{volunteer.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="disaster-select" className="text-sm font-semibold text-foreground/80">
          Select Active Disaster
        </label>
        <select
          id="disaster-select"
          value={selectedDisaster}
          onChange={(e) => setSelectedDisaster(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
        >
          <option value="" disabled>-- Select a disaster --</option>
          {mockDisasters.map(d => (
            <option key={d.id} value={d.id}>[{d.id}] {d.title}</option>
          ))}
        </select>
        <p className="text-xs text-foreground/50 mt-1">
          Only active and verified disasters are listed here.
        </p>
      </div>
    </Modal>
  );
};

export default AssignTaskModal;
