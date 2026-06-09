import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "si", label: "සිංහල" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    function handleOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function switchLang(code) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        title="Switch language"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          padding: "5px 10px",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          color: "#475569",
          fontFamily: "inherit",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <Globe size={14} color="#64748b" />
        <span>{current.label}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            minWidth: 130,
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "9px 14px",
                background: i18n.language === lang.code ? "#f0fdf4" : "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: i18n.language === lang.code ? 700 : 500,
                color: i18n.language === lang.code ? "#15803d" : "#334155",
                fontFamily: "inherit",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => {
                if (i18n.language !== lang.code) e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = i18n.language === lang.code ? "#f0fdf4" : "transparent";
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
