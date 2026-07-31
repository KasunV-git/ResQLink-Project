import React, { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo & Name Side-cropped.svg";
import ThemeToggle from "../../components/ThemeToggle";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function ForgotPasswordPage({ onBackToLogin, onRegister, onGoHome }) {
  const { t } = useTranslation();
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmed)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    setLoading(true);
    setError("");

    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const tips = [
    t("auth.checkSpam"),
    t("auth.checkAddress"),
    t("auth.tryAgain"),
  ];

  /* ── SUCCESS STATE ── */
  if (submitted) {
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
            {t("auth.checkEmail")}
          </h2>

          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-7">
            {t("auth.resetSent")}{" "}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">{email.trim().toLowerCase()}</strong>
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 mb-7 text-left">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t("auth.didntReceive")}
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              {tips.map(tip => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={onBackToLogin}
            className="btn-anim w-full bg-[#1e3a8a] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl shadow-md cursor-pointer transition-colors"
          >
            {t("auth.backToLogin")}
          </button>

        </div>
      </div>
    );
  }

  /* ── FORM STATE ── */
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
          onClick={onBackToLogin}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#1e3a8a] dark:hover:text-blue-400 mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          {t("auth.backToLogin")}
        </button>

        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1.5">{t("auth.resetPassword")}</h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {t("auth.resetSubtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t("auth.emailAddress")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
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
                {t("auth.sending")}
              </span>
            ) : t("auth.sendReset")}
          </button>
        </form>

        <p className="text-xs md:text-sm text-center text-slate-500 dark:text-slate-400">
          {t("auth.noAccount")}{" "}
          <button
            onClick={onRegister}
            className="bg-transparent border-none cursor-pointer text-[#1e3a8a] dark:text-blue-400 font-bold hover:underline"
          >
            {t("auth.registerHere")}
          </button>
        </p>

      </div>
    </div>
  );
}
