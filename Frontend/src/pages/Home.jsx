import React, { useState, useEffect } from "react";
import { MapPin, Brain, Users, Bell, Clock, Activity, UserCheck, Shield, Menu, X } from "lucide-react";
import logo from "../assets/Logo & Name Side-cropped.svg";

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
}

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

const incidents = [
  { label: "Flood Alert - Downtown",     severity: "High",   dot: "#ef4444", badge: { bg:"#fef2f2", color:"#dc2626" }, time: "12 min ago" },
  { label: "Fire - Industrial Area",     severity: "Medium", dot: "#f59e0b", badge: { bg:"#fffbeb", color:"#d97706" }, time: "28 min ago" },
  { label: "Medical Emergency - Suburb", severity: "Low",    dot: "#22c55e", badge: { bg:"#f0fdf4", color:"#16a34a" }, time: "1 hr ago"   },
];
const features = [
  { Icon: MapPin,     title: "Real-Time Disaster Reporting",            desc: "Citizens report incidents with location, description, and media."     },
  { Icon: Brain,      title: "AI-Assisted Severity Analysis",           desc: "Intelligent assessment of risk and impact."                           },
  { Icon: Users,      title: "Smart Resource & Volunteer Coordination", desc: "Efficient assignment and tracking during emergencies."                 },
  { Icon: Bell,       title: "Reliable Alerts & Monitoring",            desc: "Clear alerts and updates delivered to the right roles."               },
];
const steps = [
  { Icon: Clock,     label: "1. Disaster Reported",     desc: "Citizens submit incident details with location and media" },
  { Icon: Brain,     label: "2. Severity Analyzed",     desc: "AI assesses impact and prioritizes response"             },
  { Icon: UserCheck, label: "3. Resources Assigned",    desc: "Volunteers and resources are coordinated"                },
  { Icon: Activity,  label: "4. Continuous Monitoring", desc: "Real-time tracking and updates until resolution"         },
];
const roles = [
  { Icon: Users,     title: "Citizen",       color: "#0d9488", items: ["Report disasters","View alerts","Submit feedback"]                    },
  { Icon: UserCheck, title: "Volunteer",     color: "#15803d", items: ["Manage availability","Receive assignments","Complete response tasks"]  },
  { Icon: Shield,    title: "Administrator", color: "#1e3a8a", items: ["Review reports","Allocate resources","Monitor system status"]          },
];

export default function Home({ onLogin, onRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  return (
    <div className="w-full min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="anim-fade-in-down sticky top-0 z-50 bg-white border-b border-slate-200"
        style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <img src={logo} alt="ResQLink" className="h-9 w-auto flex-shrink-0" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[["features","Features"],["how","How It Works"],["roles","Roles"]].map(([id, label]) => (
              <a key={id} href={`#${id}`}
                onClick={e => { e.preventDefault(); smoothScrollTo(id); }}
                className="text-sm font-medium text-slate-500 hover:text-[#1e3a8a] transition-colors no-underline">
                {label}
              </a>
            ))}
            <button onClick={onLogin} className="btn-anim bg-[#1e3a8a] text-white border-none rounded-lg px-5 py-2.5 text-sm font-semibold cursor-pointer">
              Login
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-md text-slate-500">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden anim-fade-in-down bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-3">
            {[["features","Features"],["how","How It Works"],["roles","Roles"]].map(([id, label]) => (
              <a key={id} href={`#${id}`}
                onClick={e => { e.preventDefault(); setMenuOpen(false); setTimeout(() => smoothScrollTo(id), 50); }}
                className="text-[15px] font-medium text-slate-500 no-underline py-1">
                {label}
              </a>
            ))}
            <button onClick={() => { setMenuOpen(false); onLogin(); }}
              className="btn-anim bg-[#1e3a8a] text-white border-none rounded-lg py-3 text-sm font-semibold cursor-pointer mt-1">
              Login
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="w-full bg-white py-12 md:py-16 lg:py-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

          {/* Left — text */}
          <div className="anim-fade-in-left w-full lg:flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 mb-4 md:mb-5">
              ResQLink – Intelligent Disaster Response, When Every Second Matters
            </h1>
            <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-7 md:mb-8">
              ResQLink is a role-based disaster response platform that enables citizens, volunteers,
              and authorities to report incidents, analyze severity, coordinate resources, and respond efficiently in real time.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <button className="btn-anim bg-[#1e3a8a] text-white border-none rounded-[9px] px-6 py-3 text-[15px] font-semibold cursor-pointer">
                Report a Disaster
              </button>
              <button className="btn-anim bg-white text-[#1e3a8a] border-2 border-[#1e3a8a] rounded-[9px] px-6 py-3 text-[15px] font-semibold cursor-pointer"
                onClick={onRegister}>
                Join as Volunteer
              </button>
            </div>
          </div>

          {/* Right — live stats card */}
          <div className="anim-fade-in-right w-full lg:flex-1 lg:max-w-[440px]">
            <div className="hover-card bg-white rounded-2xl border border-slate-100 p-5 md:p-6"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>
              {/* Stats row */}
              <div className="flex justify-between pb-4 mb-4 border-b border-slate-100">
                {[
                  { l:"Active Incidents", v:"24",  c:"text-slate-900"   },
                  { l:"Volunteers",       v:"156", c:"text-slate-900"   },
                  { l:"Resolved",         v:"89%", c:"text-emerald-600" },
                ].map(s => (
                  <div key={s.l} className="text-center">
                    <div className={`text-2xl md:text-[26px] font-bold ${s.c}`}>{s.v}</div>
                    <div className="text-[11px] md:text-xs text-slate-400 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              {/* Incident rows */}
              <div className="flex flex-col gap-2.5">
                {incidents.map(inc => (
                  <div key={inc.label}
                    className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-[10px] px-3 py-2.5 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: inc.dot }} />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 truncate">{inc.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{inc.severity} severity • {inc.time}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ml-2"
                      style={{ backgroundColor: inc.badge.bg, color: inc.badge.color }}>
                      {inc.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="w-full bg-slate-50 py-12 md:py-16 lg:py-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="reveal text-2xl md:text-3xl font-bold text-center text-slate-900 mb-3">Platform Features</h2>
          <p className="reveal text-base md:text-[17px] text-slate-500 text-center mb-10 md:mb-12">
            Comprehensive tools for efficient emergency response
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map(({ Icon, title, desc }, i) => (
              <div key={title} className={`reveal hover-card d-${(i+1)*100} bg-white rounded-[14px] p-6 md:p-7 border border-slate-100`}
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} color="#1e3a8a" />
                </div>
                <h3 className="text-[15px] md:text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm md:text-[14px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="w-full bg-white py-12 md:py-16 lg:py-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="reveal text-2xl md:text-3xl font-bold text-center text-slate-900 mb-3">How It Works</h2>
          <p className="reveal text-base md:text-[17px] text-slate-500 text-center mb-10 md:mb-12">
            A streamlined response workflow from incident to resolution
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {steps.map(({ Icon, label, desc }, i) => (
              <div key={label} className={`reveal d-${(i+1)*100} flex flex-col items-center text-center gap-4`}>
                <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center cursor-default transition-all duration-200 hover:scale-110"
                  style={{ boxShadow: "0 4px 18px rgba(30,58,138,0.3)" }}>
                  <Icon size={26} color="#fff" />
                </div>
                <h3 className="text-[15px] md:text-base font-bold text-slate-900">{label}</h3>
                <p className="text-sm md:text-[14px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" className="w-full bg-slate-50 py-12 md:py-16 lg:py-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="reveal text-2xl md:text-3xl font-bold text-center text-slate-900 mb-3">Role-Based Access</h2>
          <p className="reveal text-base md:text-[17px] text-slate-500 text-center mb-10 md:mb-12">
            Tailored experiences for every user type
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {roles.map(({ Icon, title, color, items }, i) => (
              <div key={title} className={`reveal hover-card d-${(i+1)*100} bg-white rounded-[14px] p-6 md:p-7`}
                style={{ border: `1.5px solid ${color}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-2.5 mb-5">
                  <Icon size={20} color={color} />
                  <h3 className="text-base font-bold text-slate-900">{title}</h3>
                </div>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-[15px] text-slate-600 font-medium">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
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
      <section className="w-full bg-[#1e3a8a] py-12 md:py-16 lg:py-20 px-4 md:px-6">
        <div className="reveal max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Start Using ResQLink Today
          </h2>
          <p className="text-[15px] md:text-base text-blue-200 mb-8 md:mb-10 leading-relaxed">
            Join the platform that connects communities and saves lives during emergencies
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button onClick={onLogin}
              className="btn-anim bg-transparent text-white border-2 border-white rounded-[9px] px-8 py-3 text-[15px] font-semibold cursor-pointer">
              Login
            </button>
            <button onClick={onRegister}
              className="btn-anim bg-transparent text-white border-2 border-white rounded-[9px] px-8 py-3 text-[15px] font-semibold cursor-pointer">
              Register
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-white border-t border-slate-200 px-4 md:px-6 pt-8 pb-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-5 mb-5">
            <div>
              <img src={logo} alt="ResQLink" className="h-8 w-auto mb-2" />
              <p className="text-[13px] text-slate-400 m-0">A unified disaster response and coordination platform</p>
            </div>
            <div className="flex gap-6 md:gap-7">
              {["Privacy", "Terms"].map(t => (
                <a key={t} href="#"
                  className="text-sm text-slate-500 no-underline font-medium hover:text-[#1e3a8a] transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 text-center text-[13px] text-slate-400">
            © 2026 ResQLink. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
