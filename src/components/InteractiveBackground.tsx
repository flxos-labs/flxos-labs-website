"use client";

import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type ParticleShape = "heart" | "bokeh" | "petal" | "shimmer";
type DepthLayer = "far" | "mid" | "near";

interface AmbientParticle {
  x: number;
  y: number;
  baseX: number;
  ySpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  size: number;
  shape: ParticleShape;
  color: [number, number, number];
  alpha: number;
  maxAlpha: number;
  layer: DepthLayer;
  rotation: number;
  rotationSpeed: number;
  pulseSpeed: number;
  pulseOffset: number;
  pulseAmount: number; // 0-1, how much the alpha breathes
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
  [255, 105, 135], // Rich rose
  [255, 143, 163], // Soft rose pink
  [255, 179, 193], // Pastel pink
  [255, 200, 221], // Sweet pink
  [245, 183, 177], // Dusty rose
  [250, 210, 160], // Warm champagne gold
  [255, 218, 233], // Blush
  [230, 190, 255], // Soft lavender
];

const DARK_PALETTE: [number, number, number][] = [
  [255, 77, 109],  // Vivid rose
  [255, 112, 150], // Soft magenta
  [220, 50, 90],   // Deep pink
  [180, 40, 80],   // Wine rose
  [140, 20, 60],   // Dark crimson
  [255, 195, 112], // Soft warm gold
  [200, 150, 255], // Twilight purple
  [255, 140, 180], // Warm pink glow
];

/* ------------------------------------------------------------------ */
/* Shape drawing helpers                                              */
/* ------------------------------------------------------------------ */
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.25);
  ctx.bezierCurveTo(
    x - size * 0.6, y - size * 0.45,
    x - size * 1.1, y + size * 0.25,
    x, y + size * 0.95
  );
  ctx.bezierCurveTo(
    x + size * 1.1, y + size * 0.25,
    x + size * 0.6, y - size * 0.45,
    x, y + size * 0.25
  );
  ctx.closePath();
  ctx.fill();
}

function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.8);
  ctx.bezierCurveTo(
    x + size * 0.7, y - size * 0.3,
    x + size * 0.5, y + size * 0.6,
    x, y + size * 0.8
  );
  ctx.bezierCurveTo(
    x - size * 0.5, y + size * 0.6,
    x - size * 0.7, y - size * 0.3,
    x, y - size * 0.8
  );
  ctx.closePath();
  ctx.fill();
}

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
/* Layer configuration                                                */
/* ------------------------------------------------------------------ */
const LAYER_CONFIG: Record<DepthLayer, {
  speedMul: number;   // slower for far layers
  sizeMul: number;    // smaller for far layers
  alphaMul: number;   // dimmer for far layers
  count: number;      // per-layer count (desktop)
  mobileCount: number;
}> = {
  far:  { speedMul: 0.3, sizeMul: 0.5,  alphaMul: 0.4, count: 25, mobileCount: 12 },
  mid:  { speedMul: 0.6, sizeMul: 0.8,  alphaMul: 0.7, count: 22, mobileCount: 10 },
  near: { speedMul: 1.0, sizeMul: 1.0,  alphaMul: 1.0, count: 18, mobileCount: 8  },
};

/* ------------------------------------------------------------------ */
/* Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const bgParticlesRef = useRef<AmbientParticle[]>([]);
  const sparkParticlesRef = useRef<SparkleParticle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean; px: number; py: number }>({
    x: -9999, y: -9999, active: false, px: -9999, py: -9999,
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

  /* ---------- Initialize Ambient Particles ---------- */
  const initBackgroundParticles = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const palette = themeRef.current === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
    const particles: AmbientParticle[] = [];
    const layers: DepthLayer[] = ["far", "mid", "near"];

    for (const layer of layers) {
      const cfg = LAYER_CONFIG[layer];
      const count = isMobile ? cfg.mobileCount : cfg.count;

      for (let i = 0; i < count; i++) {
        // Distribute shapes: hearts ~40%, bokeh ~30%, petals ~20%, shimmer ~10%
        const roll = Math.random();
        let shape: ParticleShape;
        if (roll < 0.4) shape = "heart";
        else if (roll < 0.7) shape = "bokeh";
        else if (roll < 0.9) shape = "petal";
        else shape = "shimmer";

        let baseSize: number;
        switch (shape) {
          case "heart":   baseSize = Math.random() * 10 + 5; break;
          case "petal":   baseSize = Math.random() * 8 + 4; break;
          case "bokeh":   baseSize = Math.random() * 70 + 25; break;
          case "shimmer": baseSize = Math.random() * 3 + 1.5; break;
        }
        const size = baseSize * cfg.sizeMul;

        let baseMaxAlpha: number;
        switch (shape) {
          case "heart":   baseMaxAlpha = Math.random() * 0.22 + 0.08; break;
          case "petal":   baseMaxAlpha = Math.random() * 0.18 + 0.06; break;
          case "bokeh":   baseMaxAlpha = Math.random() * 0.07 + 0.02; break;
          case "shimmer": baseMaxAlpha = Math.random() * 0.6 + 0.3; break;
        }
        const maxAlpha = baseMaxAlpha * cfg.alphaMul;

        const x = Math.random() * w;
        const y = Math.random() * h;

        particles.push({
          x, y,
          baseX: x,
          ySpeed: -(Math.random() * 0.1 + 0.04) * cfg.speedMul,
          swaySpeed: (Math.random() * 0.003 + 0.0008) * cfg.speedMul,
          swayAmplitude: (Math.random() * 30 + 8) * cfg.sizeMul,
          swayOffset: Math.random() * Math.PI * 2,
          size,
          shape,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * maxAlpha * 0.5,
          maxAlpha,
          layer,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.004 * cfg.speedMul,
          pulseSpeed: Math.random() * 0.002 + 0.0005,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseAmount: shape === "shimmer" ? 0.8 : Math.random() * 0.35 + 0.1,
        });
      }
    }

    // Sort by layer so far draws first (painter's algorithm)
    const order: Record<DepthLayer, number> = { far: 0, mid: 1, near: 2 };
    particles.sort((a, b) => order[a.layer] - order[b.layer]);

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
      const maxLife = Math.random() * 90 + 70;
      const color = palette[Math.floor(Math.random() * palette.length)];

      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 0.4 + 0.1;
      const vx = Math.cos(angle) * force * 0.15;
      const vy = (Math.sin(angle) * force - 0.25) * 0.15;

      newSparks.push({
        x: mx + (Math.random() - 0.5) * 8,
        y: my + (Math.random() - 0.5) * 8,
        vx, vy, size, color,
        alpha: 1,
        life: maxLife,
        maxLife,
        type,
      });
    }

    if (sparkParticlesRef.current.length < 300) {
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

    /* ========== 1. Ambient Background ========== */
    const bgParticles = bgParticlesRef.current;
    for (const p of bgParticles) {
      // Rise
      p.y += p.ySpeed;
      // Rotate
      p.rotation += p.rotationSpeed;
      // Gentle sway
      const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude;
      p.x = p.baseX + sway;

      // Breathing/pulsing alpha
      const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
      const breathAlpha = p.maxAlpha * (1 - p.pulseAmount * 0.5 + pulse * p.pulseAmount * 0.5);

      // Fade in near bottom
      if (p.y < h && p.y > h - 120) {
        p.alpha = Math.min(breathAlpha, p.alpha + 0.003);
      } else {
        // Smoothly approach the breathing target
        p.alpha += (breathAlpha - p.alpha) * 0.02;
      }

      // Reset off top
      if (p.y + p.size < -20) {
        p.y = h + p.size + Math.random() * 60;
        p.baseX = Math.random() * w;
        p.alpha = 0;
        p.color = palette[Math.floor(Math.random() * palette.length)];
      }

      // --- Render each shape ---
      const [r, g, b] = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.shape === "bokeh") {
        // Rich multi-stop radial gradient bokeh
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.25)`);
        grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.08)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "shimmer") {
        // Tiny twinkling dot with a soft glow
        const glowSize = p.size * 4;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        grad.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
        grad.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.4)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        // Bright center dot
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Heart or Petal — apply rotation
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Soft outer glow
        const glowSize = p.size * 2.5;
        const glow = ctx.createRadialGradient(0, 0, p.size * 0.3, 0, 0, glowSize);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.12)`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // The shape itself
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        if (p.shape === "heart") {
          drawHeart(ctx, 0, 0, p.size);
        } else {
          drawPetal(ctx, 0, 0, p.size);
        }

        ctx.restore();
      }
    }

    /* ========== 2. Sparkle Trail (unchanged) ========== */
    const sparks = sparkParticlesRef.current;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life--;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.985;
      s.vy *= 0.985;

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
    animationRef.current = requestAnimationFrame(animate);

    const onMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      const mx = e.clientX;
      const my = e.clientY;

      if (mouse.active) {
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

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(animationRef.current);
      } else {
        updateThemeState();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const observer = new MutationObserver(() => {
      updateThemeState();
      const pal = themeRef.current === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
      for (const p of bgParticlesRef.current) {
        p.color = pal[Math.floor(Math.random() * pal.length)];
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
