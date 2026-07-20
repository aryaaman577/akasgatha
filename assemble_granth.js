const fs = require('fs');
let jsx = fs.readFileSync('C:/Users/amang/Desktop/akashgatha/granth_jsx.txt', 'utf8');

const prefix = `"use client";
/* eslint-disable */
// @ts-nocheck

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
    let pointerId = null;

    const setRotation = (value) => {
      rotation = value;
      root.style.setProperty("--archive-drag-y", rotation + "deg");
    };

    const handlePointerMove = (event) => {
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

    const handlePointerDown = (event) => {
      if (reduceMotion.matches) return;
      dragging = true;
      horizontalIntent = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      startRotation = rotation;
    };

    const endDrag = (event) => {
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

    const handleKeyDown = (event) => {
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

    let stars = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;

    function resizeCanvas() {
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

    let resizeTimer;
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
`;

const suffix = `
    </>
  );
}
`;

// Run replacements on JSX
let slabCount = 1;
jsx = jsx
  .replace(/<section className="archive-preview"/, '<section ref={rootRef} className="akg-archive-preview"')
  .replace(/<canvas id="starfield"/, '<canvas ref={canvasRef} id="akg-starfield"')
  .replace(/<div className="archive-stage" id="archiveStage"/, '<div ref={stageRef} className="akg-archive-stage" id="akg-archiveStage"')
  .replace(/className="(?!path|far|gold)([a-zA-Z0-9_-]+)(.*?"|\s)/g, (match, p1, p2) => 'className="akg-' + p1 + p2)
  .replace(/className="akg-path/g, 'className="path')
  .replace(/className="akg-far/g, 'className="far')
  .replace(/className="akg-gold/g, 'className="gold')
  .replace(/className="akg-path gold/g, 'className="path gold')
  .replace(/className="akg-slab"/g, () => 'className="akg-slab s' + (slabCount++) + '"')
  .replace(/data-copy="eyebrow">[^<]+<\/p>/, '>{t.eyebrow}</p>')
  .replace(/data-copy="heading">[^<]+<\/h1>/, '>{t.heading}</h1>')
  .replace(/data-copy="support">[^<]+<\/p>/, '>{t.support}</p>')
  .replace(/data-copy="planetLabel">[^<]+<\/span>/, '>{t.planetLabel}</span>')
  .replace(/data-copy="planetTitle">[^<]+<\/h2>/, '>{t.planetTitle}</h2>')
  .replace(/data-copy="planetDescription">[^<]+<\/p>/, '>{t.planetDescription}</p>')
  .replace(/data-copy="eclipseLabel">[^<]+<\/span>/, '>{t.eclipseLabel}</span>')
  .replace(/data-copy="eclipseTitle">[^<]+<\/h2>/, '>{t.eclipseTitle}</h2>')
  .replace(/data-copy="eclipseDescription">[^<]+<\/p>/, '>{t.eclipseDescription}</p>')
  .replace(/data-copy="starsLabel">[^<]+<\/span>/, '>{t.starsLabel}</span>')
  .replace(/data-copy="starsTitle">[^<]+<\/h2>/, '>{t.starsTitle}</h2>')
  .replace(/data-copy="starsDescription">[^<]+<\/p>/, '>{t.starsDescription}</p>')
  .replace(/data-copy="explore"[^>]*>[^<]+<\/a>/g, '>{t.explore}</a>')
  .replace(/data-copy="ask"[^>]*>[^<]+<\/a>/g, '>{t.ask}</a>')
  .replace(/data-copy="dragHint">[^<]+<\/span>/, '>{t.dragHint}</span>')
  .replace(/data-copy="ctaSupport">[^<]+<\/p>/, '>{t.ctaSupport}</p>')
  .replace(/data-copy="cta"[^>]*>[^<]+<\/a>/, '>{t.cta}</a>')
  .replace(/<a className="akg-topic-link" href="([^"]+)">/g, '<Link className="akg-topic-link" href="$1">')
  .replace(/<a className="akg-ask-link" href="([^"]+)">/g, '<Link className="akg-ask-link" href="$1">')
  .replace(/<a className="akg-primary-cta" href="([^"]+)">/g, '<Link className="akg-primary-cta" href="$1">')
  .replace(/<\/a>/g, '</Link>');

fs.writeFileSync('C:/Users/amang/Desktop/akashgatha/src/components/landing/AkasGranthPreview.tsx', prefix + jsx + suffix);
console.log('Done!');
