import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiAlertTriangle, 
  FiUsers, 
  FiBox, 
  FiBell, 
  FiActivity, 
  FiBarChart2, 
  FiUser,
  FiX
} from 'react-icons/fi';

const menuItems = [
  { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
  { path: '/admin/disasters', icon: FiAlertTriangle, label: 'Disaster Reports' },
  { path: '/admin/volunteers', icon: FiUsers, label: 'Volunteer Mgmt' },
  { path: '/admin/resources', icon: FiBox, label: 'Resource Mgmt' },
  { path: '/admin/alerts', icon: FiBell, label: 'Alerts Mgmt' },
  { path: '/admin/ai-analysis', icon: FiActivity, label: 'AI Analysis' },
  { path: '/admin/reports', icon: FiBarChart2, label: 'Reports & Analytics' },
  { path: '/admin/profile', icon: FiUser, label: 'Profile' },
];

const MobileSidebar = ({ isOpen, onClose }) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-card border-r border-border z-50 flex flex-col lg:hidden shadow-2xl"
          >
            <div className="h-16 flex items-center justify-between border-b border-border px-4">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-600">
                ResQLink
              </span>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-border/50 text-foreground transition-colors"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) => 
                      `flex items-center p-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                          : 'text-foreground/70 hover:bg-border/50 hover:text-foreground'
                      }`
                    }
                  >
                    <Icon size={20} className="min-w-[20px]" />
                    <span className="ml-4">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-foreground/60">admin@resqlink.com</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
