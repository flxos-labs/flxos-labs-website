"use client";

import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface RomanticParticle {
  x: number;
  y: number;
  baseX: number;
  ySpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  size: number;
  type: "heart" | "bokeh";
  color: [number, number, number];
  alpha: number;
  maxAlpha: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: [number, number, number];
  alpha: number;
  life: number;
  maxLife: number;
  type: "heart" | "sparkle";
}

/* ------------------------------------------------------------------ */
/* Palettes                                                           */
/* ------------------------------------------------------------------ */
const LIGHT_PALETTE: [number, number, number][] = [
  [255, 143, 163], // Soft rose pink
  [255, 179, 193], // Pastel pink
  [255, 200, 221], // Sweet pink
  [255, 229, 236], // Very soft rose
  [250, 210, 160], // Warm champagne gold
];

const DARK_PALETTE: [number, number, number][] = [
  [255, 77, 109],  // Vivid rose pink
  [255, 112, 150], // Soft magenta
  [201, 24, 74],   // Crimson red
  [128, 15, 47],    // Deep rose gold
  [255, 195, 112], // Soft glowing warm gold
];

/* ------------------------------------------------------------------ */
/* Heart drawing helper                                               */
/* ------------------------------------------------------------------ */
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  // Start at the top center notch
  ctx.moveTo(x, y + size * 0.25);
  // Left curve
  ctx.bezierCurveTo(
    x - size * 0.6,
    y - size * 0.45,
    x - size * 1.1,
    y + size * 0.25,
    x,
    y + size * 0.95
  );
  // Right curve
  ctx.bezierCurveTo(
    x + size * 1.1,
    y + size * 0.25,
    x + size * 0.6,
    y - size * 0.45,
    x,
    y + size * 0.25
  );
  ctx.closePath();
  ctx.fill();
}

/* ------------------------------------------------------------------ */
/* Sparkle/Star drawing helper                                        */
/* ------------------------------------------------------------------ */
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.closePath();
  ctx.fill();
}

/* ------------------------------------------------------------------ */
/* Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const bgParticlesRef = useRef<RomanticParticle[]>([]);
  const sparkParticlesRef = useRef<SparkleParticle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; px: number; py: number }>({
    x: -9999,
    y: -9999,
    active: false,
    px: -9999,
    py: -9999,
  });
  const themeRef = useRef<"light" | "dark">("light");
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  /* ---------- Get current theme ---------- */
  const updateThemeState = useCallback(() => {
    const rootTheme = document.documentElement.dataset.theme;
    if (rootTheme === "dark" || rootTheme === "light") {
      themeRef.current = rootTheme;
    } else {
      themeRef.current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  }, []);

  /* ---------- Initialize Background Drifters ---------- */
  const initBackgroundParticles = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const count = isMobile ? 25 : 55;
    const palette = themeRef.current === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
    const particles: RomanticParticle[] = [];

    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.4 ? "heart" : "bokeh";
      const size = type === "heart" ? Math.random() * 12 + 6 : Math.random() * 60 + 20;
      const x = Math.random() * w;
      const y = Math.random() * h;
      const maxAlpha = type === "heart" ? Math.random() * 0.25 + 0.08 : Math.random() * 0.06 + 0.015;

      particles.push({
        x,
        y,
        baseX: x,
        ySpeed: -(Math.random() * 0.35 + 0.15),
        swaySpeed: Math.random() * 0.01 + 0.003,
        swayAmplitude: Math.random() * 25 + 5,
        swayOffset: Math.random() * Math.PI * 2,
        size,
        type,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * maxAlpha,
        maxAlpha,
      });
    }

    bgParticlesRef.current = particles;
  }, []);

  /* ---------- Resize Handler ---------- */
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
    updateThemeState();
    initBackgroundParticles(w, h);
  }, [initBackgroundParticles, updateThemeState]);

  /* ---------- Spawn Interactive Sparkle ---------- */
  const spawnSparkles = useCallback((mx: number, my: number, count = 2) => {
    const palette = themeRef.current === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
    const newSparks: SparkleParticle[] = [];

    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.4 ? "sparkle" : "heart";
      const size = type === "heart" ? Math.random() * 7 + 4 : Math.random() * 5 + 3;
      const maxLife = Math.random() * 45 + 35;
      const color = palette[Math.floor(Math.random() * palette.length)];

      // Random unit vector with upward bias
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 0.8 + 0.2;
      const vx = Math.cos(angle) * force * 0.5;
      const vy = (Math.sin(angle) * force - 0.7) * 0.6; // Upward bias

      newSparks.push({
        x: mx + (Math.random() - 0.5) * 8,
        y: my + (Math.random() - 0.5) * 8,
        vx,
        vy,
        size,
        color,
        alpha: 1,
        life: maxLife,
        maxLife,
        type,
      });
    }

    // Cap the active sparkles list to prevent memory bloat
    if (sparkParticlesRef.current.length < 150) {
      sparkParticlesRef.current.push(...newSparks);
    }
  }, []);

  /* ---------- Animation Loop ---------- */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);

    const palette = themeRef.current === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
    const time = Date.now();

    /* 1. Update and Render Ambient Background Drifters */
    const bgParticles = bgParticlesRef.current;
    for (const p of bgParticles) {
      // Rise up
      p.y += p.ySpeed;

      // Gentle wave sway
      const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude;
      p.x = p.baseX + sway;

      // Slowly fade in when emerging from bottom
      if (p.y < h && p.y > h - 100) {
        p.alpha = Math.min(p.maxAlpha, p.alpha + 0.005);
      }

      // Reset when going off top screen
      if (p.y + p.size < 0) {
        p.y = h + p.size + Math.random() * 30;
        p.baseX = Math.random() * w;
        p.alpha = 0;
        // Randomly select a color from the current theme palette
        p.color = palette[Math.floor(Math.random() * palette.length)];
      }

      // Render
      ctx.fillStyle = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`;
      ctx.globalAlpha = p.alpha;

      if (p.type === "heart") {
        drawHeart(ctx, p.x, p.y, p.size);
      } else {
        // Bokeh glow circle
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.8)`);
        grad.addColorStop(0.5, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.2)`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* 2. Update and Render Sparkle Trail */
    let sparks = sparkParticlesRef.current;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life--;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      // Movement & deceleration
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.98;
      s.vy *= 0.98;

      // Fade-out and shrink
      s.alpha = s.life / s.maxLife;
      const currentSize = s.size * (s.life / s.maxLife);

      ctx.fillStyle = `rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]})`;
      ctx.globalAlpha = s.alpha * 0.8;

      if (s.type === "heart") {
        drawHeart(ctx, s.x, s.y, currentSize);
      } else {
        drawSparkle(ctx, s.x, s.y, currentSize);
      }
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  /* ---------- Lifecycle ---------- */
  useEffect(() => {
    handleResize();

    // Start rendering
    animationRef.current = requestAnimationFrame(animate);

    /* Mouse actions */
    const onMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      const mx = e.clientX;
      const my = e.clientY;

      if (mouse.active) {
        // Only spawn if mouse has moved a threshold to avoid flooding
        const dist = Math.hypot(mx - mouse.px, my - mouse.py);
        if (dist > 6) {
          spawnSparkles(mx, my, Math.min(Math.floor(dist / 4), 4));
          mouseRef.current.px = mx;
          mouseRef.current.py = my;
        }
      } else {
        mouseRef.current.active = true;
        mouseRef.current.px = mx;
        mouseRef.current.py = my;
      }
      mouseRef.current.x = mx;
      mouseRef.current.y = my;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    /* Visibility (pause when tab hidden) */
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(animationRef.current);
      } else {
        updateThemeState();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    /* Theme transition watcher */
    const observer = new MutationObserver(() => {
      updateThemeState();
      const palette = themeRef.current === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
      // Re-assign colors to background particles
      for (const p of bgParticlesRef.current) {
        p.color = palette[Math.floor(Math.random() * palette.length)];
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
  }, [animate, handleResize, spawnSparkles, updateThemeState]);

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
