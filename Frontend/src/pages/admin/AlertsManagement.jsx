import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Card from '../../components/common/Card';
import AlertForm from '../../components/alert/AlertForm';
import AlertPreviewCard from '../../components/alert/AlertPreviewCard';

const initialFormData = {
  severity: '',
  message: '',
  recipients: []
};

const AlertsManagement = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.severity) newErrors.severity = 'Please select a severity level.';
    if (!formData.message.trim()) newErrors.message = 'Alert message is required.';
    if (formData.recipients.length === 0) newErrors.recipients = 'Please select at least one recipient group.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Alert has been successfully broadcasted to all selected recipients.');
      setFormData(initialFormData);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1500);
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Alert Management
        </h1>
        <p className="text-foreground/70 text-lg">
          Broadcast emergency alerts and critical updates instantly.
        </p>
      </div>

      {/* Success Message Banner */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3 shadow-sm"
          >
            <FiCheckCircle className="text-emerald-500" size={24} />
            <p className="text-emerald-800 dark:text-emerald-300 font-semibold">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Section */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Card 
            title="Compose New Alert" 
            subtitle="Configure your message and select the appropriate target audiences."
          >
            <AlertForm 
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </Card>
        </div>

        {/* Live Preview Section */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <AlertPreviewCard 
            message={formData.message} 
            severity={formData.severity} 
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsManagement;
