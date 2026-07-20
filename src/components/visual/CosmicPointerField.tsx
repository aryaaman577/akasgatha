"use client";

import React, { useEffect, useRef } from "react";

export function CosmicPointerField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const pointer = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Ensure we only emit particles when hovering empty areas, not over UI/Models
      const isUI = target.closest('a, button, p, h1, h2, h3, h4, h5, h6, canvas, .glow-card, .akas-card, svg');
      
      if (isUI) {
        pointer.active = false;
        return;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      isShootingStar: boolean;
      trail: {x: number, y: number}[];
    }
    const particles: Particle[] = [];

    const colors = ["#bda56a", "#7759d9", "#557cd6", "#d8dce9"];


    let frameId: number;

    const spawnParticles = () => {
       if (mq.matches || !pointer.active) return;
       // Add stardust
       if (Math.random() > 0.3) {
         particles.push({
           x: pointer.x + (Math.random() - 0.5) * 40,
           y: pointer.y + (Math.random() - 0.5) * 40,
           vx: (Math.random() - 0.5) * 1.5,
           vy: (Math.random() - 0.5) * 1.5 - 0.5,
           life: 0,
           maxLife: 40 + Math.random() * 50,
           size: 0.5 + Math.random() * 1.5,
           color: colors[Math.floor(Math.random() * colors.length)],
           isShootingStar: false,
           trail: []
         });
       }
       // Occasional shooting star
       if (Math.random() > 0.96) {
         particles.push({
           x: pointer.x + (Math.random() - 0.5) * 60,
           y: pointer.y + (Math.random() - 0.5) * 60,
           vx: (Math.random() - 0.5) * 6,
           vy: -2 - Math.random() * 4,
           life: 0,
           maxLife: 25 + Math.random() * 20,
           size: 1 + Math.random() * 1.5,
           color: "#ffffff",
           isShootingStar: true,
           trail: []
         });
       }
       pointer.active = false;
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      spawnParticles();

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.isShootingStar) {
          p.vy -= 0.05; // slight upward curve
          p.trail.push({x: p.x, y: p.y});
          if (p.trail.length > 8) p.trail.shift();
          
          ctx.beginPath();
          if (p.trail.length > 0) {
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let j = 1; j < p.trail.length; j++) {
              ctx.lineTo(p.trail[j].x, p.trail[j].y);
            }
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - p.life / p.maxLife)})`;
          ctx.lineWidth = p.size;
          ctx.stroke();
          
          // Head glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - p.life / p.maxLife)})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, (1 - p.life / p.maxLife)) * 0.8;
          ctx.fill();
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none" 
      style={{ zIndex: 10 }} 
      aria-hidden="true" 
    />
  );
}
