import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import logo from "../../assets/Logo & Name Side-cropped.svg";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage({ onLoginSuccess, initialShowRegister = false, onGoHome }) {
  const { t } = useTranslation();
  const { login: authLogin } = useAuth();
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
        onLoginSuccess={(data) => {
          const userObj = data.user || data;
          authLogin(userObj);
          if (onLoginSuccess) onLoginSuccess(data);
        }}
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

  const fillDemo = (role) => {
    const map = {
      citizen: "citizen@resqlink.com",
      volunteer: "volunteer@resqlink.com",
      admin: "admin@resqlink.com",
    };
    setEmail(map[role] || "volunteer@resqlink.com");
    setPassword("demo123");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const data = response.data;
      const userObj = data.user || data;

      authLogin(userObj);

      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || t("auth.invalidCredentials") || "Invalid credentials. Please try again.");
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
            title={t("common.backToHome") || "Back to Home"}
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{t("auth.welcomeBack") || "Welcome Back"}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t("auth.signInSubtitle") || "Sign in to your account to continue"}</p>
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
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.email") || "Email"}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder") || "Enter your email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.password") || "Password"}</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder") || "Enter your password"}
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
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors mt-2"
          >
            {loading ? (t("auth.signingIn") || "Signing in…") : (t("auth.signIn") || "Sign In")}
          </button>
        </form>

        {/* Links */}
        <p className="text-xs md:text-sm text-center text-slate-500 dark:text-slate-400 mt-5">
          {t("auth.noAccount") || "Don't have an account?"}{" "}
          <button onClick={() => setShowRegister(true)} className="bg-transparent border-none cursor-pointer text-[#1e3a8a] dark:text-blue-400 font-bold hover:underline">
            {t("auth.registerHere") || "Register here"}
          </button>
        </p>
        <p className="text-center mt-2">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="bg-transparent border-none cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#1e3a8a] dark:hover:text-blue-400 transition-colors"
          >
            {t("auth.forgotPassword") || "Forgot password?"}
          </button>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{t("auth.demoCredentials") || "Demo Credentials:"}</p>
          <div className="flex flex-col gap-1.5">
            {[
              { role: "citizen", label: "Citizen", email: "citizen@resqlink.com" },
              { role: "volunteer", label: "Volunteer", email: "volunteer@resqlink.com" },
              { role: "admin", label: "Admin", email: "admin@resqlink.com" },
            ].map(({ role, label, email: demoEmail }) => (
              <button
                key={role}
                type="button"
                onClick={() => fillDemo(role)}
                className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300">{label}:</span>
                <span className="text-slate-500 dark:text-slate-400">{demoEmail}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Password: <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">demo123</span></p>
        </div>

      </div>
    </div>
  );
}
