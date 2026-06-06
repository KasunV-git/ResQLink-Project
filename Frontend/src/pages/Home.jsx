import React, { useState, useEffect } from "react";
import { MapPin, Brain, Users, Bell, Clock, Activity, UserCheck, Shield, Menu, X } from "lucide-react";
import logo from "../assets/Logo & Name Side-cropped.svg";

/* ── smooth scroll with navbar offset ── */
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 72; // navbar height
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ── scroll reveal ── */
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── data ── */
const incidents = [
  { label: "Flood Alert - Downtown",     severity: "High",   dot: "#ef4444", badge: { bg:"#fef2f2", color:"#dc2626" }, time: "12 min ago" },
  { label: "Fire - Industrial Area",     severity: "Medium", dot: "#f59e0b", badge: { bg:"#fffbeb", color:"#d97706" }, time: "28 min ago" },
  { label: "Medical Emergency - Suburb", severity: "Low",    dot: "#22c55e", badge: { bg:"#f0fdf4", color:"#16a34a" }, time: "1 hr ago"   },
];
const features = [
  { Icon: MapPin,     title: "Real-Time Disaster Reporting",            desc: "Citizens report incidents with location, description, and media."         },
  { Icon: Brain,      title: "AI-Assisted Severity Analysis",           desc: "Intelligent assessment of risk and impact."                               },
  { Icon: Users,      title: "Smart Resource & Volunteer Coordination", desc: "Efficient assignment and tracking during emergencies."                     },
  { Icon: Bell,       title: "Reliable Alerts & Monitoring",            desc: "Clear alerts and updates delivered to the right roles."                   },
];
const steps = [
  { Icon: Clock,     label: "1. Disaster Reported",     desc: "Citizens submit incident details with location and media" },
  { Icon: Brain,     label: "2. Severity Analyzed",     desc: "AI assesses impact and prioritizes response"             },
  { Icon: UserCheck, label: "3. Resources Assigned",    desc: "Volunteers and resources are coordinated"                },
  { Icon: Activity,  label: "4. Continuous Monitoring", desc: "Real-time tracking and updates until resolution"         },
];
const roles = [
  { Icon: Users,     title: "Citizen",       color: "#0d9488", items: ["Report disasters","View alerts","Submit feedback"]                       },
  { Icon: UserCheck, title: "Volunteer",     color: "#15803d", items: ["Manage availability","Receive assignments","Complete response tasks"]     },
  { Icon: Shield,    title: "Administrator", color: "#1e3a8a", items: ["Review reports","Allocate resources","Monitor system status"]             },
];

/* ══════════════════ COMPONENT ══════════════════ */
export default function Home({ onLogin, onRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  return (
    <div style={{ width:"100%", minHeight:"100vh", backgroundColor:"#fff", fontFamily:"'Inter',sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="anim-fade-in-down" style={{ position:"sticky", top:0, zIndex:50, backgroundColor:"#fff", borderBottom:"1px solid #e2e8f0", boxShadow:"0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <img src={logo} alt="ResQLink" style={{ height:38, width:"auto" }} />
          <div className="desktop-nav" style={{ display:"flex", gap:32, alignItems:"center" }}>
            {[["features","Features"],["how","How It Works"],["roles","Roles"]].map(([id,label]) => (
              <a key={id} href={`#${id}`}
                onClick={e => { e.preventDefault(); smoothScrollTo(id); }}
                style={{ fontSize:14, fontWeight:500, color:"#475569", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="#1e3a8a"} onMouseLeave={e=>e.target.style.color="#475569"}>
                {label}
              </a>
            ))}
            <button onClick={onLogin} className="btn-anim"
              style={{ backgroundColor:"#1e3a8a", color:"#fff", border:"none", borderRadius:8, padding:"9px 22px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Login
            </button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
            style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"none" }}>
            {menuOpen ? <X size={22} color="#475569" /> : <Menu size={22} color="#475569" />}
          </button>
        </div>
        {menuOpen && (
          <div className="anim-fade-in-down" style={{ backgroundColor:"#fff", borderTop:"1px solid #f1f5f9", padding:"16px 24px", display:"flex", flexDirection:"column", gap:14 }}>
            {[["features","Features"],["how","How It Works"],["roles","Roles"]].map(([id,label]) => (
              <a key={id} href={`#${id}`}
                onClick={e => { e.preventDefault(); setMenuOpen(false); setTimeout(()=>smoothScrollTo(id), 50); }}
                style={{ fontSize:15, fontWeight:500, color:"#475569", textDecoration:"none" }}>{label}</a>
            ))}
            <button onClick={()=>{setMenuOpen(false);onLogin();}} className="btn-anim"
              style={{ backgroundColor:"#1e3a8a", color:"#fff", border:"none", borderRadius:8, padding:"11px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Login
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ width:"100%", backgroundColor:"#fff", padding:"64px 24px 80px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", gap:48, alignItems:"center" }}>
          <div className="anim-fade-in-left" style={{ flex:"1 1 340px", minWidth:280 }}>
            <h1 style={{ fontSize:"clamp(28px,4vw,46px)", fontWeight:800, lineHeight:1.2, color:"#0f172a", marginBottom:20 }}>
              ResQLink – Intelligent Disaster Response,<br/>When Every Second Matters
            </h1>
            <p style={{ fontSize:17, color:"#64748b", lineHeight:1.8, marginBottom:32 }}>
              ResQLink is a role-based disaster response platform that enables citizens, volunteers,
              and authorities to report incidents, analyze severity, coordinate resources, and respond efficiently in real time.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:14 }}>
              <button className="btn-anim" style={S.heroPrimary}>Report a Disaster</button>
              <button className="btn-anim" onClick={onRegister} style={S.heroOutline}>Join as Volunteer</button>
            </div>
          </div>
          <div className="anim-fade-in-right" style={{ flex:"1 1 300px", minWidth:280, maxWidth:440 }}>
            <div className="hover-card" style={{ backgroundColor:"#fff", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #f1f5f9", padding:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", paddingBottom:16, marginBottom:16, borderBottom:"1px solid #f1f5f9" }}>
                {[{l:"Active Incidents",v:"24",c:"#0f172a"},{l:"Volunteers",v:"156",c:"#0f172a"},{l:"Resolved",v:"89%",c:"#16a34a"}].map(s=>(
                  <div key={s.l} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:26, fontWeight:700, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {incidents.map(inc=>(
                  <div key={inc.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", backgroundColor:"#f8fafc", borderRadius:10, padding:"10px 14px", transition:"background-color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.backgroundColor="#f1f5f9"} onMouseLeave={e=>e.currentTarget.style.backgroundColor="#f8fafc"}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:9, height:9, borderRadius:"50%", backgroundColor:inc.dot, flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{inc.label}</div>
                        <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{inc.severity} severity • {inc.time}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:20, backgroundColor:inc.badge.bg, color:inc.badge.color }}>{inc.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ width:"100%", backgroundColor:"#f8fafc", padding:"72px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h2 className="reveal" style={S.h2}>Platform Features</h2>
          <p className="reveal" style={{ ...S.sub, animationDelay:"0.1s" }}>Comprehensive tools for efficient emergency response</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:24 }}>
            {features.map(({Icon,title,desc},i)=>(
              <div key={title} className={`reveal hover-card d-${(i+1)*100}`}
                style={{ backgroundColor:"#fff", borderRadius:14, padding:"28px 24px", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1px solid #f1f5f9" }}>
                <div style={{ width:48, height:48, backgroundColor:"#eff6ff", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <Icon size={22} color="#1e3a8a" />
                </div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#0f172a", marginBottom:8 }}>{title}</h3>
                <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ width:"100%", backgroundColor:"#fff", padding:"72px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h2 className="reveal" style={S.h2}>How It Works</h2>
          <p className="reveal" style={S.sub}>A streamlined response workflow from incident to resolution</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:36 }}>
            {steps.map(({Icon,label,desc},i)=>(
              <div key={label} className={`reveal d-${(i+1)*100}`} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:16 }}>
                <div style={{ width:64, height:64, backgroundColor:"#1e3a8a", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 4px 18px rgba(30,58,138,0.3)", transition:"transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 8px 28px rgba(30,58,138,0.4)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 18px rgba(30,58,138,0.3)"}}>
                  <Icon size={26} color="#fff" />
                </div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>{label}</h3>
                <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" style={{ width:"100%", backgroundColor:"#f8fafc", padding:"72px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <h2 className="reveal" style={S.h2}>Role-Based Access</h2>
          <p className="reveal" style={S.sub}>Tailored experiences for every user type</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
            {roles.map(({Icon,title,color,items},i)=>(
              <div key={title} className={`reveal hover-card d-${(i+1)*100}`}
                style={{ backgroundColor:"#fff", borderRadius:14, padding:"28px 24px", border:`1.5px solid ${color}`, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                  <Icon size={20} color={color} />
                  <h3 style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>{title}</h3>
                </div>
                <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:12 }}>
                  {items.map(item=>(
                    <li key={item} style={{ display:"flex", alignItems:"center", gap:10, fontSize:15, color:"#475569", fontWeight:500 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="9" fill={color} opacity="0.12"/>
                        <path d="M5.5 9l2.5 2.5 4.5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ width:"100%", backgroundColor:"#1e3a8a", padding:"72px 24px" }}>
        <div className="reveal" style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(22px,3vw,32px)", fontWeight:700, color:"#fff", marginBottom:14 }}>Start Using ResQLink Today</h2>
          <p style={{ fontSize:15, color:"#bfdbfe", marginBottom:36, lineHeight:1.7 }}>
            Join the platform that connects communities and saves lives during emergencies
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={onLogin}    className="btn-anim" style={S.ctaBtn}>Login</button>
            <button onClick={onRegister} className="btn-anim" style={S.ctaBtn}>Register</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ width:"100%", backgroundColor:"#fff", borderTop:"1px solid #e2e8f0", padding:"36px 24px 20px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:20, marginBottom:24 }}>
            <div>
              <img src={logo} alt="ResQLink" style={{ height:34, width:"auto", marginBottom:8 }}/>
              <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>A unified disaster response and coordination platform</p>
            </div>
            <div style={{ display:"flex", gap:28 }}>
              {["Privacy","Terms"].map(t=>(
                <a key={t} href="#" style={{ fontSize:14, color:"#64748b", textDecoration:"none", fontWeight:500, transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="#1e3a8a"} onMouseLeave={e=>e.target.style.color="#64748b"}>{t}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid #f1f5f9", paddingTop:16, textAlign:"center", fontSize:13, color:"#94a3b8" }}>
            © 2026 ResQLink. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        .desktop-nav { display:flex !important; }
        .mobile-menu-btn { display:none !important; }
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-menu-btn { display:block !important; }
        }
      `}</style>
    </div>
  );
}

const S = {
  heroPrimary: { backgroundColor:"#1e3a8a", color:"#fff",       border:"none",               borderRadius:9, padding:"13px 26px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  heroOutline: { backgroundColor:"#fff",     color:"#1e3a8a",   border:"2px solid #1e3a8a",  borderRadius:9, padding:"13px 26px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  ctaBtn:      { backgroundColor:"transparent", color:"#fff",   border:"2px solid #fff",     borderRadius:9, padding:"13px 36px", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  h2:   { fontSize:"clamp(24px,3vw,32px)", fontWeight:700, textAlign:"center", color:"#0f172a", marginBottom:10 },
  sub:  { fontSize:16, color:"#64748b", textAlign:"center", marginBottom:48 },
};
