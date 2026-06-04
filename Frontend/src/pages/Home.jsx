import React, { useState } from "react";
import { MapPin, Brain, Users, Bell, Clock, Activity, UserCheck, Shield, Menu, X } from "lucide-react";
import logo from "../assets/Logo & Name Side-cropped.svg";

/* ─────────────────────────────── data ─────────────────────────────── */
const incidents = [
  { label: "Flood Alert - Downtown",     severity: "High",   dotCls: "bg-red-500",    badgeCls: "bg-red-100 text-red-600",    time: "12 min ago"  },
  { label: "Fire - Industrial Area",     severity: "Medium", dotCls: "bg-amber-400",  badgeCls: "bg-amber-100 text-amber-600", time: "28 min ago" },
  { label: "Medical Emergency - Suburb", severity: "Low",    dotCls: "bg-green-500",  badgeCls: "bg-green-100 text-green-600", time: "1 hr ago"   },
];
const features = [
  { icon: MapPin,     title: "Real-Time Disaster Reporting",            desc: "Citizens report incidents with location, description, and media." },
  { icon: Brain,      title: "AI-Assisted Severity Analysis",           desc: "Intelligent assessment of risk and impact." },
  { icon: Users,      title: "Smart Resource & Volunteer Coordination", desc: "Efficient assignment and tracking during emergencies." },
  { icon: Bell,       title: "Reliable Alerts & Monitoring",            desc: "Clear alerts and updates delivered to the right roles." },
];
const steps = [
  { icon: Clock,       label: "1. Disaster Reported",     desc: "Citizens submit incident details with location and media" },
  { icon: Brain,       label: "2. Severity Analyzed",     desc: "AI assesses impact and prioritizes response" },
  { icon: UserCheck,   label: "3. Resources Assigned",    desc: "Volunteers and resources are coordinated" },
  { icon: Activity,    label: "4. Continuous Monitoring", desc: "Real-time tracking and updates until resolution" },
];
const roles = [
  { icon: Users,     title: "Citizen",        color: "#0d9488", items: ["Report disasters", "View alerts", "Submit feedback"] },
  { icon: UserCheck, title: "Volunteer",      color: "#15803d", items: ["Manage availability", "Receive assignments", "Complete response tasks"] },
  { icon: Shield,    title: "Administrator",  color: "#1e3a8a", items: ["Review reports", "Allocate resources", "Monitor system status"] },
];

/* ─────────────────────────────── component ─────────────────────────── */
export default function Home({ onLogin, onRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#fff", fontFamily: "'Inter',sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src={logo} alt="ResQLink" style={{ height: 38, width: "auto" }} />

          {/* desktop links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            <a href="#features" style={S.navLink}>Features</a>
            <a href="#how"      style={S.navLink}>How It Works</a>
            <a href="#roles"    style={S.navLink}>Roles</a>
            <button onClick={onLogin} style={S.navBtn}>Login</button>
          </div>

          {/* mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} color="#475569" /> : <Menu size={22} color="#475569" />}
          </button>
        </div>

        {/* mobile dropdown */}
        {menuOpen && (
          <div style={{ backgroundColor: "#fff", borderTop: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }} className="mobile-menu">
            <a href="#features" style={S.navLink} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how"      style={S.navLink} onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#roles"    style={S.navLink} onClick={() => setMenuOpen(false)}>Roles</a>
            <button onClick={() => { setMenuOpen(false); onLogin(); }} style={{ ...S.navBtn, width: "100%" }}>Login</button>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ width: "100%", backgroundColor: "#fff", padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
          {/* left */}
          <div style={{ flex: "1 1 340px", minWidth: 280 }}>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, lineHeight: 1.2, color: "#0f172a", marginBottom: 20 }}>
              ResQLink – Intelligent Disaster Response, When Every Second Matters
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.75, marginBottom: 32, maxWidth: 500 }}>
              ResQLink is a role-based disaster response platform that enables citizens, volunteers,
              and authorities to report incidents, analyze severity, coordinate resources, and respond
              efficiently in real time.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <button style={S.heroBtnPrimary}>Report a Disaster</button>
              <button style={S.heroBtnOutline} onClick={onRegister}>Join as Volunteer</button>
            </div>
          </div>

          {/* right — incident card */}
          <div style={{ flex: "1 1 300px", minWidth: 280, maxWidth: 440 }}>
            <div style={{ backgroundColor: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.10)", border: "1px solid #f1f5f9", padding: 24 }}>
              {/* stats */}
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                {[{ l: "Active Incidents", v: "24", c: "#0f172a" }, { l: "Volunteers", v: "156", c: "#0f172a" }, { l: "Resolved", v: "89%", c: "#16a34a" }].map(s => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {/* incidents */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {incidents.map(inc => (
                  <div key={inc.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0 }} className={inc.dotCls} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{inc.label}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{inc.severity} severity • {inc.time}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }} className={inc.badgeCls}>{inc.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ width: "100%", backgroundColor: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={S.sectionH2}>Platform Features</h2>
          <p style={S.sectionSub}>Comprehensive tools for efficient emergency response</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                  <div style={{ width: 48, height: 48, backgroundColor: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={22} color="#1e3a8a" />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how" style={{ width: "100%", backgroundColor: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={S.sectionH2}>How It Works</h2>
          <p style={S.sectionSub}>A streamlined response workflow from incident to resolution</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36 }}>
            {steps.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
                  <div style={{ width: 64, height: 64, backgroundColor: "#1e3a8a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(30,58,138,0.3)" }}>
                    <Icon size={26} color="#fff" />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{s.label}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ ROLES ══ */}
      <section id="roles" style={{ width: "100%", backgroundColor: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={S.sectionH2}>Role-Based Access</h2>
          <p style={S.sectionSub}>Tailored experiences for every user type</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {roles.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.title} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "28px 24px", border: `1.5px solid ${r.color}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <Icon size={20} color={r.color} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{r.title}</h3>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {r.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#475569", fontWeight: 500 }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="9" fill={r.color} opacity="0.12" />
                          <path d="M5.5 9l2.5 2.5 4.5-5" stroke={r.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ width: "100%", backgroundColor: "#1e3a8a", padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>Start Using ResQLink Today</h2>
          <p style={{ fontSize: 15, color: "#bfdbfe", marginBottom: 36, lineHeight: 1.7 }}>
            Join the platform that connects communities and saves lives during emergencies
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onLogin}    style={S.ctaBtn}>Login</button>
            <button onClick={onRegister} style={S.ctaBtn}>Register</button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ width: "100%", backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", padding: "36px 24px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div>
              <img src={logo} alt="ResQLink" style={{ height: 34, width: "auto", marginBottom: 8 }} />
              <p style={{ fontSize: 13, color: "#94a3b8" }}>A unified disaster response and coordination platform</p>
            </div>
            <div style={{ display: "flex", gap: 28 }}>
              <a href="#" style={{ fontSize: 14, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Privacy</a>
              <a href="#" style={{ fontSize: 14, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Terms</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
            © 2026 ResQLink. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ══ RESPONSIVE STYLES ══ */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        .mobile-menu { display: none !important; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 768px) {
          .mobile-menu { display: ${menuOpen ? "flex" : "none"} !important; }
        }
      `}</style>

    </div>
  );
}

/* ─────────────── style constants ─────────────── */
const S = {
  navLink:        { fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" },
  navBtn:         { backgroundColor: "#1e3a8a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  heroBtnPrimary: { backgroundColor: "#1e3a8a", color: "#fff", border: "none", borderRadius: 9, padding: "13px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  heroBtnOutline: { backgroundColor: "#fff", color: "#1e3a8a", border: "2px solid #1e3a8a", borderRadius: 9, padding: "13px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  sectionH2:      { fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, textAlign: "center", color: "#0f172a", marginBottom: 10 },
  sectionSub:     { fontSize: 15, color: "#64748b", textAlign: "center", marginBottom: 48 },
  ctaBtn:         { backgroundColor: "transparent", color: "#fff", border: "2px solid #fff", borderRadius: 9, padding: "13px 36px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};
