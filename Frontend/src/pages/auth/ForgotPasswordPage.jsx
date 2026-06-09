import React, { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Logo & Name Side-cropped.svg";

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
      <div style={S.page}>
        <div className="anim-scale-in" style={{ ...S.card, textAlign:"center" }}>

          <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
            <div style={{
              width:80, height:80, borderRadius:"50%",
              backgroundColor:"#dcfce7",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 0 0 8px #f0fdf4",
            }}>
              <CheckCircle size={40} color="#15803d" strokeWidth={2} />
            </div>
          </div>

          <h2 style={{ fontSize:22, fontWeight:700, color:"#0f172a", margin:"0 0 10px" }}>
            {t("auth.checkEmail")}
          </h2>

          <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7, margin:"0 0 28px" }}>
            {t("auth.resetSent")}{" "}
            <strong style={{ color:"#0f172a" }}>{email.trim().toLowerCase()}</strong>
          </p>

          <div style={{
            backgroundColor:"#f8fafc", border:"1px solid #e2e8f0",
            borderRadius:10, padding:"16px 18px", marginBottom:28,
            textAlign:"left",
          }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#475569", margin:"0 0 10px" }}>
              {t("auth.didntReceive")}
            </p>
            <ul style={{ listStyle:"disc", paddingLeft:18, margin:0, display:"flex", flexDirection:"column", gap:8 }}>
              {tips.map(tip => (
                <li key={tip} style={{ fontSize:13, color:"#64748b" }}>{tip}</li>
              ))}
            </ul>
          </div>

          <button onClick={onBackToLogin} className="btn-anim" style={S.btn}>
            {t("auth.backToLogin")}
          </button>

        </div>
      </div>
    );
  }

  /* ── FORM STATE ── */
  return (
    <div style={S.page}>
      <div className="anim-scale-in" style={S.card}>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
          <img
            src={logo}
            alt="ResQLink"
            onClick={onGoHome}
            style={{ height:42, width:"auto", cursor: onGoHome ? "pointer" : "default" }}
            title={t("common.backToHome")}
          />
        </div>

        <button
          onClick={onBackToLogin}
          style={S.backBtn}
          onMouseEnter={e => e.currentTarget.style.color = "#1e3a8a"}
          onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
        >
          <ArrowLeft size={15} />
          {t("auth.backToLogin")}
        </button>

        <div style={{ marginBottom:24 }}>
          <h2 style={S.heading}>{t("auth.resetPassword")}</h2>
          <p style={{ fontSize:14, color:"#64748b", lineHeight:1.65, margin:0 }}>
            {t("auth.resetSubtitle")}
          </p>
        </div>

        {error && (
          <div style={S.errorBox}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:20 }}>
          <div style={S.fieldGroup}>
            <label style={S.label}>{t("auth.emailAddress")}</label>
            <input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={S.input}
              onFocus={e => Object.assign(e.target.style, S.inputFocus)}
              onBlur={e  => Object.assign(e.target.style, S.input)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-anim"
            style={{ ...S.btn, ...(loading ? S.btnLoading : {}) }}
          >
            {loading ? (
              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} />
                {t("auth.sending")}
              </span>
            ) : t("auth.sendReset")}
          </button>
        </form>

        <p style={{ textAlign:"center", fontSize:14, color:"#64748b", margin:0 }}>
          {t("auth.noAccount")}{" "}
          <button
            onClick={onRegister}
            style={{ background:"none", border:"none", color:"#1e3a8a", fontWeight:700, fontSize:14, cursor:"pointer", padding:0, fontFamily:"inherit" }}
          >
            {t("auth.registerHere")}
          </button>
        </p>

        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}

const S = {
  page:       { minHeight:"100vh", backgroundColor:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"'Inter',-apple-system,sans-serif" },
  card:       { backgroundColor:"#fff", borderRadius:16, boxShadow:"0 4px 32px rgba(0,0,0,0.10)", width:"100%", maxWidth:460, padding:"40px 36px", boxSizing:"border-box" },
  backBtn:    { display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:500, color:"#64748b", padding:0, fontFamily:"inherit", marginBottom:20, transition:"color 0.2s" },
  heading:    { fontSize:22, fontWeight:700, color:"#0f172a", margin:"0 0 8px" },
  errorBox:   { backgroundColor:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", borderRadius:8, padding:"10px 14px", fontSize:13, fontWeight:500, textAlign:"center", marginBottom:8 },
  fieldGroup: { display:"flex", flexDirection:"column", gap:6 },
  label:      { fontSize:13, fontWeight:600, color:"#0f172a" },
  input:      { width:"100%", height:44, backgroundColor:"#f1f5f9", border:"1.5px solid transparent", borderRadius:10, padding:"0 14px", fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.15s" },
  inputFocus: { width:"100%", height:44, backgroundColor:"#f1f5f9", border:"1.5px solid #1e3a8a", borderRadius:10, padding:"0 14px", fontSize:14, color:"#0f172a", outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  btn:        { width:"100%", height:46, backgroundColor:"#1e3a8a", color:"#fff", fontSize:15, fontWeight:600, border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit" },
  btnLoading: { backgroundColor:"#3b5bdb", cursor:"not-allowed" },
};
