"use client";

import React, { createContext, useContext, useState } from "react";

export type LanguageMode = "en" | "hi" | "hinglish" | "hi-en";

type LanguageContextType = {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageMode>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const translations = {
  en: {
    heroTagline: "Ancient sky stories explained with modern space science.",
    ctaStart: "Start Jigyasa ->",
    ctaExplore: "Explore Akas Granth ->",
    askTitle: "Jigyasa Engine",
    askSubtitle: "Ask your cosmic questions here.",
    safetyLine: "Cultural narratives stay narratives. Scientific explanations stay evidence-aware.",
    topicIntro: "Select a topic to explore stories and science.",
  },
  hi: {
    heroTagline: "प्राचीन आकाश कथाएँ आधुनिक अंतरिक्ष विज्ञान के साथ।",
    ctaStart: "जिज्ञासा शुरू करें ->",
    ctaExplore: "आकाश ग्रंथ देखें ->",
    askTitle: "जिज्ञासा इंजन",
    askSubtitle: "अपने ब्रह्मांडीय प्रश्न यहाँ पूछें।",
    safetyLine: "सांस्कृतिक कथाएँ कथाएँ रहती हैं। वैज्ञानिक स्पष्टीकरण साक्ष्य-आधारित रहते हैं।",
    topicIntro: "कथाओं और विज्ञान को जानने के लिए विषय चुनें।",
  },
  hinglish: {
    heroTagline: "Purani sky stories ko modern space science ke sath simple way me samjho.",
    ctaStart: "Jigyasa Start Kare ->",
    ctaExplore: "Akas Granth Explore Kare ->",
    askTitle: "Jigyasa Engine",
    askSubtitle: "Apne space questions yaha pucho.",
    safetyLine: "Cultural stories stories rehti hain. Scientific explanations evidence-based rehte hain.",
    topicIntro: "Stories aur science explore karne ke liye topic select kare.",
  },
  "hi-en": {
    heroTagline: "प्राचीन आकाश कथाएँ, explained with modern space science.",
    ctaStart: "Start Jigyasa ->",
    ctaExplore: "Explore Akas Granth ->",
    askTitle: "Jigyasa Engine",
    askSubtitle: "Ask your cosmic questions here.",
    safetyLine: "Cultural narratives stay narratives. Scientific explanations stay evidence-aware.",
    topicIntro: "Select a topic to explore stories and science.",
  }
};
