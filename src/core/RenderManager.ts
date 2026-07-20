import * as THREE from "three";

/**
 * RenderManager centralizes all requestAnimationFrame calls across the application.
 * It uses IntersectionObserver to pause rendering when a canvas is offscreen,
 * and allows for shader pre-warming.
 */

type RenderCallback = (dt: number, elapsed: number) => void;

interface RenderJob {
  id: string;
  callback: RenderCallback;
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  isVisible: boolean;
  priority: number;
}

class GlobalRenderManager {
  private jobs: Map<string, RenderJob> = new Map();
  private observer: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private lastTime: number = 0;
  private elapsed: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      // Create the observer
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const canvas = entry.target as HTMLCanvasElement;
            const jobId = canvas.dataset.renderId;
            if (jobId && this.jobs.has(jobId)) {
              this.jobs.get(jobId)!.isVisible = entry.isIntersecting;
            }
          });
        },
        {
          rootMargin: "200px", // Pre-render slightly before it comes into view
        }
      );
    }
  }

  /**
   * Register a component to the global render loop.
   */
  public register(
    id: string,
    canvas: HTMLCanvasElement,
    renderer: THREE.WebGLRenderer,
    callback: RenderCallback,
    scene?: THREE.Scene,
    camera?: THREE.Camera,
    priority: number = 1
  ) {
    if (this.jobs.has(id)) {
      console.warn(`RenderManager: Job ${id} is already registered.`);
      return;
    }

    canvas.dataset.renderId = id;
    this.jobs.set(id, {
      id,
      callback,
      canvas,
      renderer,
      scene,
      camera,
      isVisible: true, // Optimistically true until observed
      priority,
    });

    if (this.observer) {
      this.observer.observe(canvas);
    }

    // Eagerly precompile shaders to prevent stutter on first frame
    if (scene && camera) {
      try {
        renderer.compile(scene, camera);
      } catch (e) {
        console.warn("RenderManager: Failed to precompile scene", e);
      }
    }

    this.start();
  }

  public unregister(id: string) {
    const job = this.jobs.get(id);
    if (job && this.observer) {
      this.observer.unobserve(job.canvas);
    }
    this.jobs.delete(id);

    if (this.jobs.size === 0) {
      this.stop();
    }
  }

  private start() {
    if (this.rafId === null) {
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (currentTime: number) => {
    this.rafId = requestAnimationFrame(this.tick);

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Clamp dt to max 100ms
    this.lastTime = currentTime;
    this.elapsed += dt;

    // Sort by priority if needed, but usually we just iterate
    for (const job of this.jobs.values()) {
      if (job.isVisible) {
        job.callback(dt, this.elapsed);
      }
    }
  };
}

// Export singleton
export const RenderManager = new GlobalRenderManager();
