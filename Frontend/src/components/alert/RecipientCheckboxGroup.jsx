import React from 'react';
import { FiUsers, FiShield, FiCrosshair, FiGlobe } from 'react-icons/fi';

const recipientTypes = [
  { id: 'all_citizens', label: 'All Citizens', icon: FiGlobe, desc: 'Broadcast to everyone' },
  { id: 'volunteers', label: 'Registered Volunteers', icon: FiUsers, desc: 'Only active volunteers' },
  { id: 'first_responders', label: 'First Responders', icon: FiShield, desc: 'Police, Medical, Fire' },
  { id: 'local_authorities', label: 'Local Authorities', icon: FiCrosshair, desc: 'Government officials' },
];

const RecipientCheckboxGroup = ({ values, onChange, error }) => {
  const toggleRecipient = (id) => {
    if (values.includes(id)) {
      onChange(values.filter(v => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground/80 flex justify-between">
        <span>Target Recipients <span className="text-rose-500">*</span></span>
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
        {recipientTypes.map(type => {
          const isChecked = values.includes(type.id);
          const Icon = type.icon;
          
          return (
            <div 
              key={type.id}
              onClick={() => toggleRecipient(type.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                isChecked 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                  : 'border-border bg-background hover:bg-border/30'
              }`}
            >
              <div className={`flex items-center justify-center w-5 h-5 rounded border ${isChecked ? 'bg-primary-500 border-primary-500' : 'bg-background border-border'} transition-colors`}>
                {isChecked && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              
              <div className="flex flex-col flex-1">
                <span className={`text-sm font-semibold ${isChecked ? 'text-primary-700 dark:text-primary-400' : 'text-foreground'}`}>
                  {type.label}
                </span>
                <span className="text-xs text-foreground/60">{type.desc}</span>
              </div>
              
              <Icon className={isChecked ? 'text-primary-500' : 'text-foreground/40'} size={18} />
            </div>
          );
        })}
      </div>
      {error && <p className="text-xs text-rose-500 mt-0.5 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};

export default RecipientCheckboxGroup;
