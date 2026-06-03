"use client";

import React, { useRef } from "react";
import { useMouse3D } from "./useMouse3D";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glowColor?: string; // e.g. rgba(212, 168, 83, 0.12) or rgba(244, 63, 94, 0.12)
  style?: React.CSSProperties;
  baseTransform?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Tilt3DCard({
  children,
  className = "",
  maxTilt = 10,
  perspective = 800,
  glowColor = "rgba(212, 168, 83, 0.12)",
  style = {},
  baseTransform = "",
  onClick,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY, x, y, isHovering } = useMouse3D(ref, { maxTilt });

  const cardStyle: React.CSSProperties = {
    position: "relative",
    ...style,
    transform: isHovering
      ? `perspective(${perspective}px) ${baseTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      : `perspective(${perspective}px) ${baseTransform} rotateX(0deg) rotateY(0deg)`,
    transition: isHovering ? "transform 0.05s linear" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    transformStyle: "preserve-3d",
  };

  const glowStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
    opacity: isHovering ? 1 : 0,
    transition: "opacity 0.4s ease",
    background: `radial-gradient(circle 250px at ${x}% ${y}%, ${glowColor}, transparent 80%)`,
    mixBlendMode: "screen",
    zIndex: 10,
  };

  return (
    <div ref={ref} className={className} style={cardStyle} onClick={onClick}>
      {/* For nested 3D transform layers like text/images rising up */}
      <div className="w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
      <div style={glowStyle} className="us-glow-overlay" />
    </div>
  );
}
