import React from 'react';
import FormInput from '../common/FormInput';
import SeveritySelector from './SeveritySelector';
import RecipientCheckboxGroup from './RecipientCheckboxGroup';
import ActionButton from '../common/ActionButton';
import { FiSend, FiRefreshCw } from 'react-icons/fi';

const AlertForm = ({ 
  formData, 
  onFormChange, 
  onSubmit, 
  onClear, 
  errors,
  isSubmitting 
}) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    onFormChange(id, value);
  };

  const handleSeverityChange = (value) => {
    onFormChange('severity', value);
  };

  const handleRecipientsChange = (values) => {
    onFormChange('recipients', values);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <SeveritySelector 
        value={formData.severity} 
        onChange={handleSeverityChange} 
        error={errors.severity}
      />

      <div className="relative">
        <FormInput 
          id="message"
          label="Alert Message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          placeholder="Enter the emergency alert message to broadcast..."
          maxLength={160}
        />
        <div className={`absolute bottom-3 right-3 text-xs font-semibold ${formData.message.length >= 160 ? 'text-rose-500' : 'text-foreground/40'}`}>
          {formData.message.length} / 160
        </div>
      </div>

      <RecipientCheckboxGroup 
        values={formData.recipients}
        onChange={handleRecipientsChange}
        error={errors.recipients}
      />

      <div className="pt-4 border-t border-border flex justify-end gap-3 mt-2">
        <ActionButton 
          type="button"
          variant="ghost" 
          onClick={onClear} 
          label="Clear Form" 
          icon={FiRefreshCw}
          disabled={isSubmitting}
        />
        <ActionButton 
          type="submit"
          variant="danger" 
          label={isSubmitting ? 'Broadcasting...' : 'Broadcast Alert'} 
          icon={FiSend}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default AlertForm;
