"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./DeviceSlideshow.module.css";

interface Slide {
  src: string;
  title: string;
  desc: string;
}

export default function DeviceSlideshow() {
  const slides: Slide[] = [
    {
      src: "/images/screenshots/scr_20260312_161725_home_screen_with_dock_status_bar_wallpaper.webp",
      title: "Live UI: Home Screen",
      desc: "Launcher dock, status bar indicators, and custom wallpaper on real hardware.",
    },
    {
      src: "/images/screenshots/scr_20260312_161649_calendar_app.webp",
      title: "Built-in App: Calendar",
      desc: "Delightful touch calendar app showing months, days, and event dates.",
    },
    {
      src: "/images/screenshots/scr_20260312_162706_files_app.webp",
      title: "Built-in App: Files Manager",
      desc: "Storage browser mapping the filesystem directly with directories and icons.",
    },
    {
      src: "/images/screenshots/scr_20260312_162756_settings_app.webp",
      title: "System Settings App",
      desc: "Touch sliders and switches for updating hardware preferences in real time.",
    },
    {
      src: "/images/screenshots/scr_20260312_163214_text_editor_with_on_screen_keyboard.webp",
      title: "Text Editor & Input",
      desc: "Editable textarea container coupled with a full on-screen keyboard overlay.",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 4500); // 4.5 seconds per slide to give users time to read

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto">
      {/* Device Frame Card */}
      <div className={`${styles.deviceCard} relative aspect-[4/3] w-full overflow-hidden`}>
        {slides.map((slide, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={idx}
              className={`absolute inset-[5%] transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-xl"
                priority={idx === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Synchronized Caption Card */}
      <div className={`${styles.captionCard} absolute left-4 right-4 bottom-4 md:left-auto md:right-[-20px] md:bottom-[-25px] w-auto md:w-72 bg-[rgba(var(--surface-rgb),0.92)] border border-[rgba(0,0,0,0.08)] backdrop-blur-md p-4 rounded-2xl shadow-xl z-20 space-y-1 transition-all duration-300`}>
        <div className="flex items-center gap-1.5 pb-1 border-b border-[rgba(0,0,0,0.03)]">
          <span className="w-2 h-2 rounded-full bg-[color:var(--accent)] animate-pulse" />
          <p className="font-display text-xs font-extrabold text-[color:var(--ink)] transition-colors">
            {slides[activeIdx].title}
          </p>
        </div>
        <span className="block text-[11px] text-[color:var(--muted)] leading-normal transition-opacity duration-300">
          {slides[activeIdx].desc}
        </span>
      </div>
    </div>
  );
}
