import React, { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo & Name Side-cropped.svg";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { forgotPassword, verifyResetCode, resetPassword } from "../../api/authApi";

export default function ForgotPasswordPage({ onBackToLogin, onRegister, onGoHome }) {
  const { t } = useTranslation();
  
  // Steps: 1 = Email, 2 = Code, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      setError(t("auth.invalidEmail") || "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email: trimmed });
      // We always proceed to step 2 to avoid leaking if email exists
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await verifyResetCode({ email: email.trim().toLowerCase(), code: code.trim() });
      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword({ resetToken, newPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── SUCCESS STATE (STEP 4) ── */
  if (step === 4) {
    return (
      <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 transition-colors relative">
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <ThemeToggle size={18} />
          <LanguageSwitcher />
        </div>
        <div className="anim-scale-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-[460px] p-6 md:p-9 text-center transition-colors">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Password Reset Successful
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-7">
            Your password has been successfully updated. You can now use your new password to log in.
          </p>
          <button
            onClick={onBackToLogin}
            className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            {t("auth.backToLogin") || "Back to Login"}
          </button>
        </div>
      </div>
    );
  }

  /* ── FORM STATES (STEPS 1, 2, 3) ── */
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 transition-colors relative">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeToggle size={18} />
        <LanguageSwitcher />
      </div>

      <div className="anim-scale-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-[460px] p-6 md:p-9 transition-colors">
        
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="ResQLink"
            onClick={onGoHome}
            className="h-11 w-auto cursor-pointer brightness-100 dark:brightness-110"
            title={t("common.backToHome")}
          />
        </div>

        <button
          onClick={() => step > 1 ? setStep(step - 1) : onBackToLogin()}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#1e3a8a] dark:hover:text-blue-400 mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          {step > 1 ? "Back" : (t("auth.backToLogin") || "Back to Login")}
        </button>

        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">
            {step === 1 ? (t("auth.resetPassword") || "Reset Password") : step === 2 ? "Verify Code" : "Set New Password"}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {step === 1 
              ? (t("auth.resetSubtitle") || "Enter your email address to receive a secure 6-digit reset code.") 
              : step === 2 
                ? `Enter the 6-digit code sent to ${email}`
                : "Create a new strong password for your account."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.emailAddress") || "Email Address"}</label>
              <input
                type="email"
                placeholder={t("auth.emailPlaceholder") || "you@example.com"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Sending...
                </span>
              ) : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">6-Digit Reset Code</label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-center tracking-[0.5em] text-lg font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Verifying...
                </span>
              ) : "Verify Code"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                placeholder="Must be at least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Saving...
                </span>
              ) : "Set New Password"}
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-xs md:text-sm text-center text-slate-500 dark:text-slate-400">
            {t("auth.noAccount") || "Don't have an account?"}{" "}
            <button
              onClick={onRegister}
              className="bg-transparent border-none cursor-pointer text-[#1e3a8a] dark:text-blue-400 font-bold hover:underline"
            >
              {t("auth.registerHere") || "Register here"}
            </button>
          </p>
        )}

      </div>
    </div>
  );
}
