import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo & Name Side-cropped.svg";

export default function RegisterPage({ onLoginSuccess, onBackToLogin, onGoHome }) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [role,      setRole]      = useState("Volunteer");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError(t("auth.validationNameRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.validationPasswordLength"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("/api/auth/register", {
        firstName, lastName, email, phone, password, role,
      });
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "Citizen",   labelKey: "auth.citizenRole",   descKey: "auth.citizenDesc"   },
    { value: "Volunteer", labelKey: "auth.volunteerRole",  descKey: "auth.volunteerDesc" },
  ];

  const inputStyle   = S.input;
  const inputFocused = S.inputFocus;

  return (
    <div style={S.page}>
      <div className="anim-scale-in" style={S.card}>

        {/* Logo */}
        <div style={S.logoRow}>
          <img
            src={logo}
            alt="ResQLink"
            onClick={onGoHome}
            style={{ height: 44, width: "auto", cursor: onGoHome ? "pointer" : "default" }}
            title={t("common.backToHome")}
          />
        </div>

        {/* Heading */}
        <div style={S.headingBlock}>
          <h2 style={S.heading}>{t("auth.createAccount")}</h2>
          <p style={S.subheading}>{t("auth.createSubtitle")}</p>
        </div>

        {/* Error */}
        {error && <div style={S.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={S.form}>

          {/* First Name + Last Name — side by side */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <label style={S.label}>{t("auth.firstName")}</label>
              <input
                type="text"
                placeholder={t("auth.firstNamePlaceholder")}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocused)}
                onBlur={e  => Object.assign(e.target.style, inputStyle)}
                required
              />
            </div>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <label style={S.label}>{t("auth.lastName")}</label>
              <input
                type="text"
                placeholder={t("auth.lastNamePlaceholder")}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocused)}
                onBlur={e  => Object.assign(e.target.style, inputStyle)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div style={S.fieldGroup}>
            <label style={S.label}>{t("auth.email")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => Object.assign(e.target.style, inputFocused)}
              onBlur={e  => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          {/* Password with eye toggle */}
          <div style={S.fieldGroup}>
            <label style={S.label}>{t("auth.password")}</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                placeholder={t("auth.passwordCreate")}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 42 }}
                onFocus={e => Object.assign(e.target.style, { ...inputFocused, paddingRight: "42px" })}
                onBlur={e  => Object.assign(e.target.style, { ...inputStyle,   paddingRight: "42px" })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={S.eyeBtn}
                tabIndex={-1}
              >
                {showPwd
                  ? <EyeOff size={16} color="#94a3b8" />
                  : <Eye    size={16} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Mobile Number */}
          <div style={S.fieldGroup}>
            <label style={S.label}>{t("auth.mobileNumber")}</label>
            <input
              type="tel"
              placeholder="e.g. +94 77 123 4567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={inputStyle}
              onFocus={e => Object.assign(e.target.style, inputFocused)}
              onBlur={e  => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {/* Select Role */}
          <div style={S.fieldGroup}>
            <label style={S.label}>{t("auth.selectRole")}</label>
            <div style={S.roleGroup}>
              {roles.map(r => (
                <label
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{ ...S.roleOption, ...(role === r.value ? S.roleOptionSelected : {}) }}
                >
                  <div style={S.radioWrapper}>
                    <div style={{ ...S.radioOuter, ...(role === r.value ? S.radioOuterSelected : {}) }}>
                      {role === r.value && <div style={S.radioInner} />}
                    </div>
                  </div>
                  <div style={S.roleText}>
                    <span style={S.roleName}>{t(r.labelKey)}</span>
                    <span style={S.roleDesc}>{t(r.descKey)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-anim"
            style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
          >
            {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
          </button>
        </form>

        {/* Back to Login */}
        <p style={S.linkLine}>
          {t("auth.alreadyAccount")}{" "}
          <button onClick={onBackToLogin} style={S.linkBtn}>{t("auth.signInHere")}</button>
        </p>

      </div>
    </div>
  );
}

const S = {
  page:        { minHeight:"100vh", backgroundColor:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"'Inter',-apple-system,sans-serif" },
  card:        { backgroundColor:"#fff", borderRadius:16, boxShadow:"0 4px 32px rgba(0,0,0,0.10)", width:"100%", maxWidth:480, padding:"40px 36px", boxSizing:"border-box" },
  logoRow:     { display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 },
  headingBlock:{ textAlign:"center", marginBottom:24 },
  heading:     { fontSize:22, fontWeight:700, color:"#0f172a", margin:"0 0 6px" },
  subheading:  { fontSize:14, color:"#64748b", margin:0 },
  errorBox:    { backgroundColor:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", borderRadius:8, padding:"10px 14px", fontSize:13, fontWeight:500, textAlign:"center", marginBottom:16 },
  form:        { display:"flex", flexDirection:"column", gap:14, marginBottom:16 },
  fieldGroup:  { display:"flex", flexDirection:"column", gap:6 },
  label:       { fontSize:13, fontWeight:600, color:"#0f172a" },
  input:       { width:"100%", height:42, backgroundColor:"#f1f5f9", border:"1.5px solid transparent", borderRadius:10, padding:"0 12px", fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.15s" },
  inputFocus:  { width:"100%", height:42, backgroundColor:"#f1f5f9", border:"1.5px solid #1e3a8a", borderRadius:10, padding:"0 12px", fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  eyeBtn:      { position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", justifyContent:"center" },
  roleGroup:   { display:"flex", flexDirection:"column", gap:10 },
  roleOption:  { display:"flex", alignItems:"center", gap:14, border:"1.5px solid #e2e8f0", borderRadius:10, padding:"11px 14px", cursor:"pointer", transition:"border-color 0.15s,background-color 0.15s", backgroundColor:"#fff" },
  roleOptionSelected: { border:"1.5px solid #1e3a8a", backgroundColor:"#eff6ff" },
  radioWrapper:{ flexShrink:0 },
  radioOuter:  { width:18, height:18, borderRadius:"50%", border:"2px solid #cbd5e1", display:"flex", alignItems:"center", justifyContent:"center", transition:"border-color 0.15s" },
  radioOuterSelected: { border:"2px solid #1e3a8a" },
  radioInner:  { width:9, height:9, borderRadius:"50%", backgroundColor:"#1e3a8a" },
  roleText:    { display:"flex", flexDirection:"column", gap:2 },
  roleName:    { fontSize:14, fontWeight:600, color:"#0f172a" },
  roleDesc:    { fontSize:12, color:"#64748b" },
  btn:         { width:"100%", height:46, backgroundColor:"#1e3a8a", color:"#fff", fontSize:15, fontWeight:600, border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", marginTop:4 },
  btnDisabled: { backgroundColor:"#3b5bdb", cursor:"not-allowed" },
  linkLine:    { textAlign:"center", fontSize:14, color:"#64748b", margin:"14px 0 0" },
  linkBtn:     { background:"none", border:"none", color:"#1e3a8a", fontWeight:700, fontSize:14, cursor:"pointer", padding:0, fontFamily:"inherit" },
};
