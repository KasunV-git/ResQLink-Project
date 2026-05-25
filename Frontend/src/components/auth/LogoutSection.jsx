import React from 'react';
import Card from '../common/Card';
import ActionButton from '../common/ActionButton';
import { FiLogOut, FiAlertTriangle } from 'react-icons/fi';

const LogoutSection = ({ onLogout }) => {
  return (
    <Card className="max-w-2xl mx-auto border-rose-200 dark:border-rose-900/30">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500 flex-shrink-0">
          <FiAlertTriangle size={24} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-foreground">Sign Out</h3>
          <p className="text-sm text-foreground/60">
            Securely sign out of your ResQLink administrative session.
          </p>
        </div>
        <ActionButton 
          variant="danger" 
          label="Logout" 
          icon={FiLogOut} 
          onClick={onLogout}
          className="w-full md:w-auto"
        />
      </div>
    </Card>
  );
};

export default LogoutSection;
