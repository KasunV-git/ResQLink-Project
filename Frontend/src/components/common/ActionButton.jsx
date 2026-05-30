import React from 'react';

const ActionButton = ({ onClick, icon: Icon, label, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-500",
    danger: "bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500",
    ghost: "hover:bg-border/50 text-foreground border border-transparent hover:border-border focus:ring-border",
    icon: "p-2 rounded-lg transition-colors hover:bg-border/50 focus:ring-border text-foreground/70 hover:text-foreground"
  };

  const isIconOnly = variant === 'icon';

  return (
    <button 
      onClick={onClick} 
      className={`${isIconOnly ? variants.icon : `${baseStyles} ${variants[variant]}`} ${className}`}
      {...props}
    >
      {Icon && <Icon size={isIconOnly ? 18 : 16} />}
      {!isIconOnly && label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
