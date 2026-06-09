import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import logo from "../../assets/Logo & Name Side-cropped.svg";

export default function LoginPage({ onLoginSuccess, initialShowRegister = false, onGoHome }) {
  const { t } = useTranslation();
  const [showRegister,       setShowRegister]       = useState(initialShowRegister);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

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
    <div style={styles.page}>
      <div className="anim-scale-in" style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <img
            src={logo}
            alt="ResQLink"
            onClick={onGoHome}
            style={{ height: 44, width: "auto", cursor: onGoHome ? "pointer" : "default" }}
            title={t("common.backToHome")}
          />
        </div>

        {/* Heading */}
        <div style={styles.headingBlock}>
          <h2 style={styles.heading}>{t("auth.welcomeBack")}</h2>
          <p style={styles.subheading}>{t("auth.signInSubtitle")}</p>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("auth.email")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>{t("auth.password")}</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: 42 }}
                onFocus={(e) => Object.assign(e.target.style, { ...styles.inputFocus, paddingRight: "42px" })}
                onBlur={(e)  => Object.assign(e.target.style, { ...styles.input,      paddingRight: "42px" })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPwd
                  ? <EyeOff size={16} color="#94a3b8" />
                  : <Eye    size={16} color="#94a3b8" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-anim"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
          >
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>

        {/* Links */}
        <p style={styles.linkLine}>
          {t("auth.noAccount")}{" "}
          <button onClick={() => setShowRegister(true)} style={styles.linkBtn}>
            {t("auth.registerHere")}
          </button>
        </p>
        <p style={styles.forgotLine}>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#64748b", fontFamily:"inherit", fontWeight:500, padding:0, transition:"color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#1e3a8a"}
            onMouseLeave={e => e.target.style.color = "#64748b"}
          >
            {t("auth.forgotPassword")}
          </button>
        </p>

        {/* Demo Credentials */}
        <div style={styles.demoBox}>
          <p style={styles.demoTitle}>{t("auth.demoCredentials")}</p>
          <p style={styles.demoRow}><span style={styles.demoLabel}>Email:</span> volunteer@resqlink.com</p>
          <p style={styles.demoRow}><span style={styles.demoLabel}>Password:</span> demo123</p>
          <button
            type="button"
            style={styles.fillBtn}
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
