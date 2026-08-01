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

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Switch language"
        className="flex items-center gap-1.5 bg-transparent border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full px-2.5 py-1 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
      >
        <Globe size={14} className="text-slate-500 dark:text-slate-400" />
        <span>{current.label}</span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg min-w-[130px] z-50 overflow-hidden">
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => switchLang(lang.code)}
                className={`block w-full text-left px-3.5 py-2 text-xs cursor-pointer border-none transition-colors ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#15803d] dark:text-emerald-400 font-bold"
                    : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-medium"
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
