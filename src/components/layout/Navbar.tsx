"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLanguage, translations, LANGUAGE_LABELS } from "@/config/language";
import type { LanguageMode } from "@/components/providers/LanguageProvider";
import { navigationItems } from "@/config/navigation";
import styles from "./Navbar.module.css";

const languageShort: Record<LanguageMode, string> = {
  en: "EN",
  hi: "हिं",
  hinglish: "HI",
  "hi-en": "BI",
};

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const pathname = usePathname();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const langContainerRef = useRef<HTMLDivElement>(null);

  /* Scroll detection for background transition */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const handler = () => {
      setMobileOpen(false);
      setLangOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* Click outside to close lang popover */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        langOpen &&
        langContainerRef.current &&
        !langContainerRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [langOpen]);

  /* Keyboard support */
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  const handleLangSelect = (lang: LanguageMode) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  const currentLangShort = languageShort[language];

  return (
    <nav
      ref={navRef}
      id="navbar"
      className={`${styles.glass} fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-500 ${
        scrolled ? styles.scrolled : ""
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            onClick={() => {
              setMobileOpen(false);
              setLangOpen(false);
            }}
            className="flex items-center gap-x-3 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05070f] focus:ring-amber-300 rounded-3xl"
          >
            {/* Celestial SVG Brandmark */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${styles.celestialArc} ${styles.brandSvg}`}
              >
                {/* Orbit ring 1 */}
                <circle cx="17" cy="17" r="14.5" stroke="#64748b" strokeWidth="1" strokeOpacity="0.35" />
                {/* Orbit ring 2 */}
                <circle cx="17" cy="17" r="9" stroke="#a5b4fc" strokeWidth="1" strokeOpacity="0.45" />
                {/* Center core */}
                <circle cx="17" cy="17" r="3.5" fill="#334155" />
                {/* Central star */}
                <path
                  d="M17 9.5L18.2 14.2L23 14.8L19.3 18.1L20 23L17 20.4L13.9 23L14.7 18.1L11 14.8L15.8 14.2L17 9.5Z"
                  fill="#e0c68f"
                />
                {/* Celestial arc */}
                <path
                  d="M8 17C8 11.5 12 7.5 17 7.5C23 7.5 27.5 13 28.5 17"
                  stroke="#d4af77"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Tiny accent point */}
                <circle cx="26" cy="12" r="1" fill="#f5e8c7" />
              </svg>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col -space-y-1">
              <span className="font-serif text-3xl font-normal tracking-[-1.5px] text-white group-active:text-amber-200 transition-colors">
                AkasGatha
              </span>
              <span className="text-[0.875rem] text-amber-300/70 tracking-[1.5px] font-light pl-0.5">
                अकाशगाथा
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-x-8 text-fluid-button">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive ? styles.active : ""
                  } text-fluid-button font-medium px-1 py-2 text-slate-300 hover:text-white flex items-center gap-x-1 ${styles.navLinkText}`}
                >
                  {t[item.key]}
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-x-5">
            {/* Language selector */}
            <div className="relative" ref={langContainerRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                  if (mobileOpen) setMobileOpen(false);
                }}
                className="flex items-center gap-x-2 px-5 h-9 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-300/40 transition-all text-[0.875rem] uppercase tracking-[0.5px] font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <span className="text-amber-200">{currentLangShort}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#d4af77"
                  strokeWidth="4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Popover */}
              <div
                className={`absolute right-0 top-12 w-60 ${styles.glass} border border-white/20 rounded-3xl py-3 shadow-2xl z-50 text-[0.875rem] ${
                  langOpen ? "flex flex-col" : "hidden"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3">
                  {(Object.keys(LANGUAGE_LABELS) as LanguageMode[]).map((key) => {
                    const isSelected = key === language;
                    return (
                      <div
                        key={key}
                        onClick={() => handleLangSelect(key)}
                        className={`${styles.langOption} px-6 py-3.5 flex items-center justify-between rounded-2xl cursor-pointer ${
                          isSelected ? "bg-amber-300/10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-x-3">
                          <span className="inline-flex items-center justify-center text-[0.875rem] font-mono w-6 h-6 border border-amber-400/30 text-amber-300 rounded-lg">
                            {languageShort[key]}
                          </span>
                          <span className="text-slate-200">{LANGUAGE_LABELS[key]}</span>
                        </div>
                        {isSelected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-amber-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                if (langOpen) setLangOpen(false);
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <div className="relative w-6 h-6">
                <span
                  className="absolute left-0 top-1.5 block w-full h-px bg-slate-200 transition-all origin-center"
                  style={mobileOpen ? { transform: "rotate(45deg) translate(4px, 5px)" } : {}}
                />
                <span
                  className="absolute left-0 top-3 block w-full h-px bg-slate-200 transition-all origin-center"
                  style={mobileOpen ? { opacity: 0 } : {}}
                />
                <span
                  className="absolute left-0 top-4.5 block w-full h-px bg-slate-200 transition-all origin-center"
                  style={mobileOpen ? { transform: "rotate(-45deg) translate(3px, -4px)" } : {}}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden ${styles.glass} border-t border-white/10 py-6 px-6 ${styles.mobileMenu} ${
          mobileOpen ? "flex flex-col" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-4 px-5 text-lg font-light border border-transparent hover:border-amber-200/30 rounded-3xl transition-all ${
                  isActive ? "bg-white/5 text-amber-200" : "text-slate-200"
                }`}
              >
                <span>{t[item.key]}</span>
                <span className="text-[0.875rem] font-mono text-slate-500">{item.href}</span>
              </Link>
            );
          })}
        </div>

        <div className="my-8 border-t border-white/10" />

        {/* Mobile language selector */}
        <div className="px-2">
          <div className="uppercase text-amber-300/70 text-[0.875rem] tracking-widest mb-4 pl-3">Select language</div>
          <div className="grid grid-cols-2 gap-2 text-fluid-button">
            {(Object.keys(LANGUAGE_LABELS) as LanguageMode[]).map((key) => {
              const isSelected = key === language;
              return (
                <div
                  key={key}
                  onClick={() => setLanguage(key)}
                  className={`px-6 py-4 flex items-center gap-x-3 border rounded-3xl cursor-pointer transition-all ${
                    isSelected ? "border-amber-300 bg-white/5" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="font-medium text-base">{languageShort[key]}</span>
                  <span className="text-[0.875rem] text-slate-400">{LANGUAGE_LABELS[key]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <div
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center text-fluid-button px-8 py-4 border border-white/20 hover:border-amber-200/30 rounded-3xl text-slate-400 transition-colors cursor-pointer"
          >
            CLOSE MENU
          </div>
        </div>
      </div>
    </nav>
  );
}
