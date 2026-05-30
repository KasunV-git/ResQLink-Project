import React, { useState } from "react";
import axios from "axios";

// Logo URL from original design
const logoUrl = "https://www.figma.com/api/mcp/asset/7608400e-4ebc-43d4-8301-b4d05fa0b059";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      onLoginSuccess(response.data);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

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
          <img src={logoUrl} alt="ResQLink Logo" style={styles.logoImg} />
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
            {error}
          </div>
        )}

        {/* Form */}
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
              required
            />
          </div>

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
                required
              />
              <button
                type="button"
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
              </button>
            </div>
          </div>

          <button
            type="submit"
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
          <p style={styles.demoMeta}>Password: any</p>
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
    boxSizing: "border-box",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
  },
  headingBlock: {
    textAlign: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 6px",
  },
  subheading: {
    fontSize: 14,
    fontWeight: 400,
    color: "#64748b",
    margin: 0,
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
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
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
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
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
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
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
  },
};
