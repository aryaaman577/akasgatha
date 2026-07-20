import React, { useRef, useState, useEffect, useCallback } from "react";
import { InteractiveSpaceModel } from "./InteractiveSpaceModel";

export function OrbitHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Store all dynamic state in refs
  const state = useRef({
    idle: 0,
    pointerX: 0,
    pointerY: 0,
    currPointerX: 0,
    currPointerY: 0,
    isDragging: false,
    dragStart: 0,
    dragYaw: 0,
  });

  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* Local RAF loop for DOM mutation */
  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    let rafId: number;
    let lastTime = performance.now();
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { rootMargin: "200px" });
    observer.observe(containerRef.current);

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      const s = state.current;

      if (!reducedMotion) {
        if (!s.isDragging) {
          s.idle += 0.25;
        }

        // Dampen pointer rotation
        s.currPointerX += (s.pointerX - s.currPointerX) * 0.1;
        s.currPointerY += (s.pointerY - s.currPointerY) * 0.1;
      }

      const tiltX = s.currPointerY * -12;
      const tiltY = s.idle * 0.25 + s.currPointerX * 18;

      innerRef.current!.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      containerRef.current!.style.setProperty("--idle", String(s.idle));
      // Specifically for ring tilt
      containerRef.current!.style.setProperty("--tiltY", String(tiltY * 0.3));
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [reducedMotion]);

  /* Mouse & Touch Handlers (passive & ref-based) */
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (reducedMotion || !containerRef.current) return;

    if (state.current.isDragging) {
      const dx = e.clientX - state.current.dragStart;
      state.current.idle = (state.current.dragYaw + dx * 0.5) / 0.25;
    } else {
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      state.current.pointerX = nx;
      state.current.pointerY = ny;
    }
  }, [reducedMotion]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (reducedMotion) return;
    state.current.isDragging = true;
    state.current.dragStart = e.clientX;
    state.current.dragYaw = state.current.idle * 0.25;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  }, [reducedMotion]);

  const onPointerUp = useCallback(() => {
    state.current.isDragging = false;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  }, []);

  const onPointerLeave = useCallback(() => {
    state.current.isDragging = false;
    state.current.pointerX = 0;
    state.current.pointerY = 0;
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex aspect-square w-full max-w-[500px] items-center justify-center lg:max-w-none lg:h-[500px] cursor-grab"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-cosmic-blue)]/20 to-[var(--color-antique-gold)]/10 blur-3xl" aria-hidden="true" />

      {/* Main Interactive Model */}
      <div ref={innerRef} className="relative h-full w-full z-10 will-change-transform">
        <InteractiveSpaceModel
          variant="cosmic_gate"
          aria-label="Interactive 3D cosmic gate"
        />
      </div>

      {/* Decorative Frame */}
      <div className="pointer-events-none absolute inset-4 rounded-full border border-[var(--color-ivory)]/5 shadow-[inset_0_0_60px_rgba(35,52,92,0.3)]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--color-ivory)]/0 via-[var(--color-ivory)]/20 to-[var(--color-ivory)]/0" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-[var(--color-ivory)]/0 via-[var(--color-ivory)]/20 to-[var(--color-ivory)]/0" aria-hidden="true" />
    </div>
  );
}
