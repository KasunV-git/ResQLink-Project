import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo & Name Side-cropped.svg";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const links = [
    t("footer.privacy"),
    t("footer.terms"),
    t("footer.support"),
  ];

  return (
    <footer className="app-footer" style={{
      width: "100%",
      backgroundColor: "#fff",
      borderTop: "1px solid #e2e8f0",
      flexShrink: 0,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        {/* Left — logo + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="ResQLink" style={{ height: 28, width: "auto" }} />
          <span style={{ fontSize: 13, color: "#94a3b8" }}>
            {t("footer.tagline")}
          </span>
        </div>

        {/* Right — links + copyright */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {links.map(label => (
            <a key={label} href="#"
              style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#15803d"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}>
              {label}
            </a>
          ))}
          <span style={{ fontSize: 13, color: "#cbd5e1" }}>|</span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>© {year} ResQLink</span>
        </div>
      </div>
    </footer>
  );
}
