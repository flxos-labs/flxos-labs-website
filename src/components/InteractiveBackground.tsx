"use client";

import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbFromCssColor(raw: string): [number, number, number] {
  // Handle rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = raw.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
  );
  if (rgbMatch) {
    return [+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]];
  }
  // Handle hex
  if (raw.startsWith("#")) return hexToRgb(raw);
  return [180, 180, 180]; // fallback grey
}

function readAccentColors(): [number, number, number][] {
  const style = getComputedStyle(document.documentElement);
  return [
    rgbFromCssColor(style.getPropertyValue("--accent").trim() || "#e76f51"),
    rgbFromCssColor(style.getPropertyValue("--accent-2").trim() || "#2a9d8f"),
    rgbFromCssColor(style.getPropertyValue("--accent-3").trim() || "#e9c46a"),
  ];
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const colorsRef = useRef<[number, number, number][]>([]);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  /* ---------- init particles ---------- */
  const initParticles = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const count = isMobile ? 35 : 70;
    const colors = colorsRef.current;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
        alpha: Math.random() * 0.5 + 0.25,
      });
    }
    particlesRef.current = particles;
  }, []);

  /* ---------- resize handler ---------- */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sizeRef.current = { w, h };
    colorsRef.current = readAccentColors();
    initParticles(w, h);
  }, [initParticles]);

  /* ---------- animation loop ---------- */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const CONNECTION_DIST = w < 768 ? 100 : 150;
    const MOUSE_RADIUS = 180;

    /* Move & draw particles */
    for (const p of particles) {
      /* Mouse attractor effect */
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 1) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * 0.012;
          p.vy += (dy / dist) * force * 0.012;
        }
      }

      /* Update position */
      p.x += p.vx;
      p.y += p.vy;

      /* Damping */
      p.vx *= 0.998;
      p.vy *= 0.998;

      /* Wrap edges */
      if (p.x < -10) p.x = w + 10;
      else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      else if (p.y > h + 10) p.y = -10;

      /* Draw node */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    /* Draw connections */
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    /* Mouse-to-node lines */
    if (mouse.active) {
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const opacity = (1 - dist / MOUSE_RADIUS) * 0.25;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  /* ---------- lifecycle ---------- */
  useEffect(() => {
    colorsRef.current = readAccentColors();
    handleResize();

    /* Start loop */
    animationRef.current = requestAnimationFrame(animate);

    /* Mouse tracking */
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    /* Visibility (pause when tab hidden) */
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(animationRef.current);
      } else {
        colorsRef.current = readAccentColors();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    /* Theme changes — re-read CSS vars */
    const observer = new MutationObserver(() => {
      colorsRef.current = readAccentColors();
      // Re-color existing particles without re-init
      const colors = colorsRef.current;
      for (const p of particlesRef.current) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        p.color = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, [animate, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -2,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
