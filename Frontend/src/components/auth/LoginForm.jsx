import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import LoginInput from './LoginInput';
import { simulateLogin, saveSession } from '../../services/authService';

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim())
      newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Enter a valid email address.';
    if (!formData.password)
      newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    setServerError('');
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    try {
      const { token, user } = await simulateLogin(formData);
      saveSession(token, user);
      navigate('/admin', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Server-side error banner */}
      {serverError && (
        <div
          role="alert"
          className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2"
        >
          <span className="text-base">⚠</span>
          {serverError}
        </div>
      )}

      <LoginInput
        id="email"
        label="Email Address"
        type="email"
        icon={FiMail}
        value={formData.email}
        onChange={handleChange('email')}
        placeholder="admin@resqlink.org"
        error={errors.email}
        required
        autoComplete="email"
      />

      <LoginInput
        id="password"
        label="Password"
        type="password"
        icon={FiLock}
        value={formData.password}
        onChange={handleChange('password')}
        placeholder="••••••••"
        error={errors.password}
        required
        autoComplete="current-password"
      />

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <div
            onClick={() => setRememberMe(prev => !prev)}
            role="checkbox"
            aria-checked={rememberMe}
            tabIndex={0}
            onKeyDown={(e) => e.key === ' ' && setRememberMe(prev => !prev)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              rememberMe
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
            }`}
          >
            {rememberMe && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
            Remember me
          </span>
        </label>

        <button
          type="button"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors focus:outline-none focus:underline"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="btn-login w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <>
            <FiLoader size={18} className="animate-spin" />
            Authenticating…
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Demo hint */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-1">
        Demo — <span className="font-mono">admin@resqlink.org</span> / <span className="font-mono">admin123</span>
      </p>
    </form>
  );
};

export default LoginForm;
