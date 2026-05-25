import React, { useState } from 'react';
import Modal from '../common/Modal';
import ActionButton from '../common/ActionButton';
import { FiCheck, FiBox } from 'react-icons/fi';

const mockDisasters = [
  { id: '1001', title: 'Flood in Colombo' },
  { id: '1002', title: 'Landslide in Kandy' },
  { id: '1003', title: 'Storm Warning Galle' },
];

const AssignResourceModal = ({ isOpen, onClose, resource, onAssign }) => {
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!resource) return null;

  const handleAssign = () => {
    if (!selectedDisaster || quantity <= 0 || quantity > resource.quantity) return;
    onAssign(resource.id, selectedDisaster, quantity);
    setSelectedDisaster('');
    setQuantity(1);
    onClose();
  };

  const footerActions = (
    <>
      <ActionButton variant="ghost" onClick={onClose} label="Cancel" />
      <ActionButton 
        variant="primary" 
        onClick={handleAssign} 
        label="Confirm Assignment" 
        icon={FiCheck}
        disabled={!selectedDisaster || quantity <= 0 || quantity > resource.quantity}
      />
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Assign Resource" 
      footer={footerActions}
      maxWidth="max-w-md"
    >
      <div className="mb-6 flex items-center gap-3 bg-border/20 p-3 rounded-lg border border-border/50">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
          <FiBox size={20} />
        </div>
        <div>
          <p className="font-semibold text-foreground leading-tight">{resource.name}</p>
          <p className="text-xs text-foreground/60">{resource.type} • {resource.quantity} Available</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="disaster-select" className="text-sm font-semibold text-foreground/80">
            Select Destination (Disaster Incident)
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
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quantity-input" className="text-sm font-semibold text-foreground/80">
            Quantity to Dispatch
          </label>
          <input
            id="quantity-input"
            type="number"
            min="1"
            max={resource.quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
          {quantity > resource.quantity && (
            <p className="text-xs text-rose-500 mt-1">Exceeds available quantity ({resource.quantity})</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssignResourceModal;
