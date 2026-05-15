import React from 'react';
import { FiMenu, FiBell, FiSearch, FiChevronDown } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar, toggleMobileSidebar, isCollapsed }) => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
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

        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <FiSearch className="absolute left-3 text-foreground/50" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-border/50 text-foreground transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>

        {/* Profile Dropdown (simplified) */}
        <div className="flex items-center gap-2 pl-2 border-l border-border cursor-pointer hover:bg-border/30 p-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            A
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-foreground leading-none">Admin User</p>
            <p className="text-xs text-foreground/60 mt-1">Super Admin</p>
          </div>
          <FiChevronDown size={16} className="text-foreground/50 hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
