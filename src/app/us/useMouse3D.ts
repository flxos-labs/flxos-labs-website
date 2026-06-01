"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface Mouse3DState {
  rotateX: number;
  rotateY: number;
  x: number; // percentage from 0 to 100 (horizontal cursor position relative to the element)
  y: number; // percentage from 0 to 100 (vertical cursor position relative to the element)
  isHovering: boolean;
}

interface UseMouse3DOptions {
  maxTilt?: number;
  lerpSpeed?: number;
}

export function useMouse3D(
  ref: RefObject<HTMLElement | null>,
  options: UseMouse3DOptions = {}
): Mouse3DState {
  const { maxTilt = 10, lerpSpeed = 0.1 } = options;

  const [state, setState] = useState<Mouse3DState>({
    rotateX: 0,
    rotateY: 0,
    x: 50,
    y: 50,
    isHovering: false,
  });

  const stateRef = useRef({
    targetX: 50,
    targetY: 50,
    targetRotateX: 0,
    targetRotateY: 0,
    currentX: 50,
    currentY: 50,
    currentRotateX: 0,
    currentRotateY: 0,
    isHovering: false,
    isMobile: false,
    rafId: 0,
  });

  useEffect(() => {
    // Check if mobile or touch device using pointer query
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    stateRef.current.isMobile = mediaQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      stateRef.current.isMobile = e.matches;
      if (e.matches) {
        // Reset to default on mobile/touch transition
        stateRef.current.targetRotateX = 0;
        stateRef.current.targetRotateY = 0;
        stateRef.current.targetX = 50;
        stateRef.current.targetY = 50;
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateState = () => {
      const s = stateRef.current;
      if (s.isMobile) return;

      // Linear interpolation (lerp) for smooth movements
      s.currentX += (s.targetX - s.currentX) * lerpSpeed;
      s.currentY += (s.targetY - s.currentY) * lerpSpeed;
      s.currentRotateX += (s.targetRotateX - s.currentRotateX) * lerpSpeed;
      s.currentRotateY += (s.targetRotateY - s.currentRotateY) * lerpSpeed;

      setState({
        rotateX: Number(s.currentRotateX.toFixed(2)),
        rotateY: Number(s.currentRotateY.toFixed(2)),
        x: Number(s.currentX.toFixed(1)),
        y: Number(s.currentY.toFixed(1)),
        isHovering: s.isHovering,
      });

      const diffX = Math.abs(s.targetRotateX - s.currentRotateX);
      const diffY = Math.abs(s.targetRotateY - s.currentRotateY);

      // Keep the loop running if hovering or if the values haven't settled
      if (s.isHovering || diffX > 0.01 || diffY > 0.01) {
        s.rafId = requestAnimationFrame(updateState);
      } else {
        // Snap to target to prevent idle micro-renders
        s.currentRotateX = s.targetRotateX;
        s.currentRotateY = s.targetRotateY;
        s.currentX = s.targetX;
        s.currentY = s.targetY;
        setState({
          rotateX: s.targetRotateX,
          rotateY: s.targetRotateY,
          x: s.targetX,
          y: s.targetY,
          isHovering: s.isHovering,
        });
        s.rafId = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (s.isMobile) return;

      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Mouse coordinates relative to the element bounding box
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Keep it within range
      const clampedX = Math.max(0, Math.min(width, relativeX));
      const clampedY = Math.max(0, Math.min(height, relativeY));

      // Percentages for radial gradient overlays (0% to 100%)
      const pctX = (clampedX / width) * 100;
      const pctY = (clampedY / height) * 100;

      // Normalized coordinates (-0.5 to 0.5)
      const normX = (clampedX - width / 2) / width;
      const normY = (clampedY - height / 2) / height;

      s.targetX = pctX;
      s.targetY = pctY;
      s.targetRotateX = -normY * maxTilt; // Rotate on X axis based on Y movement
      s.targetRotateY = normX * maxTilt;  // Rotate on Y axis based on X movement
      s.isHovering = true;

      if (!s.rafId) {
        s.rafId = requestAnimationFrame(updateState);
      }
    };

    const handlePointerLeave = () => {
      const s = stateRef.current;
      s.isHovering = false;
      s.targetRotateX = 0;
      s.targetRotateY = 0;
      s.targetX = 50;
      s.targetY = 50;

      if (!s.rafId) {
        s.rafId = requestAnimationFrame(updateState);
      }
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId);
      }
    };
  }, [ref, maxTilt, lerpSpeed]);

  return state;
}
