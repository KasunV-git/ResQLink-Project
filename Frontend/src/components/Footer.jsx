import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/Logo & Name Side-cropped.svg";
import logoDark from "../assets/dark-logo.png";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const links = [
    t("footer.privacy"),
    t("footer.terms"),
    t("footer.support"),
  ];

  return (
    <footer className="app-footer w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 transition-colors">
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        {/* Left — logo + tagline */}
        <div className="flex items-center gap-2.5">
          {/* Light Mode Logo */}
          <img src={logo} alt="ResQLink" className="h-7 w-auto brightness-100 block dark:hidden" />
          {/* Dark Mode Logo */}
          <img src={logoDark} alt="ResQLink" className="h-7 w-auto hidden dark:block" />
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {t("footer.tagline")}
          </span>
        </div>

        {/* Right — links + copyright */}
        <div className="flex items-center gap-4 text-xs font-medium">
          {links.map((label) => (
            <a
              key={label}
              href="#"
              className="text-slate-400 dark:text-slate-500 hover:text-[#15803d] dark:hover:text-emerald-400 transition-colors no-underline"
            >
              {label}
            </a>
          ))}
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-400 dark:text-slate-500">© {year} ResQLink</span>
        </div>
      </div>
    </footer>
  );
}
