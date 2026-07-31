<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import logo from "../../assets/Logo & Name Side-cropped.svg";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function LoginPage({ onLoginSuccess, initialShowRegister = false, onGoHome }) {
  const { t } = useTranslation();
  const [showRegister,       setShowRegister]       = useState(initialShowRegister);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    setShowRegister(initialShowRegister);
  }, [initialShowRegister]);

  if (showRegister) {
    return (
      <RegisterPage
        onLoginSuccess={onLoginSuccess}
        onBackToLogin={() => setShowRegister(false)}
        onGoHome={onGoHome}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => setShowForgotPassword(false)}
        onRegister={() => { setShowForgotPassword(false); setShowRegister(true); }}
        onGoHome={onGoHome}
      />
    );
  }
=======
import { useState } from "react";
import axios from "axios";


export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
>>>>>>> kasuni-development

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
<<<<<<< HEAD
=======

>>>>>>> kasuni-development
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      onLoginSuccess(response.data);
    } catch (err) {
<<<<<<< HEAD
      setError(err.response?.data?.message || t("auth.invalidCredentials"));
=======
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials or server error");
>>>>>>> kasuni-development
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 transition-colors relative">
      {/* Top right theme & language controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeToggle size={18} />
        <LanguageSwitcher />
      </div>

      <div className="anim-scale-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-[460px] p-6 md:p-9 transition-colors">

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={logo}
            alt="ResQLink"
            onClick={onGoHome}
            className="h-11 w-auto cursor-pointer brightness-100 dark:brightness-110"
            title={t("common.backToHome")}
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{t("auth.welcomeBack")}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t("auth.signInSubtitle")}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold text-center">
=======
  const fillDemo = (role) => {
    const map = {
      citizen: "citizen@resqlink.com",
      volunteer: "volunteer@resqlink.com",
      admin: "admin@resqlink.com",
    };
    setEmail(map[role]);
    setPassword("demo123");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L6 12V24C6 33.4 14.1 42.2 24 44C33.9 42.2 42 33.4 42 24V12L24 4Z" fill="#15803d"/>
            <path d="M26 16H22V22H16V26H22V32H26V26H32V22H26V16Z" fill="white"/>
          </svg>
          <span style={styles.logoText}>ResQLink</span>
        </div>

        {/* Heading */}
        <div style={styles.headingBlock}>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.subheading}>Sign in to your account to continue</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-center font-medium">
>>>>>>> kasuni-development
            {error}
          </div>
        )}

        {/* Form */}
<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.email")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
=======
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
>>>>>>> kasuni-development
              required
            />
          </div>

<<<<<<< HEAD
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.password")}</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
=======
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: 40 }}
                onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "40px" })}
                onBlur={(e) => Object.assign(e.target.style, { ...styles.input, paddingRight: "40px" })}
>>>>>>> kasuni-development
                required
              />
              <button
                type="button"
<<<<<<< HEAD
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                tabIndex={-1}
              >
                {showPwd
                  ? <EyeOff size={16} />
                  : <Eye    size={16} />}
=======
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717182" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#717182" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
>>>>>>> kasuni-development
              </button>
            </div>
          </div>

          <button
            type="submit"
<<<<<<< HEAD
            disabled={loading}
            className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors mt-2"
          >
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>

        {/* Links */}
        <p className="text-xs md:text-sm text-center text-slate-500 dark:text-slate-400 mt-5">
          {t("auth.noAccount")}{" "}
          <button onClick={() => setShowRegister(true)} className="bg-transparent border-none cursor-pointer text-[#1e3a8a] dark:text-blue-400 font-bold hover:underline">
            {t("auth.registerHere")}
          </button>
        </p>
        <p className="text-center mt-2">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="bg-transparent border-none cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#1e3a8a] dark:hover:text-blue-400 transition-colors"
          >
            {t("auth.forgotPassword")}
          </button>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{t("auth.demoCredentials")}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> volunteer@resqlink.com</p>
          <p className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Password:</span> demo123</p>
          <button
            type="button"
            className="mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs cursor-pointer transition-colors"
            onClick={() => { setEmail("volunteer@resqlink.com"); setPassword("demo123"); }}
          >
            {t("auth.fillDemo")}
          </button>
        </div>

      </div>
=======
            style={{
              ...styles.signInBtn,
              ...(loading ? styles.signInBtnLoading : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.spinnerWrap}>
                <span style={styles.spinner} />
                Signing in…
              </span>
            ) : "Sign In"}
          </button>
        </form>

        {/* Register */}
        <p style={styles.registerLine}>
          <span style={styles.registerGray}>Don't have an account? </span>
          <a href="#register" style={styles.registerLink}>Register here</a>
        </p>

        {/* Forgot */}
        <div style={styles.forgotWrap}>
          <a href="#forgot" style={styles.forgot}>Forgot password?</a>
        </div>

        {/* Demo Credentials */}
        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>Demo Credentials:</p>
          <div style={styles.demoGrid}>
            {[
              { role: "citizen", label: "Citizen", email: "citizen@resqlink.com" },
              { role: "volunteer", label: "Volunteer", email: "volunteer@resqlink.com" },
              { role: "admin", label: "Admin", email: "admin@resqlink.com" },
            ].map(({ role, label, email: demoEmail }) => (
              <button
                key={role}
                type="button"
                onClick={() => fillDemo(role)}
                style={styles.demoRow}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span style={styles.demoLabel}>{label}:</span>
                <span style={styles.demoEmail}>{demoEmail}</span>
              </button>
            ))}
          </div>
          <p style={styles.demoMeta}>Password: demo123</p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
>>>>>>> kasuni-development
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
<<<<<<< HEAD
    padding: "40px 24px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    width: "100%",
    maxWidth: 460,
    padding: "40px 36px",
=======
    padding: "24px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    animation: "fadeIn 0.4s ease both",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 448,
    padding: "32px",
>>>>>>> kasuni-development
    boxSizing: "border-box",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
<<<<<<< HEAD
    marginBottom: 24,
=======
    marginBottom: 28,
  },
  logoImg: {
    height: 48,
    width: "auto",
    objectFit: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "-0.3px",
>>>>>>> kasuni-development
  },
  headingBlock: {
    textAlign: "center",
    marginBottom: 24,
  },
  heading: {
<<<<<<< HEAD
    fontSize: 22,
    fontWeight: 700,
=======
    fontSize: 20,
    fontWeight: 600,
>>>>>>> kasuni-development
    color: "#0f172a",
    margin: "0 0 6px",
  },
  subheading: {
    fontSize: 14,
<<<<<<< HEAD
    color: "#64748b",
    margin: 0,
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    textAlign: "center",
    marginBottom: 16,
  },
=======
    fontWeight: 400,
    color: "#64748b",
    margin: 0,
  },
>>>>>>> kasuni-development
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
<<<<<<< HEAD
    gap: 6,
=======
    gap: 4,
>>>>>>> kasuni-development
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
<<<<<<< HEAD
    color: "#0f172a",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#f1f5f9",
    border: "1.5px solid transparent",
    borderRadius: 10,
    padding: "0 14px",
=======
    color: "#0a0a0a",
    lineHeight: "14px",
  },
  input: {
    width: "100%",
    height: 36,
    backgroundColor: "#f3f3f5",
    border: "0.8px solid rgba(0,0,0,0)",
    borderRadius: 8,
    padding: "4px 12px",
>>>>>>> kasuni-development
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
<<<<<<< HEAD
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  },
  inputFocus: {
    width: "100%",
    height: 44,
    backgroundColor: "#f1f5f9",
    border: "1.5px solid #1e3a8a",
    borderRadius: 10,
    padding: "0 14px",
=======
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  },
  inputFocus: {
    width: "100%",
    height: 36,
    backgroundColor: "#f3f3f5",
    border: "0.8px solid #15803d",
    borderRadius: 8,
    padding: "4px 12px",
>>>>>>> kasuni-development
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
<<<<<<< HEAD
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    height: 46,
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
  },
  btnDisabled: {
    backgroundColor: "#3b5bdb",
    cursor: "not-allowed",
  },
  linkLine: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748b",
    margin: "14px 0 6px",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#1e3a8a",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
  },
  forgotLine: {
    textAlign: "center",
    margin: "0 0 20px",
  },
  demoBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "14px 16px",
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    margin: "0 0 6px",
  },
  demoRow: {
    fontSize: 13,
    color: "#64748b",
    margin: "2px 0",
  },
  demoLabel: {
    fontWeight: 600,
    color: "#475569",
  },
  fillBtn: {
    marginTop: 10,
    background: "none",
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    color: "#475569",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
=======
    boxShadow: "0 0 0 3px rgba(21,128,61,0.1)",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  signInBtn: {
    width: "100%",
    height: 36,
    backgroundColor: "#15803d",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 500,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.15s, transform 0.1s",
    fontFamily: "inherit",
  },
  signInBtnLoading: {
    backgroundColor: "#166534",
    cursor: "not-allowed",
  },
  spinnerWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  registerLine: {
    textAlign: "center",
    fontSize: 14,
    margin: "0 0 8px",
  },
  registerGray: {
    color: "#64748b",
    fontWeight: 400,
  },
  registerLink: {
    color: "#15803d",
    fontWeight: 600,
    textDecoration: "none",
  },
  forgotWrap: {
    textAlign: "center",
    marginBottom: 24,
  },
  forgot: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: 500,
    opacity: 0.5,
    textDecoration: "none",
  },
  demoBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: "16px 16px 14px",
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    margin: "0 0 8px",
    lineHeight: "16px",
  },
  demoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: 4,
  },
  demoRow: {
    display: "flex",
    gap: 4,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "2px 4px",
    borderRadius: 4,
    textAlign: "left",
    transition: "background-color 0.1s",
    fontFamily: "inherit",
  },
  demoLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    lineHeight: "16px",
    whiteSpace: "nowrap",
  },
  demoEmail: {
    fontSize: 12,
    fontWeight: 400,
    color: "#64748b",
    lineHeight: "16px",
  },
  demoMeta: {
    fontSize: 12,
    fontWeight: 400,
    color: "#64748b",
    margin: "4px 0 0 4px",
    lineHeight: "16px",
>>>>>>> kasuni-development
  },
};
