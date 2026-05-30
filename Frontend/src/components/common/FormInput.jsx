import React from 'react';

const FormInput = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  required, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-foreground/80 flex justify-between">
          <span>{label} {required && <span className="text-rose-500">*</span>}</span>
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          required={required}
          className={`w-full bg-background border ${error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary-500/50'} rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all min-h-[120px] resize-y`}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          className={`w-full bg-background border ${error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary-500/50'} rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 transition-all`}
          {...props}
        />
      )}
      
      {error && <p className="text-xs text-rose-500 mt-0.5 animate-in slide-in-from-top-1">{error}</p>}
    </div>
  );
};

export default FormInput;
