const fs = require('fs');
const jsx = fs.readFileSync('C:/Users/amang/Desktop/akashgatha/src/components/landing/FeatureGridJSX.txt', 'utf8');

const code = `"use client";

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
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const root = sectionRef.current;
    
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isSmall = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;

    const revealItems = Array.from(root.querySelectorAll(".akas-reveal"));
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

    const cards = Array.from(root.querySelectorAll(".akas-dwar-card"));
    const shells = Array.from(root.querySelectorAll(".akas-model-shell"));
    let rafId = null;

    function setView(el, x, y) {
      const rx = Math.max(-1, Math.min(1, y));
      const ry = Math.max(-1, Math.min(1, x));
      el.style.setProperty("--mx", Math.round((x + 1) * 50) + "%");
      el.style.setProperty("--my", Math.round((y + 1) * 50) + "%");
      el.style.setProperty("--tilt-x", (ry * 4.2).toFixed(2) + "deg");
      el.style.setProperty("--tilt-y", (-rx * 4.2).toFixed(2) + "deg");
    }

    function resetView(el) {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "38%");
    }

    function updateViewFromPointer(el, event) {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      setView(el, x, y);
    }

    cards.forEach((card) => {
      const shell = card.querySelector(".akas-model-shell");
      
      const handlePointerMove = (event) => {
        if (prefersReduced) return;
        if (event.pointerType === "touch") return;
        updateViewFromPointer(card, event);
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
      const activeCard = shell.closest(".akas-dwar-card");

      const handlePointerDown = (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        if (shell.setPointerCapture) shell.setPointerCapture(event.pointerId);
        shell.classList.add("is-active");
      };

      const handlePointerMove = (event) => {
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

      const endDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        shell.classList.remove("is-active");
        try {
          if (shell.releasePointerCapture) shell.releasePointerCapture(event.pointerId);
        } catch (e) {}
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
      const animEls = root.querySelectorAll(".akash-spin, .akash-spin-rev, .akash-orbit, .akash-orbit-rev, .akash-sweep, .akash-particle, .akash-flicker, .akash-drift");
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
      ` + jsx
        .replace(/<main/, '<main ref={sectionRef}')
        .replace(/data-i18n="heading">[^<]+<\/h1>/, '>{t.heading}</h1>')
        .replace(/data-i18n="support">[^<]+<\/p>/, '>{t.support}</p>')
        .replace(/data-i18n="katha.title">[^<]+<\/h2>/, '>{t.katha.title}</h2>')
        .replace(/data-i18n="katha.desc">[^<]+<\/p>/, '>{t.katha.desc}</p>')
        .replace(/data-i18n="rahasya.title">[^<]+<\/h2>/, '>{t.rahasya.title}</h2>')
        .replace(/data-i18n="rahasya.desc">[^<]+<\/p>/, '>{t.rahasya.desc}</p>')
        .replace(/data-i18n="vigyan.title">[^<]+<\/h2>/, '>{t.vigyan.title}</h2>')
        .replace(/data-i18n="vigyan.desc">[^<]+<\/p>/, '>{t.vigyan.desc}</p>')
        .replace(/data-i18n="satya.title">[^<]+<\/h2>/, '>{t.satya.title}</h2>')
        .replace(/data-i18n="satya.desc">[^<]+<\/p>/, '>{t.satya.desc}</p>')
        .replace(/data-i18n="pramaan.title">[^<]+<\/h2>/, '>{t.pramaan.title}</h2>')
        .replace(/data-i18n="pramaan.desc">[^<]+<\/p>/, '>{t.pramaan.desc}</p>')
        .replace(/data-i18n="drishya.title">[^<]+<\/h2>/, '>{t.drishya.title}</h2>')
        .replace(/data-i18n="drishya.desc">[^<]+<\/p>/, '>{t.drishya.desc}</p>')
        .replace(/data-i18n="jigyasa.title">[^<]+<\/h2>/, '>{t.jigyasa.title}</h2>')
        .replace(/data-i18n="jigyasa.desc">[^<]+<\/p>/, '>{t.jigyasa.desc}</p>')
        .replace(/data-i18n="smriti.title">[^<]+<\/h2>/, '>{t.smriti.title}</h2>')
        .replace(/data-i18n="smriti.desc">[^<]+<\/p>/, '>{t.smriti.desc}</p>')
        
        .replace(/data-i18n="label.katha">[^<]+<\/div>/, '>{t.label.katha}</div>')
        .replace(/data-i18n="label.rahasya">[^<]+<\/div>/, '>{t.label.rahasya}</div>')
        .replace(/data-i18n="label.vigyan">[^<]+<\/div>/, '>{t.label.vigyan}</div>')
        .replace(/data-i18n="label.satya">[^<]+<\/div>/, '>{t.label.satya}</div>')
        .replace(/data-i18n="label.pramaan">[^<]+<\/div>/, '>{t.label.pramaan}</div>')
        .replace(/data-i18n="label.drishya">[^<]+<\/div>/, '>{t.label.drishya}</div>')
        .replace(/data-i18n="label.jigyasa">[^<]+<\/div>/, '>{t.label.jigyasa}</div>')
        .replace(/data-i18n="label.smriti">[^<]+<\/div>/, '>{t.label.smriti}</div>')
        
        .replace(/<span className="akas-link-line" data-i18n="enter">[^<]+<\/span>/g, '<span className="akas-link-line">{t.enter}</span>')
        .replace(/<span data-i18n="granth">[^<]+<\/span>/g, '<span>{t.granth}</span>')
        .replace(/<span data-i18n="ask">[^<]+<\/span>/g, '<span>{t.ask}</span>')
        .replace(/<span data-i18n="about">[^<]+<\/span>/g, '<span>{t.about}</span>')
        .replace(/<a className="akas-link" href="([^"]+)">/g, '<Link className="akas-link" href="$1">')
        .replace(/<\/a>/g, '</Link>')
      + `
    </>
  );
}
`;

fs.writeFileSync('C:/Users/amang/Desktop/akashgatha/src/components/landing/FeatureGrid.tsx', code);
console.log('FeatureGrid.tsx created successfully');
