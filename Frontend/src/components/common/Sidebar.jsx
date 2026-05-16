import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiAlertTriangle, 
  FiUsers, 
  FiBox, 
  FiBell, 
  FiActivity, 
  FiBarChart2, 
  FiUser 
} from 'react-icons/fi';

const menuItems = [
  { path: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
  { path: '/admin/disasters', icon: FiAlertTriangle, label: 'Disaster Management' },
  { path: '/admin/volunteers', icon: FiUsers, label: 'Volunteer Management' },
  { path: '/admin/resources', icon: FiBox, label: 'Resource Management' },
  { path: '/admin/alerts', icon: FiBell, label: 'Alert Management' },
  { path: '/admin/ai-analysis', icon: FiActivity, label: 'AI Analysis' },
  { path: '/admin/reports', icon: FiBarChart2, label: 'Reports & Analytics' },
  { path: '/admin/profile', icon: FiUser, label: 'Profile' },
];

const Sidebar = ({ isCollapsed }) => {
  return (
    <aside 
      className={`hidden lg:flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-600 truncate">
          {isCollapsed ? 'RQ' : 'ResQLink'}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `relative flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-foreground/70 hover:bg-border/50 hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={20} className={`min-w-[20px] ${isActive ? 'text-primary-500' : ''}`} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-14 bg-card border border-border shadow-md px-2 py-1 rounded text-sm text-foreground opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-primary-500/10 to-indigo-500/10 border border-primary-500/20 rounded-xl p-4 text-sm">
            <p className="font-semibold text-primary-600 dark:text-primary-400 mb-1">Need Help?</p>
            <p className="text-foreground/60 mb-3 text-xs">Check out our documentation</p>
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors font-medium text-xs">
              View Docs
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
