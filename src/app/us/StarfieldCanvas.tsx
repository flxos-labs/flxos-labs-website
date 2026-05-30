"use client";

import { useEffect, useRef, useCallback } from "react";

type DepthLayer = "far" | "mid" | "near";

interface StarParticle {
  x: number;
  y: number;
  baseX: number;
  ySpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  size: number;
  color: [number, number, number];
  alpha: number;
  maxAlpha: number;
  layer: DepthLayer;
  pulseSpeed: number;
  pulseOffset: number;
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
}

const GOLD_ROSE_PALETTE: [number, number, number][] = [
  [212, 168, 83],  // Gold (#d4a853)
  [245, 215, 153], // Light gold (#f5d799)
  [232, 71, 95],   // Rose (#e8475f)
  [253, 246, 227], // Champagne (#fdf6e3)
  [124, 92, 191],  // Twilight purple (#7c5cbf)
];

const LAYER_CONFIG: Record<DepthLayer, {
  speedMul: number;
  sizeMul: number;
  alphaMul: number;
  count: number;
  mobileCount: number;
}> = {
  far:  { speedMul: 0.3, sizeMul: 0.5,  alphaMul: 0.4, count: 40, mobileCount: 15 },
  mid:  { speedMul: 0.6, sizeMul: 0.8,  alphaMul: 0.7, count: 30, mobileCount: 12 },
  near: { speedMul: 1.0, sizeMul: 1.0,  alphaMul: 1.0, count: 20, mobileCount: 8  },
};

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<StarParticle[]>([]);
  const sparklesRef = useRef<SparkleParticle[]>([]);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const mouseRef = useRef<{ x: number; y: number; active: boolean; px: number; py: number }>({
    x: -9999, y: -9999, active: false, px: -9999, py: -9999,
  });

  const initStars = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const stars: StarParticle[] = [];
    const layers: DepthLayer[] = ["far", "mid", "near"];

    for (const layer of layers) {
      const cfg = LAYER_CONFIG[layer];
      const count = isMobile ? cfg.mobileCount : cfg.count;

      for (let i = 0; i < count; i++) {
        const size = (Math.random() * 4 + 1.8) * cfg.sizeMul;
        const maxAlpha = (Math.random() * 0.5 + 0.3) * cfg.alphaMul;
        const x = Math.random() * w;
        const y = Math.random() * h;

        stars.push({
          x,
          y,
          baseX: x,
          ySpeed: -(Math.random() * 0.15 + 0.05) * cfg.speedMul,
          swaySpeed: (Math.random() * 0.002 + 0.0005) * cfg.speedMul,
          swayAmplitude: (Math.random() * 20 + 5) * cfg.sizeMul,
          swayOffset: Math.random() * Math.PI * 2,
          size,
          color: GOLD_ROSE_PALETTE[Math.floor(Math.random() * GOLD_ROSE_PALETTE.length)],
          alpha: Math.random() * maxAlpha,
          maxAlpha,
          layer,
          pulseSpeed: Math.random() * 0.003 + 0.001,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Painter's algorithm
    const order: Record<DepthLayer, number> = { far: 0, mid: 1, near: 2 };
    stars.sort((a, b) => order[a.layer] - order[b.layer]);
    starsRef.current = stars;
  }, []);

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
    initStars(w, h);
  }, [initStars]);

  const spawnSparkles = useCallback((mx: number, my: number, count = 2) => {
    const newSparks: SparkleParticle[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2;
      const maxLife = Math.random() * 30 + 20;
      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 1.2 + 0.3;
      const vx = Math.cos(angle) * force * 0.3;
      const vy = (Math.sin(angle) * force - 0.4) * 0.3;

      newSparks.push({
        x: mx + (Math.random() - 0.5) * 6,
        y: my + (Math.random() - 0.5) * 6,
        vx,
        vy,
        size,
        color: GOLD_ROSE_PALETTE[Math.floor(Math.random() * GOLD_ROSE_PALETTE.length)],
        alpha: 1,
        life: maxLife,
        maxLife,
      });
    }

    if (sparklesRef.current.length < 100) {
      sparklesRef.current.push(...newSparks);
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    ctx.clearRect(0, 0, w, h);

    const time = Date.now();
    const mouse = mouseRef.current;

    // 1. Draw drifting background stars
    const stars = starsRef.current;
    for (const p of stars) {
      p.y += p.ySpeed;
      const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude;
      
      // Mouse Parallax factor
      let px = 0;
      let py = 0;
      if (mouse.x !== -9999) {
        const factor = p.layer === "near" ? 0.03 : p.layer === "mid" ? 0.015 : 0.007;
        px = (mouse.x - w / 2) * factor;
        py = (mouse.y - h / 2) * factor;
      }

      p.x = p.baseX + sway + px;

      // Reset star at bottom if it drifts off top
      if (p.y + p.size < -10) {
        p.y = h + p.size + Math.random() * 30;
        p.baseX = Math.random() * w;
        p.alpha = 0;
      }

      // Breathing twinkle
      const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
      const twinkleAlpha = p.maxAlpha * (0.6 + 0.4 * pulse);
      
      // Fade in near bottom
      if (p.y < h && p.y > h - 100) {
        p.alpha = Math.min(twinkleAlpha, p.alpha + 0.005);
      } else {
        p.alpha += (twinkleAlpha - p.alpha) * 0.05;
      }

      const [r, g, b] = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);

      // Draw soft star glow
      const glowSize = p.size * 3.5;
      const grad = ctx.createRadialGradient(p.x, p.y + py, 0, p.x, p.y + py, glowSize);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
      grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.3)`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y + py, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Sharp core
      ctx.fillStyle = `rgb(255, 255, 255)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y + py, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw active mouse trail sparkles
    const sparkles = sparklesRef.current;
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.life--;

      if (s.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.96;
      s.vy *= 0.96;

      s.alpha = s.life / s.maxLife;
      const currentSize = s.size * (s.life / s.maxLife);

      const [r, g, b] = s.color;
      ctx.globalAlpha = s.alpha * 0.9;

      // Draw 4-point sparkle
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - currentSize);
      ctx.quadraticCurveTo(s.x, s.y, s.x + currentSize, s.y);
      ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + currentSize);
      ctx.quadraticCurveTo(s.x, s.y, s.x - currentSize, s.y);
      ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - currentSize);
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    handleResize();
    animationRef.current = requestAnimationFrame(animate);

    const onMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      const mx = e.clientX;
      const my = e.clientY;

      if (mouse.active) {
        const dist = Math.hypot(mx - mouse.px, my - mouse.py);
        if (dist > 8) {
          spawnSparkles(mx, my, Math.min(Math.floor(dist / 5), 3));
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
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(animationRef.current);
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

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
    };
  }, [animate, handleResize, spawnSparkles]);

  return (
    <canvas
      ref={canvasRef}
      className="us-starfield-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
