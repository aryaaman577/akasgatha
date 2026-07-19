"use client";

import React from "react";
import { useLanguage } from "@/config/language";
import Link from "next/link";
import "./FeatureGrid.css";
import { useEffect, useRef } from "react";

const sectionTranslations = {
  en: {
    heading: "Eight paths through the sky.",
    support: "From Katha to Vigyan, every question finds its own lens.",
    enter: "Enter",
    granth: "Granth",
    ask: "Ask",
    about: "About",
    label: {
      katha: "Story Orbit",
      rahasya: "Mystery Orb",
      vigyan: "Science Lens",
      satya: "Truth Bridge",
      pramaan: "Evidence Grid",
      drishya: "Planet Orbit",
      jigyasa: "Question Orb",
      smriti: "Constellation Path"
    },
    katha: { title: "Katha Mandal", desc: "Cultural stories, preserved as narratives." },
    rahasya: { title: "Rahasya Chakra", desc: "Explore mysteries without false certainty." },
    vigyan: { title: "Vigyan Drishti", desc: "Understand mechanisms through modern evidence." },
    satya: { title: "Satya Setu", desc: "Two lenses, clearly separated." },
    pramaan: { title: "Pramaan Matrix", desc: "Evidence, confidence, and known limits." },
    drishya: { title: "Drishya Yantra", desc: "See complex ideas move in space." },
    jigyasa: { title: "Jigyasa Agni", desc: "Ask with curiosity and structure." },
    smriti: { title: "Smriti Quest", desc: "Remember through connected celestial paths." }
  },
  hi: {
    heading: "आकाश के आठ मार्ग।",
    support: "कथा से विज्ञान तक, हर प्रश्न अपना लेंस पाता है।",
    enter: "प्रवेश",
    granth: "ग्रंथ",
    ask: "पूछें",
    about: "परिचय",
    label: {
      katha: "कथा-कक्षा",
      rahasya: "रहस्य-गोलक",
      vigyan: "विज्ञान-दृष्टि",
      satya: "सत्य-सेतु",
      pramaan: "प्रमाण-मैट्रिक्स",
      drishya: "ग्रह-कक्षा",
      jigyasa: "जिज्ञासा-अग्नि",
      smriti: "स्मृति-पथ"
    },
    katha: { title: "कथा मंडल", desc: "सांस्कृतिक कथाएँ, कथाओं में सुरक्षित।" },
    rahasya: { title: "रहस्य चक्र", desc: "झूठी निश्चितता बिना रहस्य देखें।" },
    vigyan: { title: "विज्ञान दृष्टि", desc: "आधुनिक प्रमाण से तंत्र समझें।" },
    satya: { title: "सत्य सेतु", desc: "दो दृष्टियाँ, स्पष्ट रूप से अलग।" },
    pramaan: { title: "प्रमाण मैट्रिक्स", desc: "प्रमाण, भरोसा और सीमाएँ।" },
    drishya: { title: "दृश्य यंत्र", desc: "जटिल विचारों को अंतरिक्ष में चलते देखें।" },
    jigyasa: { title: "जिज्ञासा अग्नि", desc: "जिज्ञासा और संरचना के साथ पूछें।" },
    smriti: { title: "स्मृति क्वेस्ट", desc: "जुड़े खगोलीय पथों से याद रखें।" }
  },
  hinglish: {
    heading: "Eight paths through the sky.",
    support: "Katha se Vigyan tak, har question ko apna lens milta hai.",
    enter: "Enter",
    granth: "Granth",
    ask: "Ask",
    about: "About",
    label: {
      katha: "Story Orbit",
      rahasya: "Mystery Orb",
      vigyan: "Science Lens",
      satya: "Truth Bridge",
      pramaan: "Evidence Grid",
      drishya: "Planet Orbit",
      jigyasa: "Question Orb",
      smriti: "Constellation Path"
    },
    katha: { title: "Katha Mandal", desc: "Cultural stories, narratives mein preserved." },
    rahasya: { title: "Rahasya Chakra", desc: "Mysteries explore karein, false certainty ke bina." },
    vigyan: { title: "Vigyan Drishti", desc: "Modern evidence se mechanisms samjhein." },
    satya: { title: "Satya Setu", desc: "Do lenses, clearly separated." },
    pramaan: { title: "Pramaan Matrix", desc: "Evidence, confidence, aur known limits." },
    drishya: { title: "Drishya Yantra", desc: "Complex ideas ko space mein move hote dekhein." },
    jigyasa: { title: "Jigyasa Agni", desc: "Curiosity aur structure ke saath puchein." },
    smriti: { title: "Smriti Quest", desc: "Connected celestial paths se yaad rakhein." }
  },
  "hi-en": {
    heading: "Eight paths through the sky.",
    support: "Katha se Vigyan tak—हर प्रश्न अपना lens पाता है.",
    enter: "Enter",
    granth: "Granth",
    ask: "Ask",
    about: "About",
    label: {
      katha: "Story Orbit",
      rahasya: "Mystery Orb",
      vigyan: "Science Lens",
      satya: "Truth Bridge",
      pramaan: "Evidence Grid",
      drishya: "Planet Orbit",
      jigyasa: "Question Orb",
      smriti: "Constellation Path"
    },
    katha: { title: "Katha Mandal", desc: "Cultural stories, preserved as narratives." },
    rahasya: { title: "Rahasya Chakra", desc: "Explore mysteries without false certainty." },
    vigyan: { title: "Vigyan Drishti", desc: "Understand mechanisms through modern evidence." },
    satya: { title: "Satya Setu", desc: "Two lenses, clearly separated." },
    pramaan: { title: "Pramaan Matrix", desc: "Evidence, confidence, and known limits." },
    drishya: { title: "Drishya Yantra", desc: "See complex ideas move in space." },
    jigyasa: { title: "Jigyasa Agni", desc: "Ask with curiosity and structure." },
    smriti: { title: "Smriti Quest", desc: "Remember through connected celestial paths." }
  }
};

export function FeatureGrid() {
  const { language } = useLanguage();
  const t = (sectionTranslations)[language] || sectionTranslations.en;
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const root = sectionRef.current;
    
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isSmall = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;

    const revealItems = Array.from(root.querySelectorAll<HTMLElement>(".akas-reveal"));
    if (typeof IntersectionObserver !== "undefined" && !prefersReduced) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

      revealItems.forEach((el, i) => {
        el.style.transitionDelay = Math.min(i * 55, 420) + "ms";
        observer.observe(el);
      });
    } else {
      revealItems.forEach((el) => {
        el.classList.add("is-visible");
      });
    }

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".akas-dwar-card"));
    const shells = Array.from(root.querySelectorAll<HTMLElement>(".akas-model-shell"));
    let rafId: number | null = null;

    function setView(el: HTMLElement, x: number, y: number) {
      const rx = Math.max(-1, Math.min(1, y));
      const ry = Math.max(-1, Math.min(1, x));
      el.style.setProperty("--mx", Math.round((x + 1) * 50) + "%");
      el.style.setProperty("--my", Math.round((y + 1) * 50) + "%");
      el.style.setProperty("--tilt-x", (ry * 4.2).toFixed(2) + "deg");
      el.style.setProperty("--tilt-y", (-rx * 4.2).toFixed(2) + "deg");
    }

    function resetView(el: HTMLElement) {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "38%");
    }

    function updateViewFromPointer(el: HTMLElement, event: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      setView(el, x, y);
    }

    cards.forEach((card) => {
      const shell = card.querySelector<HTMLElement>(".akas-model-shell");
      
      const handlePointerMove = (event: PointerEvent) => {
        if (prefersReduced) return;
        if (event.pointerType === "touch") return;
        updateViewFromPointer(card, event as unknown as MouseEvent);
        if (shell) {
          const rect = shell.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
          shell.style.setProperty("--mx", Math.round((x + 1) * 50) + "%");
          shell.style.setProperty("--my", Math.round((y + 1) * 50) + "%");
        }
      };
      
      const handlePointerLeave = () => {
        resetView(card);
        card.classList.remove("is-active");
      };
      
      const handlePointerEnter = () => {
        card.classList.add("is-active");
      };

      card.addEventListener("pointermove", handlePointerMove, { passive: true });
      card.addEventListener("pointerleave", handlePointerLeave);
      card.addEventListener("pointerenter", handlePointerEnter);

      if (shell) {
        shell.addEventListener("focus", handlePointerEnter);
        shell.addEventListener("blur", () => {
          card.classList.remove("is-active");
          resetView(card);
        });
      }
    });

    shells.forEach((shell) => {
      let view = 0;
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      const activeCard = shell.closest<HTMLElement>(".akas-dwar-card");

      const handlePointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        if (shell.setPointerCapture) shell.setPointerCapture(event.pointerId);
        shell.classList.add("is-active");
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;

        if (Math.abs(dx) > Math.abs(dy) * 0.75) {
          view = (view + dx * 0.75) % 360;
          shell.setAttribute("data-view", view.toFixed(1));
          shell.style.transform = "rotateY(" + view.toFixed(2) + "deg)";
        } else if (event.pointerType !== "touch") {
          shell.style.transform = "rotateX(" + Math.max(-10, Math.min(10, -dy * 0.04)).toFixed(2) + "deg)";
        }
      };

      const endDrag = (event: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        shell.classList.remove("is-active");
        try {
          if (shell.releasePointerCapture) shell.releasePointerCapture(event.pointerId);
        } catch { /* ignored */ }
        if (activeCard) {
          activeCard.classList.add("is-active");
          rafId = window.setTimeout(() => {
            activeCard.classList.remove("is-active");
            shell.style.transform = "";
          }, prefersReduced ? 0 : 900);
        }
      };

      const lostCapture = () => {
        dragging = false;
        shell.classList.remove("is-active");
      };

      shell.addEventListener("pointerdown", handlePointerDown);
      shell.addEventListener("pointermove", handlePointerMove);
      shell.addEventListener("pointerup", endDrag);
      shell.addEventListener("pointercancel", endDrag);
      shell.addEventListener("lostpointercapture", lostCapture);
    });

    if (prefersReduced || isSmall) {
      const animEls = root.querySelectorAll<HTMLElement>(".akash-spin, .akash-spin-rev, .akash-orbit, .akash-orbit-rev, .akash-sweep, .akash-particle, .akash-flicker, .akash-drift");
      animEls.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.animationDuration && style.animationDuration !== "0s") {
          el.style.animationDuration = prefersReduced ? "0.001ms" : "18s";
        }
      });
    }

    const resizeHandler = () => {
      isSmall = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    };
    window.addEventListener("resize", resizeHandler, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeHandler);
      cards.forEach(c => {
         // remove events not strictly needed due to dom node destruction, but good practice
      });
    };
  }, []);

  return (
    <>
      <main ref={sectionRef} className="akas-dwar-section" aria-labelledby="akas-dwar-heading">
    <div className="akas-dwar-bg" aria-hidden="true">
      <div className="akas-nebula-band"></div>
      <div className="akas-archive-lines"></div>
      <div className="akas-celestial-path">
        <svg viewBox="0 0 1120 620" role="img" aria-hidden="true">
          <path className="path-glow" d="M52 420 C190 270 258 382 374 248 C500 102 608 204 712 150 C844 82 892 190 1068 92" />
          <path className="path-line" d="M52 420 C190 270 258 382 374 248 C500 102 608 204 712 150 C844 82 892 190 1068 92" />
        </svg>
      </div>
    </div>

    <div className="akas-dwar-inner">
      <header className="akas-heading-wrap akas-reveal">
        <h1 className="akas-heading" id="akas-dwar-heading" >{t.heading}</h1>
        <p className="akas-support" >{t.support}</p>
      </header>

      <section className="akas-dwar-grid" aria-label="AkasGatha Core Dwar">
        <article className="akas-dwar-card akas-reveal" data-title="Katha Mandal" data-desc="Cultural stories, preserved as narratives." data-locale-key="katha">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Katha Mandal: moonlike core with luminous narrative ribbons and rotating antique fragments" data-view="0">
            <div className="akas-model-label" >{t.label.katha}</div>
            <div className="akas-model akash-model-svg" data-model="katha">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <radialGradient id="kCore" cx="48%" cy="42%" r="62%">
                    <stop offset="0" stopColor="#fff7d7"/>
                    <stop offset="42%" stopColor="#d8c28f"/>
                    <stop offset="74%" stopColor="#75614b"/>
                    <stop offset="100%" stopColor="#16101d"/>
                  </radialGradient>
                  <linearGradient id="kRibbon" x1="0" x2="1">
                    <stop offset="0" stopColor="#f2d89b" stopOpacity=".18"/>
                    <stop offset=".48" stopColor="#fff0c8" stopOpacity=".72"/>
                    <stop offset="1" stopColor="#7a315f" stopOpacity=".28"/>
                  </linearGradient>
                  <filter id="kGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <g className="akash-orbit" style={{ "--orbit": "38s" } as React.CSSProperties}>
                  <ellipse cx="260" cy="160" rx="198" ry="62" fill="none" stroke="url(#kRibbon)" strokeWidth="14" opacity=".72"/>
                  <ellipse cx="260" cy="160" rx="174" ry="88" fill="none" stroke="#8f5332" strokeWidth="2" strokeDasharray="10 13" opacity=".52"/>
                  <ellipse cx="260" cy="160" rx="138" ry="38" fill="none" stroke="#fff1c6" strokeWidth="1.5" strokeDasharray="3 10" opacity=".48"/>
                </g>
                <g className="akash-spin-rev" style={{ "--spin": "52s" } as React.CSSProperties}>
                  <ellipse cx="260" cy="160" rx="224" ry="92" fill="none" stroke="#331c58" strokeWidth="1" strokeDasharray="2 12" opacity=".55"/>
                  <path d="M88 184 C150 72 248 58 322 104 C386 144 396 222 324 254 C244 290 132 260 88 184Z" fill="none" stroke="url(#kRibbon)" strokeWidth="10" opacity=".75" filter="url(#kGlow)"/>
                </g>
                <circle className="akash-pulse" cx="260" cy="160" r="58" fill="url(#kCore)" stroke="#f1d99a" strokeOpacity=".52" strokeWidth="2"/>
                <circle cx="244" cy="142" r="12" fill="#fff7df" opacity=".72"/>
                <circle cx="282" cy="172" r="8" fill="#4b354b" opacity=".48"/>
                <circle cx="270" cy="118" r="5" fill="#a98b5c" opacity=".62"/>
                <g className="akash-orbit" style={{ "--orbit": "22s" } as React.CSSProperties}>
                  <circle cx="440" cy="118" r="10" fill="#f3d99a"/>
                  <circle cx="440" cy="118" r="22" fill="none" stroke="#f3d99a" strokeOpacity=".22"/>
                </g>
                <g className="akash-orbit-rev" style={{ "--orbit": "29s" } as React.CSSProperties}>
                  <circle cx="96" cy="208" r="8" fill="#803357"/>
                  <circle cx="96" cy="208" r="18" fill="none" stroke="#803357" strokeOpacity=".26"/>
                </g>
                <g opacity=".75">
                  <circle className="akash-particle" style={{ "--dur": "6s" } as React.CSSProperties} cx="120" cy="94" r="2.2" fill="#fff0c8"/>
                  <circle className="akash-particle" style={{ "--dur": "7.5s" } as React.CSSProperties} cx="398" cy="238" r="1.8" fill="#f1c889"/>
                  <circle className="akash-particle" style={{ "--dur": "8s" } as React.CSSProperties} cx="422" cy="84" r="1.6" fill="#8b4b75"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="166" cy="260" r="2" fill="#d6c09b"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/granth">
              <h2 className="akas-title" >{t.katha.title}</h2>
              <p className="akas-desc" >{t.katha.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.granth}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Rahasya Chakra" data-desc="Explore mysteries without false certainty." data-locale-key="rahasya">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Rahasya Chakra: dark mystery orb with lensing rings and red-violet accretion glow" data-view="0">
            <div className="akas-model-label" >{t.label.rahasya}</div>
            <div className="akas-model akash-model-svg" data-model="rahasya">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <radialGradient id="rVoid" cx="50%" cy="48%" r="55%">
                    <stop offset="0" stopColor="#03030a"/>
                    <stop offset="42%" stopColor="#05050e"/>
                    <stop offset="68%" stopColor="#171124"/>
                    <stop offset="100%" stopColor="#03030a"/>
                  </radialGradient>
                  <radialGradient id="rGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0" stopColor="#ff4f87" stopOpacity=".9"/>
                    <stop offset=".38" stopColor="#8f42b8" stopOpacity=".55"/>
                    <stop offset="1" stopColor="#13071d" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="rBlur" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="7"/>
                  </filter>
                </defs>
                <g className="akash-drift" style={{ "--drift": "10s" } as React.CSSProperties}>
                  <path d="M82 146 C138 94 194 94 244 126 C294 158 330 154 438 104" fill="none" stroke="#6e3a86" strokeWidth="18" strokeLinecap="round" opacity=".18" filter="url(#rBlur)"/>
                  <path d="M92 198 C162 154 226 162 286 196 C342 228 394 212 444 178" fill="none" stroke="#2a1034" strokeWidth="26" strokeLinecap="round" opacity=".32" filter="url(#rBlur)"/>
                </g>
                <g className="akash-spin" style={{ "--spin": "34s" } as React.CSSProperties}>
                  <ellipse cx="260" cy="160" rx="204" ry="48" fill="none" stroke="#d8d7df" strokeOpacity=".30" strokeWidth="1.4" strokeDasharray="9 12"/>
                  <ellipse cx="260" cy="160" rx="184" ry="72" fill="none" stroke="#8e3f9c" strokeOpacity=".58" strokeWidth="8"/>
                  <ellipse cx="260" cy="160" rx="154" ry="34" fill="none" stroke="#ff5f8f" strokeOpacity=".32" strokeWidth="4"/>
                </g>
                <g className="akash-spin-rev" style={{ "--spin": "46s" } as React.CSSProperties}>
                  <ellipse cx="260" cy="160" rx="222" ry="92" fill="none" stroke="#2b263a" strokeOpacity=".8" strokeWidth="2" strokeDasharray="2 12"/>
                  <ellipse cx="260" cy="160" rx="190" ry="104" fill="none" stroke="#c8c7d6" strokeOpacity=".24" strokeWidth="1.4"/>
                </g>
                <circle cx="260" cy="160" r="104" fill="url(#rGlow)" filter="url(#rBlur)" opacity=".82"/>
                <circle cx="260" cy="160" r="54" fill="url(#rVoid)" stroke="#d9d9e4" strokeOpacity=".55" strokeWidth="2.2"/>
                <circle cx="244" cy="148" r="16" fill="#010107" opacity=".95"/>
                <path d="M196 154 C220 126 246 120 268 132" fill="none" stroke="#ff7aa3" strokeWidth="3" opacity=".42" strokeLinecap="round"/>
                <path d="M326 170 C300 194 278 198 252 186" fill="none" stroke="#b266d6" strokeWidth="3" opacity=".36" strokeLinecap="round"/>
                <g opacity=".8">
                  <circle className="akash-particle" style={{ "--dur": "5.8s" } as React.CSSProperties} cx="118" cy="122" r="2" fill="#d8d7df"/>
                  <circle className="akash-particle" style={{ "--dur": "8s" } as React.CSSProperties} cx="402" cy="132" r="1.8" fill="#ff6f9f"/>
                  <circle className="akash-particle" style={{ "--dur": "7.2s" } as React.CSSProperties} cx="386" cy="222" r="2.2" fill="#b078d8"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="142" cy="238" r="1.5" fill="#cfd0dc"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/granth">
              <h2 className="akas-title" >{t.rahasya.title}</h2>
              <p className="akas-desc" >{t.rahasya.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.granth}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Vigyan Drishti" data-desc="Understand mechanisms through modern evidence." data-locale-key="vigyan">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Vigyan Drishti: science lens with optical rings, scan arcs, and measurement nodes" data-view="0">
            <div className="akas-model-label" >{t.label.vigyan}</div>
            <div className="akas-model akash-model-svg" data-model="vigyan">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient id="vGlass" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#d9f7ff" stopOpacity=".42"/>
                    <stop offset=".48" stopColor="#238bd0" stopOpacity=".26"/>
                    <stop offset="1" stopColor="#0b1328" stopOpacity=".92"/>
                  </linearGradient>
                  <radialGradient id="vCore" cx="50%" cy="50%" r="52%">
                    <stop offset="0" stopColor="#e8fbff" stopOpacity=".9"/>
                    <stop offset=".48" stopColor="#45c7f1" stopOpacity=".35"/>
                    <stop offset="1" stopColor="#06142c" stopOpacity=".72"/>
                  </radialGradient>
                  <filter id="vGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <g className="akash-spin" style={{ "--spin": "28s" } as React.CSSProperties}>
                  <ellipse cx="260" cy="160" rx="190" ry="54" fill="none" stroke="#bdefff" strokeOpacity=".22" strokeWidth="1.3" strokeDasharray="6 10"/>
                  <ellipse cx="260" cy="160" rx="160" ry="72" fill="none" stroke="#2bb7e8" strokeOpacity=".42" strokeWidth="2"/>
                  <ellipse cx="260" cy="160" rx="120" ry="34" fill="none" stroke="#d7ecff" strokeOpacity=".22" strokeWidth="1.2"/>
                </g>
                <g className="akash-sweep" style={{ "--sweep": "5.8s" } as React.CSSProperties}>
                  <path d="M260 160 L454 112" stroke="#7ce8ff" strokeWidth="2.2" opacity=".55" strokeLinecap="round" filter="url(#vGlow)"/>
                </g>
                <g>
                  <path d="M112 160 C154 86 226 72 292 112 C360 154 378 222 314 252 C246 284 154 252 112 160Z" fill="url(#vGlass)" stroke="#c8f4ff" strokeOpacity=".34" strokeWidth="1.4"/>
                  <ellipse cx="260" cy="160" rx="102" ry="62" fill="url(#vCore)" stroke="#e9fbff" strokeOpacity=".58" strokeWidth="2"/>
                  <path d="M164 160 H356" stroke="#e8fbff" strokeOpacity=".28" strokeWidth="1"/>
                  <path d="M260 98 V222" stroke="#e8fbff" strokeOpacity=".20" strokeWidth="1"/>
                  <circle cx="164" cy="160" r="4" fill="#f2d88a"/>
                  <circle cx="356" cy="160" r="4" fill="#f2d88a"/>
                  <circle cx="260" cy="98" r="3.5" fill="#d7f7ff"/>
                  <circle cx="260" cy="222" r="3.5" fill="#d7f7ff"/>
                </g>
                <g className="akash-orbit" style={{ "--orbit": "18s" } as React.CSSProperties}>
                  <circle cx="414" cy="140" r="7" fill="#dffaff"/>
                  <circle cx="414" cy="140" r="18" fill="none" stroke="#63dfff" strokeOpacity=".34"/>
                </g>
                <g className="akash-orbit-rev" style={{ "--orbit": "24s" } as React.CSSProperties}>
                  <circle cx="116" cy="184" r="5" fill="#f2d88a"/>
                  <circle cx="116" cy="184" r="14" fill="none" stroke="#f2d88a" strokeOpacity=".28"/>
                </g>
                <g opacity=".78">
                  <circle className="akash-particle" style={{ "--dur": "6.5s" } as React.CSSProperties} cx="102" cy="92" r="1.7" fill="#c9f8ff"/>
                  <circle className="akash-particle" style={{ "--dur": "7.8s" } as React.CSSProperties} cx="426" cy="238" r="1.6" fill="#7ce8ff"/>
                  <circle className="akash-particle" style={{ "--dur": "8.5s" } as React.CSSProperties} cx="454" cy="94" r="1.5" fill="#e8fbff"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="150" cy="260" r="1.4" fill="#f2d88a"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/granth">
              <h2 className="akas-title" >{t.vigyan.title}</h2>
              <p className="akas-desc" >{t.vigyan.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.granth}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Satya Setu" data-desc="Two lenses, clearly separated." data-locale-key="satya">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Satya Setu: two separate fields joined by a neutral moonlight bridge" data-view="0">
            <div className="akas-model-label" >{t.label.satya}</div>
            <div className="akas-model akash-model-svg" data-model="satya">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient id="sGold" x1="0" x2="1">
                    <stop offset="0" stopColor="#f0d48e" stopOpacity=".68"/>
                    <stop offset="1" stopColor="#7b4b2b" stopOpacity=".18"/>
                  </linearGradient>
                  <linearGradient id="sSilver" x1="0" x2="1">
                    <stop offset="0" stopColor="#76e6ff" stopOpacity=".52"/>
                    <stop offset="1" stopColor="#dce8f5" stopOpacity=".28"/>
                  </linearGradient>
                  <radialGradient id="sMoon" cx="50%" cy="42%" r="60%">
                    <stop offset="0" stopColor="#fff7d8"/>
                    <stop offset=".58" stopColor="#b8c2d6"/>
                    <stop offset="1" stopColor="#29334a"/>
                  </radialGradient>
                </defs>
                <g opacity=".9">
                  <path d="M94 184 C144 118 204 108 252 142 C292 170 330 164 430 110" fill="none" stroke="#f1d38a" strokeWidth="22" strokeLinecap="round" opacity=".15"/>
                  <path d="M94 226 C158 184 218 190 270 214 C330 242 376 232 430 194" fill="none" stroke="#74e8ff" strokeWidth="22" strokeLinecap="round" opacity=".13"/>
                </g>
                <g className="akash-spin" style={{ "--spin": "30s" } as React.CSSProperties}>
                  <ellipse cx="178" cy="160" rx="92" ry="38" fill="none" stroke="url(#sGold)" strokeWidth="2" strokeDasharray="7 9" opacity=".58"/>
                  <ellipse cx="342" cy="160" rx="92" ry="38" fill="none" stroke="url(#sSilver)" strokeWidth="2" strokeDasharray="7 9" opacity=".55"/>
                </g>
                <path d="M204 178 C232 136 286 136 316 178" fill="none" stroke="#dce8f5" strokeOpacity=".56" strokeWidth="7" strokeLinecap="round"/>
                <path d="M214 184 C242 154 278 154 306 184" fill="none" stroke="#f4d994" strokeOpacity=".28" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="178" cy="160" r="48" fill="#5a3922" stroke="#f2d88a" strokeOpacity=".42" strokeWidth="1.4"/>
                <circle cx="342" cy="160" r="48" fill="#0e314a" stroke="#bdefff" strokeOpacity=".40" strokeWidth="1.4"/>
                <circle cx="178" cy="160" r="24" fill="#c79a4d" opacity=".55"/>
                <circle cx="342" cy="160" r="24" fill="#46bddf" opacity=".42"/>
                <path d="M160 142 L196 178 L150 184" fill="none" stroke="#fff0c8" strokeOpacity=".46" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M324 184 H360 M342 142 V178" stroke="#e8fbff" strokeOpacity=".42" strokeWidth="1.4" strokeLinecap="round"/>
                <circle className="akash-pulse" cx="260" cy="178" r="13" fill="url(#sMoon)" stroke="#fff7d8" strokeOpacity=".58" strokeWidth="1.2"/>
                <g className="akash-orbit" style={{ "--orbit": "22s" } as React.CSSProperties}>
                  <circle cx="112" cy="214" r="5" fill="#f2d88a"/>
                  <circle cx="408" cy="104" r="5" fill="#bdefff"/>
                </g>
                <g opacity=".78">
                  <circle className="akash-particle" style={{ "--dur": "7s" } as React.CSSProperties} cx="94" cy="112" r="1.8" fill="#f2d88a"/>
                  <circle className="akash-particle" style={{ "--dur": "8s" } as React.CSSProperties} cx="424" cy="220" r="1.8" fill="#bdefff"/>
                  <circle className="akash-particle" style={{ "--dur": "8.8s" } as React.CSSProperties} cx="460" cy="150" r="1.4" fill="#fff7d8"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="72" cy="236" r="1.3" fill="#d7f7ff"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/about">
              <h2 className="akas-title" >{t.satya.title}</h2>
              <p className="akas-desc" >{t.satya.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.about}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Pramaan Matrix" data-desc="Evidence, confidence, and known limits." data-locale-key="pramaan">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Pramaan Matrix: structured evidence grid with confidence links and small gold points" data-view="0">
            <div className="akas-model-label" >{t.label.pramaan}</div>
            <div className="akas-model akash-model-svg" data-model="pramaan">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient id="pGrid" x1="0" x2="1" y1="1" y2="0">
                    <stop offset="0" stopColor="#071426"/>
                    <stop offset=".55" stopColor="#1a334a"/>
                    <stop offset="1" stopColor="#0b101d"/>
                  </linearGradient>
                  <filter id="pGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <g className="akash-drift" style={{ "--drift": "12s" } as React.CSSProperties} opacity=".9">
                  <path d="M122 238 L204 164 L286 188 L398 94" fill="none" stroke="#73e4ff" strokeWidth="1.3" strokeDasharray="4 9" opacity=".36"/>
                  <path d="M100 132 L214 118 L306 154 L420 132" fill="none" stroke="#dce8f5" strokeWidth="1.1" strokeDasharray="4 9" opacity=".26"/>
                  <path d="M152 92 L152 232 M236 74 L236 246 M320 88 L320 238 M404 104 L404 224" stroke="#dce8f5" strokeOpacity=".13" strokeWidth="1"/>
                  <path d="M92 112 H432 M112 154 H448 M128 196 H420 M152 238 H398" stroke="#dce8f5" strokeOpacity=".12" strokeWidth="1"/>
                </g>
                <g className="akash-orbit" style={{ "--orbit": "36s" } as React.CSSProperties}>
                  <path d="M138 226 L210 154 L292 184 L402 98" fill="none" stroke="#f2d88a" strokeOpacity=".38" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M124 132 L224 118 L306 154 L420 132" fill="none" stroke="#8beeff" strokeOpacity=".34" strokeWidth="2" strokeLinecap="round"/>
                </g>
                <g>
                  <rect x="142" y="88" width="236" height="144" rx="18" fill="url(#pGrid)" stroke="#dce8f5" strokeOpacity=".20"/>
                  <path d="M172 202 L216 158 L260 174 L304 132 L348 148" fill="none" stroke="#f2d88a" strokeOpacity=".48" strokeWidth="1.5" filter="url(#pGlow)"/>
                  <path d="M172 132 L216 158 L260 174 L304 132 L348 148" fill="none" stroke="#7ce8ff" strokeOpacity=".38" strokeWidth="1.5"/>
                  <g>
                    <circle className="akash-pulse" style={{ "--pulse": "3.2s" } as React.CSSProperties} cx="172" cy="202" r="6" fill="#d7f7ff"/>
                    <circle className="akash-pulse" style={{ "--pulse": "3.8s" } as React.CSSProperties} cx="216" cy="158" r="6" fill="#f2d88a"/>
                    <circle className="akash-pulse" style={{ "--pulse": "4.2s" } as React.CSSProperties} cx="260" cy="174" r="6" fill="#8beeff"/>
                    <circle className="akash-pulse" style={{ "--pulse": "4.8s" } as React.CSSProperties} cx="304" cy="132" r="6" fill="#dce8f5"/>
                    <circle className="akash-pulse" style={{ "--pulse": "5.2s" } as React.CSSProperties} cx="348" cy="148" r="6" fill="#f2d88a"/>
                    <circle className="akash-pulse" style={{ "--pulse": "3.6s" } as React.CSSProperties} cx="172" cy="132" r="4" fill="#f2d88a"/>
                    <circle className="akash-pulse" style={{ "--pulse": "4.4s" } as React.CSSProperties} cx="260" cy="214" r="4" fill="#7ce8ff"/>
                    <circle className="akash-pulse" style={{ "--pulse": "5.6s" } as React.CSSProperties} cx="390" cy="202" r="4" fill="#dce8f5"/>
                  </g>
                  <path d="M158 218 H362 M158 102 H362" stroke="#dce8f5" strokeOpacity=".12" strokeWidth="1"/>
                </g>
                <g className="akash-orbit-rev" style={{ "--orbit": "20s" } as React.CSSProperties}>
                  <circle cx="122" cy="238" r="4" fill="#f2d88a"/>
                  <circle cx="420" cy="94" r="4" fill="#8beeff"/>
                </g>
                <g opacity=".76">
                  <circle className="akash-particle" style={{ "--dur": "6.8s" } as React.CSSProperties} cx="96" cy="102" r="1.6" fill="#dce8f5"/>
                  <circle className="akash-particle" style={{ "--dur": "8s" } as React.CSSProperties} cx="430" cy="238" r="1.5" fill="#7ce8ff"/>
                  <circle className="akash-particle" style={{ "--dur": "8.8s" } as React.CSSProperties} cx="452" cy="160" r="1.4" fill="#f2d88a"/>
                  <circle className="akash-particle" style={{ "--dur": "9.2s" } as React.CSSProperties} cx="78" cy="246" r="1.2" fill="#fff7d8"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/granth">
              <h2 className="akas-title" >{t.pramaan.title}</h2>
              <p className="akas-desc" >{t.pramaan.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.granth}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Drishya Yantra" data-desc="See complex ideas move in space." data-locale-key="drishya">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Drishya Yantra: procedural planet with atmosphere rim, orbit planes, moon, and stardust" data-view="0">
            <div className="akas-model-label" >{t.label.drishya}</div>
            <div className="akas-model akash-model-svg" data-model="drishya">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <radialGradient id="dPlanet" cx="42%" cy="36%" r="62%">
                    <stop offset="0" stopColor="#d9fbff"/>
                    <stop offset=".38" stopColor="#36aee4"/>
                    <stop offset=".72" stopColor="#123e6a"/>
                    <stop offset="1" stopColor="#07101f"/>
                  </radialGradient>
                  <radialGradient id="dAtmos" cx="50%" cy="46%" r="60%">
                    <stop offset="0" stopColor="#8af3ff" stopOpacity=".34"/>
                    <stop offset=".62" stopColor="#2c8fc9" stopOpacity=".18"/>
                    <stop offset="1" stopColor="#07101f" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="dGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="6"/>
                  </filter>
                </defs>
                <g className="akash-spin" style={{ "--spin": "34s" } as React.CSSProperties}>
                  <ellipse cx="260" cy="160" rx="204" ry="54" fill="none" stroke="#d7f7ff" strokeOpacity=".25" strokeWidth="1.4" strokeDasharray="7 10"/>
                  <ellipse cx="260" cy="160" rx="190" ry="76" fill="none" stroke="#f2d88a" strokeOpacity=".34" strokeWidth="1.2"/>
                  <ellipse cx="260" cy="160" rx="146" ry="34" fill="none" stroke="#7ce8ff" strokeOpacity=".20" strokeWidth="1.1"/>
                </g>
                <g className="akash-orbit" style={{ "--orbit": "18s" } as React.CSSProperties}>
                  <circle cx="430" cy="126" r="9" fill="#fff7d8"/>
                  <circle cx="430" cy="126" r="20" fill="none" stroke="#fff7d8" strokeOpacity=".22"/>
                </g>
                <circle cx="260" cy="160" r="92" fill="url(#dAtmos)" filter="url(#dGlow)"/>
                <circle cx="260" cy="160" r="62" fill="url(#dPlanet)" stroke="#bdefff" strokeOpacity=".52" strokeWidth="1.5"/>
                <path d="M208 132 C238 118 278 120 314 138" fill="none" stroke="#e8fbff" strokeOpacity=".36" strokeWidth="2"/>
                <path d="M198 166 C232 150 286 154 326 174" fill="none" stroke="#0b2542" strokeOpacity=".52" strokeWidth="6"/>
                <path d="M210 190 C246 204 284 202 318 184" fill="none" stroke="#7ce8ff" strokeOpacity=".22" strokeWidth="2"/>
                <path d="M184 150 C230 132 292 136 340 158" fill="none" stroke="#f2d88a" strokeOpacity=".28" strokeWidth="1.4"/>
                <g className="akash-orbit-rev" style={{ "--orbit": "28s" } as React.CSSProperties}>
                  <circle cx="112" cy="214" r="5" fill="#bdefff"/>
                  <circle cx="112" cy="214" r="14" fill="none" stroke="#bdefff" strokeOpacity=".24"/>
                </g>
                <g opacity=".78">
                  <circle className="akash-particle" style={{ "--dur": "6.8s" } as React.CSSProperties} cx="104" cy="92" r="1.8" fill="#d7f7ff"/>
                  <circle className="akash-particle" style={{ "--dur": "7.6s" } as React.CSSProperties} cx="424" cy="238" r="1.7" fill="#7ce8ff"/>
                  <circle className="akash-particle" style={{ "--dur": "8.4s" } as React.CSSProperties} cx="448" cy="88" r="1.3" fill="#f2d88a"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="150" cy="260" r="1.2" fill="#fff7d8"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/granth">
              <h2 className="akas-title" >{t.drishya.title}</h2>
              <p className="akas-desc" >{t.drishya.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.granth}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Jigyasa Agni" data-desc="Ask with curiosity and structure." data-locale-key="jigyasa">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Jigyasa Agni: question orb with pulsar core, constellation branches, energy filaments, and response waves" data-view="0">
            <div className="akas-model-label" >{t.label.jigyasa}</div>
            <div className="akas-model akash-model-svg" data-model="jigyasa">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <radialGradient id="jCore" cx="50%" cy="50%" r="62%">
                    <stop offset="0" stopColor="#fff7d8"/>
                    <stop offset=".28" stopColor="#8ef4ff"/>
                    <stop offset=".62" stopColor="#8d52c7"/>
                    <stop offset="1" stopColor="#12071f"/>
                  </radialGradient>
                  <filter id="jGlow" x="-70%" y="-70%" width="240%" height="240%">
                    <feGaussianBlur stdDeviation="7" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <g className="akash-drift" style={{ "--drift": "9s" } as React.CSSProperties} opacity=".88">
                  <path d="M118 210 C168 128 218 116 260 156 C304 198 350 188 424 112" fill="none" stroke="#b58cff" strokeOpacity=".20" strokeWidth="22" strokeLinecap="round" filter="url(#jGlow)"/>
                  <path d="M92 130 C160 168 208 178 260 156 C320 130 360 142 438 190" fill="none" stroke="#7ce8ff" strokeOpacity=".18" strokeWidth="20" strokeLinecap="round" filter="url(#jGlow)"/>
                </g>
                <g className="akash-spin" style={{ "--spin": "26s" } as React.CSSProperties}>
                  <path d="M260 160 L260 78" stroke="#d7f7ff" strokeOpacity=".34" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L336 102" stroke="#f2d88a" strokeOpacity=".36" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L356 160" stroke="#b58cff" strokeOpacity=".30" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L336 218" stroke="#7ce8ff" strokeOpacity=".32" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L260 242" stroke="#d7f7ff" strokeOpacity=".30" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L184 218" stroke="#b58cff" strokeOpacity=".28" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L164 160" stroke="#7ce8ff" strokeOpacity=".28" strokeWidth="1.5" strokeDasharray="4 9"/>
                  <path d="M260 160 L184 102" stroke="#f2d88a" strokeOpacity=".30" strokeWidth="1.5" strokeDasharray="4 9"/>
                </g>
                <g className="akash-pulse" style={{ "--pulse": "2.8s" } as React.CSSProperties}>
                  <circle cx="260" cy="160" r="72" fill="none" stroke="#8ef4ff" strokeOpacity=".16" strokeWidth="3"/>
                  <circle cx="260" cy="160" r="54" fill="none" stroke="#b58cff" strokeOpacity=".18" strokeWidth="3"/>
                </g>
                <circle cx="260" cy="160" r="36" fill="url(#jCore)" stroke="#fff7d8" strokeOpacity=".48" strokeWidth="1.4" filter="url(#jGlow)"/>
                <circle cx="260" cy="160" r="12" fill="#fff7d8" opacity=".9"/>
                <g>
                  <circle cx="336" cy="102" r="5" fill="#f2d88a"/>
                  <circle cx="356" cy="160" r="5" fill="#b58cff"/>
                  <circle cx="336" cy="218" r="5" fill="#7ce8ff"/>
                  <circle cx="260" cy="242" r="5" fill="#d7f7ff"/>
                  <circle cx="184" cy="218" r="5" fill="#b58cff"/>
                  <circle cx="164" cy="160" r="5" fill="#7ce8ff"/>
                  <circle cx="184" cy="102" r="5" fill="#f2d88a"/>
                  <circle cx="260" cy="78" r="5" fill="#d7f7ff"/>
                </g>
                <g className="akash-orbit" style={{ "--orbit": "18s" } as React.CSSProperties}>
                  <circle cx="438" cy="190" r="4" fill="#fff7d8"/>
                  <circle cx="438" cy="190" r="12" fill="none" stroke="#fff7d8" strokeOpacity=".22"/>
                </g>
                <g opacity=".76">
                  <circle className="akash-particle" style={{ "--dur": "6.4s" } as React.CSSProperties} cx="96" cy="102" r="1.7" fill="#d7f7ff"/>
                  <circle className="akash-particle" style={{ "--dur": "7.8s" } as React.CSSProperties} cx="424" cy="238" r="1.5" fill="#b58cff"/>
                  <circle className="akash-particle" style={{ "--dur": "8.4s" } as React.CSSProperties} cx="452" cy="90" r="1.3" fill="#7ce8ff"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="150" cy="260" r="1.2" fill="#f2d88a"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/ask">
              <h2 className="akas-title" >{t.jigyasa.title}</h2>
              <p className="akas-desc" >{t.jigyasa.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.ask}</span></span>
            </Link>
          </div>
        </article>

        <article className="akas-dwar-card akas-reveal" data-title="Smriti Quest" data-desc="Remember through connected celestial paths." data-locale-key="smriti">
          <div className="akas-model-shell" tabIndex={0} role="img" aria-label="Smriti Quest: constellation path with forming memory nodes, stardust trail, violet path, blue nodes, and gold completion points" data-view="0">
            <div className="akas-model-label" >{t.label.smriti}</div>
            <div className="akas-model akash-model-svg" data-model="smriti">
              <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient id="mPath" x1="0" x2="1">
                    <stop offset="0" stopColor="#b58cff" stopOpacity=".22"/>
                    <stop offset=".52" stopColor="#7ce8ff" stopOpacity=".58"/>
                    <stop offset="1" stopColor="#f2d88a" stopOpacity=".72"/>
                  </linearGradient>
                  <filter id="mGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <g className="akash-drift" style={{ "--drift": "11s" } as React.CSSProperties} opacity=".78">
                  <path d="M92 220 C150 190 160 112 224 132 C282 150 278 220 352 206 C410 194 410 112 458 96" fill="none" stroke="#b58cff" strokeOpacity=".14" strokeWidth="18" strokeLinecap="round" filter="url(#mGlow)"/>
                </g>
                <path d="M92 220 C150 190 160 112 224 132 C282 150 278 220 352 206 C410 194 410 112 458 96" fill="none" stroke="url(#mPath)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10"/>
                <path d="M92 220 C150 190 160 112 224 132 C282 150 278 220 352 206 C410 194 410 112 458 96" fill="none" stroke="#f2d88a" strokeOpacity=".48" strokeWidth="1.4" strokeDasharray="8 18"/>
                <g className="akash-orbit" style={{ "--orbit": "24s" } as React.CSSProperties}>
                  <circle cx="92" cy="220" r="5" fill="#7ce8ff"/>
                  <circle cx="160" cy="112" r="5" fill="#7ce8ff"/>
                  <circle cx="224" cy="132" r="5" fill="#7ce8ff"/>
                  <circle cx="278" cy="220" r="5" fill="#7ce8ff"/>
                  <circle cx="352" cy="206" r="5" fill="#7ce8ff"/>
                  <circle cx="410" cy="112" r="6" fill="#f2d88a"/>
                  <circle cx="458" cy="96" r="7" fill="#fff7d8"/>
                  <circle cx="458" cy="96" r="18" fill="none" stroke="#fff7d8" strokeOpacity=".24"/>
                </g>
                <g>
                  <path d="M92 220 L160 112 L224 132 L278 220 L352 206 L410 112 L458 96" fill="none" stroke="#fff7d8" strokeOpacity=".18" strokeWidth="1"/>
                  <circle cx="92" cy="220" r="2.5" fill="#7ce8ff"/>
                  <circle cx="160" cy="112" r="2.5" fill="#7ce8ff"/>
                  <circle cx="224" cy="132" r="2.5" fill="#7ce8ff"/>
                  <circle cx="278" cy="220" r="2.5" fill="#7ce8ff"/>
                  <circle cx="352" cy="206" r="2.5" fill="#7ce8ff"/>
                  <circle cx="410" cy="112" r="3" fill="#f2d88a"/>
                  <circle cx="458" cy="96" r="3.4" fill="#fff7d8"/>
                </g>
                <g className="akash-orbit-rev" style={{ "--orbit": "20s" } as React.CSSProperties}>
                  <circle cx="118" cy="168" r="3" fill="#fff7d8"/>
                  <circle cx="300" cy="92" r="3" fill="#b58cff"/>
                  <circle cx="424" cy="238" r="3" fill="#7ce8ff"/>
                </g>
                <g opacity=".76">
                  <circle className="akash-particle" style={{ "--dur": "6.8s" } as React.CSSProperties} cx="104" cy="92" r="1.6" fill="#d7f7ff"/>
                  <circle className="akash-particle" style={{ "--dur": "7.6s" } as React.CSSProperties} cx="424" cy="238" r="1.5" fill="#7ce8ff"/>
                  <circle className="akash-particle" style={{ "--dur": "8.4s" } as React.CSSProperties} cx="452" cy="90" r="1.3" fill="#fff7d8"/>
                  <circle className="akash-particle" style={{ "--dur": "9s" } as React.CSSProperties} cx="150" cy="260" r="1.2" fill="#f2d88a"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="akas-copy">
            <Link className="akas-link" href="/granth">
              <h2 className="akas-title" >{t.smriti.title}</h2>
              <p className="akas-desc" >{t.smriti.desc}</p>
              <span className="akas-card-footer"><span className="akas-link-line">{t.enter}</span><span>{t.granth}</span></span>
            </Link>
          </div>
        </article>
      </section>
    </div>
  </main>
    </>
  );
}
