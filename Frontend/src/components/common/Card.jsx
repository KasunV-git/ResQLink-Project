import React from 'react';

const Card = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-border bg-card/50">
          {title && <h3 className="text-lg font-bold text-foreground">{title}</h3>}
          {subtitle && <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 flex-1">
        {children}
      </div>
    </div>
  );
};

export default Card;
