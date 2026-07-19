
// Removed ts-nocheck
/* eslint-disable */
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/config/language";
import "./AkasGranthPreview.css";

const granthTranslations = {
  en: {
    eyebrow: "AKAS GRANTH",
    heading: "Every orbit holds a question.",
    support: "Enter a living archive of planets, eclipses, stars, Moon phases, mysteries, cycles, and missions.",
    planetLabel: "Orbital scene",
    planetTitle: "Planets and Grah",
    planetDescription: "Explore planetary worlds while distinguishing cultural grah traditions from modern astronomy.",
    eclipseLabel: "Alignment simulator",
    eclipseTitle: "Eclipses and Rahu-Ketu",
    eclipseDescription: "Compare cultural eclipse narratives with the science of Sun, Earth, and Moon alignment.",
    starsLabel: "Constellation field",
    starsTitle: "Nakshatra and Stars",
    starsDescription: "Trace traditional sky patterns beside scientific constellations, stellar distance, and motion.",
    explore: "Explore topic",
    ask: "Ask about this",
    dragHint: "Drag to turn the living archive",
    ctaSupport: "Follow the celestial paths into the complete knowledge archive.",
    cta: "Open Akas Granth"
  },
  hi: {
    eyebrow: "आकाश ग्रंथ",
    heading: "हर कक्षा में एक प्रश्न है।",
    support: "ग्रहों, ग्रहणों, तारों, चंद्र कलाओं, रहस्यों, चक्रों और अभियानों के जीवंत संग्रह में प्रवेश करें।",
    planetLabel: "कक्षीय दृश्य",
    planetTitle: "ग्रह और प्लैनेट्स",
    planetDescription: "सांस्कृतिक ग्रह परंपराओं और आधुनिक खगोल विज्ञान के अंतर को समझें।",
    eclipseLabel: "संरेखण दृश्य",
    eclipseTitle: "ग्रहण और राहु-केतु",
    eclipseDescription: "सांस्कृतिक कथाओं की तुलना सूर्य, पृथ्वी और चंद्रमा के वैज्ञानिक संरेखण से करें।",
    starsLabel: "तारामंडल क्षेत्र",
    starsTitle: "नक्षत्र और तारे",
    starsDescription: "पारंपरिक आकाश-रूपों के साथ तारों की दूरी, गति और वैज्ञानिक नक्षत्र समझें।",
    explore: "विषय देखें",
    ask: "इसके बारे में पूछें",
    dragHint: "जीवंत संग्रह घुमाने के लिए खींचें",
    ctaSupport: "पूर्ण ज्ञान-संग्रह तक पहुँचने के लिए आकाशीय पथों का अनुसरण करें।",
    cta: "आकाश ग्रंथ खोलें"
  },
  hinglish: {
    eyebrow: "AKAS GRANTH",
    heading: "Har orbit mein ek sawaal hai.",
    support: "Planets, eclipses, stars, Moon phases, mysteries, cycles aur missions ke living archive mein aaiye.",
    planetLabel: "Orbital scene",
    planetTitle: "Planets aur Grah",
    planetDescription: "Grah traditions aur modern astronomy ko clearly alag samajhte hue worlds explore karein.",
    eclipseLabel: "Alignment simulator",
    eclipseTitle: "Eclipses aur Rahu-Ketu",
    eclipseDescription: "Cultural narratives ko Sun, Earth aur Moon alignment ki science se compare karein.",
    starsLabel: "Constellation field",
    starsTitle: "Nakshatra aur Stars",
    starsDescription: "Traditional sky patterns ke saath stellar distance, motion aur constellations trace karein.",
    explore: "Topic explore karein",
    ask: "Iske baare mein poochhein",
    dragHint: "Living archive ghumane ke liye drag karein",
    ctaSupport: "Complete knowledge archive tak celestial paths ko follow karein.",
    cta: "Akas Granth kholen"
  },
  "hi-en": {
    eyebrow: "आकाश ग्रंथ · AKAS GRANTH",
    heading: "हर orbit में एक question है।",
    support: "ग्रह, eclipses, stars, Moon phases, रहस्य, cycles और missions का living archive.",
    planetLabel: "कक्षीय · Orbital",
    planetTitle: "ग्रह · Planets",
    planetDescription: "ग्रह traditions और modern astronomy के स्पष्ट अंतर के साथ worlds खोजें।",
    eclipseLabel: "संरेखण · Alignment",
    eclipseTitle: "ग्रहण · Rahu-Ketu",
    eclipseDescription: "Cultural narratives की तुलना Sun–Earth–Moon alignment की science से करें।",
    starsLabel: "तारामंडल · Constellation",
    starsTitle: "नक्षत्र · Stars",
    starsDescription: "Traditional patterns के साथ stellar distance, motion और constellations समझें।",
    explore: "विषय खोलें · Explore",
    ask: "पूछें · Ask",
    dragHint: "खींचें · Drag to rotate",
    ctaSupport: "Celestial paths से complete knowledge archive में प्रवेश करें।",
    cta: "आकाश ग्रंथ खोलें · Open"
  }
};

export function AkasGranthPreview() {
  const { language } = useLanguage();
  const t = granthTranslations[language] || granthTranslations.en;

  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current || !canvasRef.current || !stageRef.current) return;
    
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isCoarse = window.matchMedia("(pointer: coarse)");
    
    let dragging = false;
    let horizontalIntent = false;
    let startX = 0;
    let startY = 0;
    let startRotation = 0;
    let rotation = 0;
    let pointerId: number | null = null;


    const setRotation = (value: number) => {

      rotation = value;
      root.style.setProperty("--archive-drag-y", rotation + "deg");
    };

    const handlePointerMove = (event: PointerEvent) => {

      if (dragging && pointerId === event.pointerId) {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (!horizontalIntent && Math.abs(dx) > 7) {
          horizontalIntent = Math.abs(dx) > Math.abs(dy) * 1.15;
          if (horizontalIntent) {
            try { stage.setPointerCapture(event.pointerId); } catch (_) {}
          }
        }

        if (horizontalIntent) {
          event.preventDefault();
          setRotation(startRotation + dx * .55);
        }
        return;
      }

      if (!isCoarse.matches && !reduceMotion.matches) {
        const rect = stage.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - .5;
        const ny = (event.clientY - rect.top) / rect.height - .5;
        root.style.setProperty("--archive-tilt-y", (nx * 13) + "deg");
        root.style.setProperty("--archive-tilt-x", (-5 - ny * 8) + "deg");
        root.style.setProperty("--pointer-x", ((nx + .5) * 100) + "%");
        root.style.setProperty("--pointer-y", ((ny + .5) * 100) + "%");
      }
    };

    const handlePointerDown = (event: PointerEvent) => {

      if (reduceMotion.matches) return;
      dragging = true;
      horizontalIntent = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startRotation = rotation;
    };

    const endDrag = (event: PointerEvent) => {

      if (event.pointerId !== pointerId) return;
      dragging = false;
      horizontalIntent = false;
      pointerId = null;
      try { stage.releasePointerCapture(event.pointerId); } catch (_) {}
    };

    const handlePointerLeave = () => {
      if (!dragging && !isCoarse.matches && !reduceMotion.matches) {
        root.style.setProperty("--archive-tilt-x", "-5deg");
        root.style.setProperty("--archive-tilt-y", "0deg");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (reduceMotion.matches) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setRotation(rotation + (event.key === "ArrowLeft" ? -15 : 15));
      }
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerdown", handlePointerDown);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("pointerleave", handlePointerLeave);
    stage.addEventListener("keydown", handleKeyDown);

    type Star = {
      x: number;
      y: number;
      r: number;
      a: number;
      v: number;
      drift: number;
      gold: boolean;
    };

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;

    function resizeCanvas() {
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(150, Math.max(55, Math.floor((width * height) / 12500)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.15 + .18,
        a: Math.random() * .6 + .18,
        v: Math.random() * .055 + .012,
        drift: (Math.random() - .5) * .018,
        gold: Math.random() > .91
      }));
    }

    function drawStars(time = 0) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        if (!reduceMotion.matches) {
          star.y -= star.v;
          star.x += star.drift;
          if (star.y < -3) star.y = height + 3;
          if (star.x < -3) star.x = width + 3;
          if (star.x > width + 3) star.x = -3;
        }

        const shimmer = reduceMotion.matches ? 1 : .78 + Math.sin(time * .0012 + star.x) * .22;
        ctx.beginPath();
        ctx.fillStyle = star.gold
          ? "rgba(239, 204, 133, " + (star.a * shimmer) + ")"
          : "rgba(202, 224, 239, " + (star.a * shimmer) + ")";
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion.matches) {
        animationFrame = requestAnimationFrame(drawStars);
      }
    }

    resizeCanvas();
    drawStars();

    let resizeTimer: NodeJS.Timeout | undefined;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        resizeCanvas();
        drawStars();
      }, 120);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const motionHandler = () => {
      cancelAnimationFrame(animationFrame);
      drawStars();
    };
    reduceMotion.addEventListener?.("change", motionHandler);

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerdown", handlePointerDown);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      stage.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      reduceMotion.removeEventListener?.("change", motionHandler);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>

    <section ref={rootRef} className="akg-akg-archive-preview" aria-labelledby="granth-title">
      <div className="akg-cosmic-clip" aria-hidden="true"></div>
      <canvas ref={canvasRef} id="akg-starfield" aria-hidden="true"></canvas>

      <div className="akg-archive-shell">
        <header className="akg-section-header">
          <div>
            <p className="akg-eyebrow" >{t.eyebrow}</p>
            <h1 id="granth-title" >{t.heading}</h1>
            <p className="akg-support" >{t.support}</p>
          </div>

          
        </header>

        <div className="akg-experience">
          <svg className="akg-celestial-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="connectionGradient" x1="0" x2="1">
                <stop offset="0" stopColor="#73c9dd" stopOpacity=".12"/>
                <stop offset=".5" stopColor="#e0b866" stopOpacity=".85"/>
                <stop offset="1" stopColor="#73c9dd" stopOpacity=".12"/>
              </linearGradient>
            </defs>
            <path d="M49 49 C36 39 28 27 16 24"/>
            <path d="M51 48 C65 37 73 27 85 24"/>
            <path d="M52 53 C67 62 76 70 86 78"/>
            <circle cx="49" cy="49" r=".8"/>
            <circle cx="16" cy="24" r=".45"/>
            <circle cx="85" cy="24" r=".45"/>
            <circle cx="86" cy="78" r=".45"/>
          </svg>

          <article className="akg-topic topic--planet">
            <span className="akg-scene-label" >{t.planetLabel}</span>
            <div className="akg-mini-scene" aria-hidden="true">
              <div className="akg-planet-system">
                <div className="akg-planet-ring"></div>
                <div className="akg-planet"></div>
                <div className="akg-planet-moon"></div>
                <div className="akg-planet-dust"></div>
              </div>
            </div>
            <h2 >{t.planetTitle}</h2>
            <p >{t.planetDescription}</p>
            <div className="akg-topic-actions">
              <Link className="akg-topic-link" href="/granth#planets" >{t.explore}</Link>
              <Link className="akg-ask-link" href="/ask?topic=planets" >{t.ask}</Link>
            </div>
          </article>

          <div className="akg-archive-column">
            <div className="akg-archive-halo" aria-hidden="true"></div>
            <div ref={stageRef} className="akg-akg-archive-stage" id="akg-archiveStage" tabIndex={0} role="img" aria-label="Interactive floating celestial knowledge archive. Drag horizontally to rotate.">
              <div className="akg-archive-tilt">
                <div className="akg-archive-model" aria-hidden="true">
                  <div className="akg-slab s1"></div>
                  <div className="akg-slab s2"></div>
                  <div className="akg-slab s3"></div>
                  <div className="akg-slab s4"></div>
                  <div className="akg-slab s5"></div>
                  <div className="akg-slab s6"></div>

                  <div className="akg-binding-ring r1"></div>
                  <div className="akg-binding-ring r2"></div>
                  <div className="akg-binding-ring r3"></div>

                  <div className="akg-glyph g1"></div>
                  <div className="akg-glyph g2"></div>
                  <div className="akg-glyph g3"></div>
                  <div className="akg-glyph g4"></div>

                  <div className="akg-archive-core"></div>

                  <div className="akg-fragment f1"></div>
                  <div className="akg-fragment f2"></div>
                  <div className="akg-fragment f3"></div>
                  <div className="akg-fragment f4"></div>
                </div>
              </div>
              <span className="akg-archive-caption" >{t.dragHint}</span>
            </div>
          </div>

          <article className="akg-topic topic--eclipse">
            <span className="akg-scene-label" >{t.eclipseLabel}</span>
            <div className="akg-mini-scene" aria-hidden="true">
              <div className="akg-eclipse-system">
                <div className="akg-alignment-line"></div>
                <div className="akg-sun"></div>
                <div className="akg-moon-orbit"></div>
                <div className="akg-eclipse-earth"></div>
                <div className="akg-eclipse-shadow"></div>
                <div className="akg-eclipse-moon"></div>
              </div>
            </div>
            <h2 >{t.eclipseTitle}</h2>
            <p >{t.eclipseDescription}</p>
            <div className="akg-topic-actions">
              <Link className="akg-topic-link" href="/granth#eclipses" >{t.explore}</Link>
              <Link className="akg-ask-link" href="/ask?topic=eclipses" >{t.ask}</Link>
            </div>
          </article>

          <article className="akg-topic topic--stars">
            <span className="akg-scene-label" >{t.starsLabel}</span>
            <div className="akg-mini-scene" aria-hidden="true">
              <svg className="akg-constellation" viewBox="0 0 190 130">
                <path className="path" d="M17 92 L46 53 L77 72 L106 32 L137 54 L174 20"/>
                <path className="path gold" d="M46 53 L71 20 L106 32 L121 95 L154 109"/>
                <path className="path" d="M17 92 L58 108 L121 95 L137 54 L174 72"/>
                <circle className="far" cx="17" cy="92" r="2.2"/>
                <circle cx="46" cy="53" r="3"/>
                <circle className="gold" cx="71" cy="20" r="3.7"/>
                <circle cx="77" cy="72" r="2.4"/>
                <circle className="gold" cx="106" cy="32" r="4"/>
                <circle cx="121" cy="95" r="2.8"/>
                <circle className="gold" cx="137" cy="54" r="3.2"/>
                <circle className="far" cx="154" cy="109" r="2"/>
                <circle cx="174" cy="20" r="2.6"/>
                <circle className="far" cx="174" cy="72" r="1.8"/>
                <circle className="far" cx="58" cy="108" r="1.8"/>
              </svg>
            </div>
            <h2 >{t.starsTitle}</h2>
            <p >{t.starsDescription}</p>
            <div className="akg-topic-actions">
              <Link className="akg-topic-link" href="/granth#stars" >{t.explore}</Link>
              <Link className="akg-ask-link" href="/ask?topic=stars" >{t.ask}</Link>
            </div>
          </article>

          <aside className="akg-action-panel" aria-label="Open the complete archive">
            <p className="akg-action-kicker" >{t.ctaSupport}</p>
            <Link className="akg-primary-cta" href="/granth" >{t.cta}</Link>
          </aside>
        </div>
      </div>
    </section>

    </>
  );
}
