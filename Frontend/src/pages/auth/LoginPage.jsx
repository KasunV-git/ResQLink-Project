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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

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
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.email")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.password")}</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                tabIndex={-1}
              >
                {showPwd
                  ? <EyeOff size={16} />
                  : <Eye    size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
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
    boxSizing: "border-box",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  headingBlock: {
    textAlign: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px",
  },
  subheading: {
    fontSize: 14,
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#0f172a",
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#f1f5f9",
    border: "1.5px solid transparent",
    borderRadius: 10,
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
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
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
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
  },
};
