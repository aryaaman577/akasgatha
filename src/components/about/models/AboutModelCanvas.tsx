"use client";

import { useEffect, useRef } from "react";
import { aboutRuntime } from "./runtime";

export function AboutModelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      aboutRuntime.init(canvasRef.current);
    }
    return () => {
      aboutRuntime.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 2, // Layered behind text (which should be 3) but above backgrounds (1)
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        tabIndex={-1}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
