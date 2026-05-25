import React from 'react';
import { FiShield, FiZap, FiUsers, FiAlertTriangle, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import '../../styles/auth.css';

import { useTheme } from '../../context/ThemeContext';

// ── Theme toggle (integrated with global ThemeContext) ──────────────────────
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="absolute top-4 right-4 z-50 p-2.5 rounded-full
        bg-white/10 backdrop-blur border border-white/20 
        hover:bg-white/20 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-white/50
        text-white dark:text-gray-200"
    >
      {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
};

// ── Left Branding Panel ──────────────────────────────────────────────────────
const BrandingPanel = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900" />

    {/* Radial glows */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, #6366f1 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #7c3aed 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, #4f46e5 0%, transparent 70%)`,
      }}
    />

    {/* Grid overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }}
    />

    {/* Decorative floating rings */}
    <div className="absolute top-16 right-16 w-64 h-64 rounded-full border border-white/10 auth-float-slow" />
    <div className="absolute bottom-20 left-12 w-48 h-48 rounded-full border border-white/10 auth-float" />
    <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full border border-indigo-400/30 auth-float-slow" style={{ animationDelay: '1s' }} />

    {/* Floating stat cards */}
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-24 left-10 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
    >
      <div className="w-9 h-9 rounded-full bg-emerald-400/20 flex items-center justify-center">
        <FiUsers size={18} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Volunteers Active</p>
        <p className="text-white font-bold text-lg leading-none">1,248</p>
      </div>
    </motion.div>

    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute bottom-28 right-10 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
    >
      <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center">
        <FiAlertTriangle size={18} className="text-amber-400" />
      </div>
      <div>
        <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Active Alerts</p>
        <p className="text-white font-bold text-lg leading-none">3 Critical</p>
      </div>
    </motion.div>

    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      className="absolute top-1/2 left-8 -translate-y-1/2 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl"
    >
      <div className="w-9 h-9 rounded-full bg-blue-400/20 flex items-center justify-center">
        <FiZap size={18} className="text-blue-400" />
      </div>
      <div>
        <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">Response Time</p>
        <p className="text-white font-bold text-lg leading-none">24 min avg</p>
      </div>
    </motion.div>

    {/* Main brand content */}
    <div className="relative z-10 text-center px-12 flex flex-col items-center gap-6">
      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-20 h-20 rounded-3xl bg-white/15 border border-white/25 flex items-center justify-center shadow-2xl auth-pulse"
      >
        <FiShield size={38} className="text-white" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tight leading-none">
          ResQ<span className="text-indigo-300">Link</span>
        </h1>
        <p className="text-xl font-semibold text-white/80 tracking-wide">Admin Panel</p>
        <div className="w-16 h-1 bg-indigo-400 rounded-full mx-auto mt-1" />
        <p className="text-white/60 text-base max-w-xs leading-relaxed mt-2">
          Manage disasters. Coordinate rescue teams. Save lives.
        </p>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 mt-4"
      >
        {['Real-time Alerts', 'AI Analysis', 'Resource Tracking', 'Volunteer Mgmt'].map(tag => (
          <span key={tag} className="glass-card text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  </div>
);

// ── Admin Login Page ─────────────────────────────────────────────────────────
const AdminLogin = () => {
  return (
    <div className="relative">
      <ThemeToggle />
      <AuthLayout leftPanel={<BrandingPanel />}>
        {/* Right-side login card */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-8">
            {/* Mobile-only logo */}
            <div className="flex items-center gap-2.5 mb-4 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <FiShield size={18} className="text-white" />
              </div>
              <span className="font-black text-xl text-gray-900 dark:text-white">
                ResQ<span className="text-indigo-600">Link</span>
              </span>
            </div>

            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Sign in to access the ResQLink admin dashboard.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          © {new Date().getFullYear()} ResQLink Disaster Management System
        </p>
      </AuthLayout>
    </div>
  );
};

export default AdminLogin;
