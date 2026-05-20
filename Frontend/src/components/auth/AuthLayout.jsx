import React from 'react';

/**
 * AuthLayout
 * Fullscreen split-screen wrapper.
 * - leftPanel : branding / image content
 * - children  : login form content
 */
const AuthLayout = ({ leftPanel, children }) => {
  return (
    <div className="min-h-screen flex bg-[#F4F7FB] dark:bg-[#0F172A] transition-colors duration-300">
      {/* ── Left Panel (hidden on mobile) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        {leftPanel}
      </div>

      {/* ── Right Panel — Login Form ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md auth-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
