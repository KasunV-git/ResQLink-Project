import React from "react";
import { Bell, User, Menu } from "lucide-react";
import logo from "../assets/Logo & Name Side-cropped.svg";

export default function Header({ user, alertsCount, onTabChange, onMenuToggle }) {
  return (
    <header style={{
      width: "100%",
      height: 64,
      backgroundColor: "#fff",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      flexShrink: 0,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      zIndex: 10,
    }}>
      {/* Left: hamburger (mobile) + logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onMenuToggle}
          className="sidebar-toggle"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, display: "none" }}
        >
          <Menu size={20} color="#475569" />
        </button>
        <img
          src={logo}
          alt="ResQLink"
          style={{ height: 36, width: "auto", cursor: "pointer" }}
          onClick={() => onTabChange("dashboard")}
        />
      </div>

      {/* Right: bell + user */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Bell */}
        <button
          onClick={() => onTabChange("alerts")}
          style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%" }}
        >
          <Bell size={20} color="#64748b" />
          {alertsCount > 0 && (
            <span style={{
              position: "absolute", top: 2, right: 2,
              backgroundColor: "#dc2626", color: "#fff",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fff",
            }}>
              {alertsCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange("profile")}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "none", border: "1px solid #e2e8f0",
            borderRadius: 999, padding: "5px 14px 5px 6px",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            backgroundColor: "#15803d",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <User size={16} color="#fff" />
          </div>
          <span className="username-label" style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>
            {user?.name || "Volunteer"}
          </span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: block !important; }
          .username-label { display: none; }
        }
      `}</style>
    </header>
  );
}
