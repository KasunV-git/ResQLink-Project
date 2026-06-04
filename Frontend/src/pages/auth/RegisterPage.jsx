import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/Logo & Name Side-cropped.svg";

export default function RegisterPage({ onLoginSuccess, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Volunteer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/auth/register", { name, email, password, role });
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "Citizen", description: "Report disasters and receive alerts" },
    { value: "Volunteer", description: "Assist in disaster response efforts" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <img src={logo} alt="ResQLink" style={{ height: 44, width: "auto" }} />
        </div>

        {/* Heading */}
        <div style={styles.headingBlock}>
          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subheading}>Join ResQLink to help your community</p>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Full Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              required
            />
          </div>

          {/* Select Role */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Select Role</label>
            <div style={styles.roleGroup}>
              {roles.map((r) => (
                <label
                  key={r.value}
                  style={{
                    ...styles.roleOption,
                    ...(role === r.value ? styles.roleOptionSelected : {}),
                  }}
                  onClick={() => setRole(r.value)}
                >
                  <div style={styles.radioWrapper}>
                    <div style={{
                      ...styles.radioOuter,
                      ...(role === r.value ? styles.radioOuterSelected : {}),
                    }}>
                      {role === r.value && <div style={styles.radioInner} />}
                    </div>
                  </div>
                  <div style={styles.roleText}>
                    <span style={styles.roleName}>{r.value}</span>
                    <span style={styles.roleDesc}>{r.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Back to Login */}
        <p style={styles.linkLine}>
          Already have an account?{" "}
          <button onClick={onBackToLogin} style={styles.linkBtn}>
            Sign in here
          </button>
        </p>

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
    padding: "24px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: 420,
    padding: "36px 32px",
    boxSizing: "border-box",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e3a8a",
    letterSpacing: "-0.3px",
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
  roleGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  roleOption: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "12px 14px",
    cursor: "pointer",
    transition: "border-color 0.15s, background-color 0.15s",
    backgroundColor: "#ffffff",
  },
  roleOptionSelected: {
    border: "1.5px solid #1e3a8a",
    backgroundColor: "#eff6ff",
  },
  radioWrapper: {
    flexShrink: 0,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.15s",
  },
  radioOuterSelected: {
    border: "2px solid #1e3a8a",
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    backgroundColor: "#1e3a8a",
  },
  roleText: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
  },
  roleDesc: {
    fontSize: 12,
    color: "#64748b",
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
    margin: "14px 0 0",
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
};
