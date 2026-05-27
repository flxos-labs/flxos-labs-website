"use client";

import { useEffect, useState } from "react";

const PLATFORMS = [
  "ESP32",
  "ESP32-S3",
  "ESP32-P4",
  "ESP32-C6",
  "Linux",
  "macOS",
  "Windows",
];

export default function PlatformCycler() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const interval = setInterval(() => {
      setVisible(false);
      timeoutId = setTimeout(() => {
        setIndex((prev) => (prev + 1) % PLATFORMS.length);
        setVisible(true);
      }, 250); // Duration matches transition timing
    }, 2500);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <span
      className={`inline-block font-extrabold transition-all duration-250 ease-in-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      } bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-3)] bg-clip-text text-transparent`}
    >
      {PLATFORMS[index]}
    </span>
  );
}
