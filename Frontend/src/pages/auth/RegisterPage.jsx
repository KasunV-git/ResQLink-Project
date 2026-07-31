import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo & Name Side-cropped.svg";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function RegisterPage({ onLoginSuccess, onBackToLogin, onGoHome }) {
  const { t } = useTranslation();
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd,         setShowPwd]         = useState(false);
  const [role,            setRole]            = useState("Volunteer");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError(t("auth.validationNameRequired") || "First and last name are required.");
      return;
    }
    if (password.length < 6) {
      setError(t("auth.validationPasswordLength") || "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/auth/signup", {
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        role,
      });
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      } else if (onBackToLogin) {
        onBackToLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || t("auth.registrationFailed") || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "Citizen",   labelKey: "auth.citizenRole",   fallbackLabel: "Citizen",   descKey: "auth.citizenDesc",   fallbackDesc: "Report disasters and request emergency relief" },
    { value: "Volunteer", labelKey: "auth.volunteerRole",  fallbackLabel: "Volunteer", descKey: "auth.volunteerDesc", fallbackDesc: "Accept deployment tasks and assist response teams" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 transition-colors relative">
      {/* Top right theme & language controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeToggle size={18} />
        <LanguageSwitcher />
      </div>

      <div className="anim-scale-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-[480px] p-6 md:p-9 transition-colors my-8">

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
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{t("auth.createAccount") || "Create Account"}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{t("auth.createSubtitle") || "Join ResQLink Disaster Management"}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.firstName") || "First Name"}</label>
              <input
                type="text"
                placeholder={t("auth.firstNamePlaceholder") || "First name"}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.lastName") || "Last Name"}</label>
              <input
                type="text"
                placeholder={t("auth.lastNamePlaceholder") || "Last name"}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.email") || "Email"}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder") || "Enter your email"}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.password") || "Password"}</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder={t("auth.passwordCreate") || "Create password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.mobileNumber") || "Phone Number"}</label>
            <input
              type="tel"
              placeholder="e.g. +94 77 123 4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#1e3a8a] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />
          </div>

          {/* Select Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.selectRole") || "Select Account Type"}</label>
            <div className="flex flex-col gap-2.5">
              {roles.map(r => (
                <label
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-3.5 border rounded-xl p-3 cursor-pointer transition-all ${
                    role === r.value
                      ? "border-[#1e3a8a] dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      role === r.value ? "border-[#1e3a8a] dark:border-blue-400" : "border-slate-300 dark:border-slate-600"
                    }`}>
                      {role === r.value && <div className="w-2 h-2 rounded-full bg-[#1e3a8a] dark:bg-blue-400" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{t(r.labelKey) || r.fallbackLabel}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{t(r.descKey) || r.fallbackDesc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors mt-2"
          >
            {loading ? (t("auth.creatingAccount") || "Creating Account...") : (t("auth.createAccount") || "Create Account")}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-xs md:text-sm text-center text-slate-500 dark:text-slate-400 mt-5">
          {t("auth.alreadyAccount") || "Already have an account?"}{" "}
          <button onClick={onBackToLogin} className="bg-transparent border-none cursor-pointer text-[#1e3a8a] dark:text-blue-400 font-bold hover:underline">
            {t("auth.signInHere") || "Sign in here"}
          </button>
        </p>

      </div>
    </div>
  );
}
