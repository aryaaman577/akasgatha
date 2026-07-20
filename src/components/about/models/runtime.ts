"use client";

import * as THREE from "three";
import { type AboutModelInstance } from "./types";

interface RegisteredModel {
  id: string;
  element: HTMLElement;
  instance: AboutModelInstance;
  rect: DOMRect | null;
  isVisible: boolean;
}

class AboutModelRuntime {
  public renderer: THREE.WebGLRenderer | null = null;
  private models: Map<string, RegisteredModel> = new Map();
  private animationFrameId: number | null = null;
  private clock = new THREE.Clock();
  private canvas: HTMLCanvasElement | null = null;
  
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private needsRectUpdate = true;

  init(canvas: HTMLCanvasElement) {
    if (this.renderer) return;

    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    
    // Transparent clearing
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = false;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize();
      this.needsRectUpdate = true;
    });
    this.resizeObserver.observe(document.body);

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("data-model-id");
        if (id && this.models.has(id)) {
          this.models.get(id)!.isVisible = entry.isIntersecting;
        }
      });
    }, { rootMargin: "300px" });

    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });

    this.updateCanvasSize();
    this.startLoop();
  }

  private onScroll = () => {
    this.needsRectUpdate = true;
  };

  private onResize = () => {
    this.needsRectUpdate = true;
    this.updateCanvasSize();
  };

  private updateCanvasSize() {
    if (!this.renderer || !this.canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
  }

  register(id: string, element: HTMLElement, instance: AboutModelInstance) {
    this.models.set(id, { id, element, instance, rect: null, isVisible: false });
    element.setAttribute("data-model-id", id);
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
    this.needsRectUpdate = true;
  }

  unregister(id: string) {
    const model = this.models.get(id);
    if (model) {
      if (this.intersectionObserver) {
        this.intersectionObserver.unobserve(model.element);
      }
      model.instance.dispose();
      this.models.delete(id);
    }
  }

  private startLoop() {
    if (this.animationFrameId !== null) return;
    
    const loop = () => {
      this.animationFrameId = requestAnimationFrame(loop);
      this.render();
    };
    loop();
  }

  private render() {
    if (!this.renderer || !this.canvas) return;

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    const pixelRatio = this.renderer.getPixelRatio();
    const viewportHeight = this.canvas.clientHeight;

    // Clear complete canvas once per frame
    this.renderer.setScissorTest(false);
    this.renderer.clear();

    if (this.needsRectUpdate) {
      this.models.forEach(model => {
        model.rect = model.element.getBoundingClientRect();
      });
      this.needsRectUpdate = false;
    }

    this.renderer.setScissorTest(true);

    this.models.forEach(model => {
      if (!model.isVisible || !model.rect) return;

      const rect = model.rect;
      
      // Calculate scissor rect coordinates (WebGL has bottom-left origin)
      const x = rect.left;
      const y = viewportHeight - rect.bottom;
      const width = rect.width;
      const height = rect.height;

      // Ensure the model stage is somewhat on-screen
      if (
        x + width < 0 || x > window.innerWidth ||
        y + height < 0 || y > viewportHeight
      ) {
        return;
      }

      // Math for physical pixels
      const scissorX = Math.floor(x * pixelRatio);
      const scissorY = Math.floor(y * pixelRatio);
      const scissorW = Math.floor(width * pixelRatio);
      const scissorH = Math.floor(height * pixelRatio);

      // Clamp to prevent WebGL warnings if elements go offscreen
      if (scissorW <= 0 || scissorH <= 0) return;

      this.renderer!.setViewport(scissorX, scissorY, scissorW, scissorH);
      this.renderer!.setScissor(scissorX, scissorY, scissorW, scissorH);

      // Update aspect ratio if resized
      if (model.instance.camera.aspect !== width / height) {
        model.instance.camera.aspect = width / height;
        model.instance.camera.updateProjectionMatrix();
      }

      // Animate
      model.instance.update(delta, elapsed);

      // Render scene
      this.renderer!.render(model.instance.scene, model.instance.camera);
    });
  }

  dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();

    this.models.forEach(model => model.instance.dispose());
    this.models.clear();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}

// Global singleton instance
export const aboutRuntime = new AboutModelRuntime();
