import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiBell, FiSearch, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const Navbar = ({ toggleSidebar, toggleMobileSidebar, isCollapsed }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/admin/profile');
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 -ml-2 rounded-full hover:bg-border/50 text-foreground transition-colors"
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>

        {/* Desktop collapse button */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 -ml-2 rounded-full hover:bg-border/50 text-foreground transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Search - Centered */}
      <div className="hidden md:flex items-center justify-center relative">
        <FiSearch className="absolute left-3 text-foreground/50" size={16} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="pl-9 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-96 transition-all"
        />
      </div>

      <div className="flex items-center justify-end gap-3 md:gap-4 flex-1">
        <ThemeToggle />
        
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-border/50 text-foreground transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer hover:bg-border/30 p-1.5 rounded-lg transition-colors select-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              A
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-foreground leading-none">Admin User</p>
              <p className="text-xs text-foreground/60 mt-1">Super Admin</p>
            </div>
            <FiChevronDown 
              size={16} 
              className={`text-foreground/50 hidden md:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl py-2 z-50 origin-top-right backdrop-blur-md bg-card/95"
              >
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Admin User</p>
                  <p className="text-xs text-foreground/60">admin@resqlink.org</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleProfileClick}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-border/50 rounded-lg transition-colors text-left"
                  >
                    <FiUser size={16} className="text-foreground/50" />
                    <span>Profile Section</span>
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium"
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

