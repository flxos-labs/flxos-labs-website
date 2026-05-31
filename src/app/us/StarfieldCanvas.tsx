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

interface NebulaCloud {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: [number, number, number];
  maxOpacity: number;
  opacity: number;
  swaySpeedX: number;
  swaySpeedY: number;
  swayAmplitudeX: number;
  swayAmplitudeY: number;
  swayOffsetX: number;
  swayOffsetY: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: [number, number, number];
}

interface HeartBokeh {
  x: number;
  y: number;
  baseX: number;
  size: number;
  ySpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  alpha: number;
  maxAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: [number, number, number];
  isHeart: boolean;
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
  far: { speedMul: 0.3, sizeMul: 0.5, alphaMul: 0.4, count: 40, mobileCount: 15 },
  mid: { speedMul: 0.6, sizeMul: 0.8, alphaMul: 0.7, count: 30, mobileCount: 12 },
  near: { speedMul: 1.0, sizeMul: 1.0, alphaMul: 1.0, count: 20, mobileCount: 8 },
};

interface StarfieldCanvasProps {
  onMeteorClick?: (x: number, y: number) => void;
}

export default function StarfieldCanvas({ onMeteorClick }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<StarParticle[]>([]);
  const sparklesRef = useRef<SparkleParticle[]>([]);
  const nebulaeRef = useRef<NebulaCloud[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const bokehRef = useRef<HeartBokeh[]>([]);
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
          ySpeed: -(Math.random() * 0.02 + 0.008) * cfg.speedMul, // Slower star float speed (cinematic)
          swaySpeed: (Math.random() * 0.0004 + 0.0001) * cfg.speedMul, // Slower horizontal sway
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

    // Initialize Nebulae
    const nebulae: NebulaCloud[] = [
      {
        x: w * 0.75,
        y: h * 0.2,
        baseX: w * 0.75,
        baseY: h * 0.2,
        radius: isMobile ? w * 0.8 : Math.min(w, h) * 0.75,
        color: [124, 92, 191], // Purple
        maxOpacity: isMobile ? 0.07 : 0.13,
        opacity: 0,
        swaySpeedX: 0.00015,
        swaySpeedY: 0.0001,
        swayAmplitudeX: w * 0.04,
        swayAmplitudeY: h * 0.04,
        swayOffsetX: 0,
        swayOffsetY: Math.PI / 4,
      },
      {
        x: w * 0.2,
        y: h * 0.6,
        baseX: w * 0.2,
        baseY: h * 0.6,
        radius: isMobile ? w * 0.7 : Math.min(w, h) * 0.65,
        color: [212, 168, 83], // Gold
        maxOpacity: isMobile ? 0.05 : 0.11,
        opacity: 0,
        swaySpeedX: 0.0001,
        swaySpeedY: 0.00015,
        swayAmplitudeX: w * 0.03,
        swayAmplitudeY: h * 0.03,
        swayOffsetX: Math.PI,
        swayOffsetY: 0,
      },
    ];

    if (!isMobile) {
      nebulae.push({
        x: w * 0.5,
        y: h * 0.8,
        baseX: w * 0.5,
        baseY: h * 0.8,
        radius: Math.min(w, h) * 0.7,
        color: [232, 71, 95], // Rose
        maxOpacity: 0.12,
        opacity: 0,
        swaySpeedX: 0.0002,
        swaySpeedY: 0.00008,
        swayAmplitudeX: w * 0.05,
        swayAmplitudeY: h * 0.05,
        swayOffsetX: Math.PI / 2,
        swayOffsetY: Math.PI * 1.5,
      });
    }
    nebulaeRef.current = nebulae;

    // Initialize Bokeh Orbs
    const bokeh: HeartBokeh[] = [];
    const bokehCount = isMobile ? 6 : 14;
    for (let i = 0; i < bokehCount; i++) {
      const size = Math.random() * 15 + 10;
      const maxAlpha = Math.random() * 0.12 + 0.04;
      const x = Math.random() * w;
      const y = Math.random() * h;
      const isHeart = Math.random() < 0.45;

      bokeh.push({
        x,
        y,
        baseX: x,
        size,
        ySpeed: -(Math.random() * 0.024 + 0.01), // Slower bokeh and heart float speed (dreamy)
        swaySpeed: Math.random() * 0.0002 + 0.0001, // Slower sway speed
        swayAmplitude: Math.random() * 20 + 8,
        swayOffset: Math.random() * Math.PI * 2,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        pulseSpeed: Math.random() * 0.0015 + 0.0008,
        pulseOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.6 ? [232, 71, 95] : [212, 168, 83],
        isHeart,
      });
    }
    bokehRef.current = bokeh;

    // Reset Meteors
    meteorsRef.current = [];
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
    const isMobile = w < 768;

    // 1. Draw drifting ambient nebulae/gas clouds
    ctx.globalCompositeOperation = "screen";
    for (const n of nebulaeRef.current) {
      const swayX = Math.sin(time * n.swaySpeedX + n.swayOffsetX) * n.swayAmplitudeX;
      const swayY = Math.cos(time * n.swaySpeedY + n.swayOffsetY) * n.swayAmplitudeY;

      let px = 0;
      let py = 0;
      if (mouse.x !== -9999) {
        px = (mouse.x - w / 2) * -0.04;
        py = (mouse.y - h / 2) * -0.04;
      }

      n.x = n.baseX + swayX + px;
      n.y = n.baseY + swayY + py;

      const pulse = Math.sin(time * 0.0004 + n.swayOffsetX) * 0.15 + 0.85;
      n.opacity += (n.maxOpacity * pulse - n.opacity) * 0.02;

      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity})`);
      grad.addColorStop(0.35, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.35})`);
      grad.addColorStop(0.7, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${n.opacity * 0.08})`);
      grad.addColorStop(1, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // 2. Draw drifting background stars and their constellations
    const stars = starsRef.current;

    // Update star positions and compute display coordinates
    const starCoords = stars.map(p => {
      p.y += p.ySpeed;
      const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude;

      let px = 0;
      let py = 0;
      if (mouse.x !== -9999) {
        const factor = p.layer === "near" ? 0.03 : p.layer === "mid" ? 0.015 : 0.007;
        px = (mouse.x - w / 2) * factor;
        py = (mouse.y - h / 2) * factor;
      }

      p.x = p.baseX + sway + px;

      if (p.y + p.size < -10) {
        p.y = h + p.size + Math.random() * 30;
        p.baseX = Math.random() * w;
        p.alpha = 0;
      }

      const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
      const twinkleAlpha = p.maxAlpha * (0.6 + 0.4 * pulse);

      if (p.y < h && p.y > h - 100) {
        p.alpha = Math.min(twinkleAlpha, p.alpha + 0.005);
      } else {
        p.alpha += (twinkleAlpha - p.alpha) * 0.05;
      }

      return {
        x: p.x,
        y: p.y + (mouse.x !== -9999 ? (mouse.y - h / 2) * (p.layer === "near" ? 0.03 : p.layer === "mid" ? 0.015 : 0.007) : 0),
        p
      };
    });

    // Draw Constellation lines (connections between nearby stars in same layer)
    ctx.lineWidth = 0.5;
    const maxLineDist = isMobile ? 80 : 105;
    for (let i = 0; i < starCoords.length; i++) {
      const s1 = starCoords[i];
      if (s1.p.layer === "far") continue;

      let connections = 0;
      const maxConnections = s1.p.layer === "near" ? 3 : 2;

      for (let j = i + 1; j < starCoords.length; j++) {
        const s2 = starCoords[j];
        if (s1.p.layer !== s2.p.layer) continue;

        const dist = Math.hypot(s2.x - s1.x, s2.y - s1.y);
        if (dist < maxLineDist) {
          connections++;
          if (connections > maxConnections) break;

          const alphaFactor = (1 - dist / maxLineDist) * 0.12;
          const lineAlpha = Math.min(s1.p.alpha, s2.p.alpha) * alphaFactor;

          if (lineAlpha > 0.01) {
            const [r, g, b] = s1.p.color;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }
    }

    // Draw the actual stars
    for (const sc of starCoords) {
      const p = sc.p;
      const [r, g, b] = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);

      // Glow
      const glowSize = p.size * 3.5;
      const grad = ctx.createRadialGradient(sc.x, sc.y, 0, sc.x, sc.y, glowSize);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
      grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.25)`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = `rgb(255, 255, 255)`;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw rising bokeh shapes and soft heart orbs
    const bokeh = bokehRef.current;
    for (const b of bokeh) {
      b.y += b.ySpeed;
      const sway = Math.sin(time * b.swaySpeed + b.swayOffset) * b.swayAmplitude;

      let px = 0;
      let py = 0;
      if (mouse.x !== -9999) {
        px = (mouse.x - w / 2) * 0.025;
        py = (mouse.y - h / 2) * 0.025;
      }

      b.x = b.baseX + sway + px;

      if (b.y + b.size < -50) {
        b.y = h + b.size + Math.random() * 50;
        b.baseX = Math.random() * w;
        b.alpha = 0;
      }

      const pulse = Math.sin(time * b.pulseSpeed + b.pulseOffset);
      const targetAlpha = b.maxAlpha * (0.75 + 0.25 * pulse);

      if (b.y < h && b.y > h - 150) {
        b.alpha = Math.min(targetAlpha, b.alpha + 0.003);
      } else {
        b.alpha += (targetAlpha - b.alpha) * 0.02;
      }

      const drawY = b.y + py;
      const [r, g, bColor] = b.color;
      ctx.globalAlpha = Math.max(0, b.alpha);

      if (b.isHeart) {
        const size = b.size;
        ctx.fillStyle = `rgba(${r}, ${g}, ${bColor}, 0.22)`;

        ctx.beginPath();
        const hx = b.x;
        const hy = drawY - size / 2;
        ctx.moveTo(hx, hy + size * 0.3);
        ctx.bezierCurveTo(hx - size / 2, hy - size / 4, hx - size, hy + size / 3, hx, hy + size);
        ctx.bezierCurveTo(hx + size, hy + size / 3, hx + size / 2, hy - size / 4, hx, hy + size * 0.3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, 0.45)`;
        ctx.beginPath();
        ctx.arc(hx, hy + size * 0.45, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const grad = ctx.createRadialGradient(b.x, drawY, 0, b.x, drawY, b.size);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${bColor}, 0.38)`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${bColor}, 0.14)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${bColor}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, drawY, b.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // 4. Update and Draw Shooting Stars (Meteors)
    const meteors = meteorsRef.current;
    if (Math.random() < (isMobile ? 0.0008 : 0.0022) && meteors.length < (isMobile ? 1 : 2)) {
      const startX = Math.random() * w * 0.8;
      const startY = Math.random() * h * 0.3;
      const length = Math.random() * 80 + 70;
      const speed = Math.random() * 2.2 + 1.8; // Dreamy slower shooting stars
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15;

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        size: Math.random() * 1.5 + 1.2,
        alpha: 0,
        life: 0,
        maxLife: Math.random() * 130 + 100, // Longer life span to match slower speeds across screen
        color: GOLD_ROSE_PALETTE[Math.floor(Math.random() * GOLD_ROSE_PALETTE.length)],
      });
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.life++;

      if (m.life >= m.maxLife) {
        meteors.splice(i, 1);
        continue;
      }

      m.x += m.vx;
      m.y += m.vy;

      if (m.life < 10) {
        m.alpha = m.life / 10;
      } else if (m.life > m.maxLife - 15) {
        m.alpha = (m.maxLife - m.life) / 15;
      } else {
        m.alpha = 1;
      }

      ctx.globalAlpha = m.alpha * 0.8;

      const tailX = m.x - m.vx * 3.5;
      const tailY = m.y - m.vy * 3.5;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      const [mr, mg, mb] = m.color;
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.1, `rgba(${mr}, ${mg}, ${mb}, 0.8)`);
      grad.addColorStop(0.5, `rgba(${mr}, ${mg}, ${mb}, 0.35)`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = m.size;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 5. Draw active mouse trail sparkles
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

      // Gravity and gentle jitter
      s.vy += 0.005;
      s.vx += (Math.random() - 0.5) * 0.03;

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

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const mx = touch.clientX;
      const my = touch.clientY;
      const mouse = mouseRef.current;

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

    const onWindowClick = (e: MouseEvent) => {
      const { w, h } = sizeRef.current;
      const mx = e.clientX;
      const my = e.clientY;
      
      const clickedMeteorIndex = meteorsRef.current.findIndex(m => {
        const dist = Math.hypot(mx - m.x, my - m.y);
        return dist < 55; // generous tap target radius for mobile
      });

      if (clickedMeteorIndex !== -1) {
        const m = meteorsRef.current[clickedMeteorIndex];
        
        // Spawn stardust sparkle burst
        const splashSparks: SparkleParticle[] = [];
        for (let k = 0; k < 25; k++) {
          const size = Math.random() * 5 + 3;
          const maxLife = Math.random() * 40 + 30;
          const angle = Math.random() * Math.PI * 2;
          const force = Math.random() * 4 + 2;
          splashSparks.push({
            x: m.x,
            y: m.y,
            vx: Math.cos(angle) * force,
            vy: Math.sin(angle) * force,
            size,
            color: [212, 168, 83], // Pure Gold
            alpha: 1,
            life: maxLife,
            maxLife,
          });
        }
        sparklesRef.current.push(...splashSparks);

        if (onMeteorClick) {
          onMeteorClick(m.x, m.y);
        }

        // Remove the meteor so it doesn't get double clicked
        meteorsRef.current.splice(clickedMeteorIndex, 1);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseLeave, { passive: true });
    window.addEventListener("click", onWindowClick);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseLeave);
      window.removeEventListener("click", onWindowClick);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animate, handleResize, spawnSparkles, onMeteorClick]);

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
