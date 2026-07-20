"use client";

import React, { createContext, useContext, useState } from "react";

export type LanguageMode = "en" | "hi" | "hinglish" | "hi-en";

type LanguageContextType = {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<LanguageMode>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
