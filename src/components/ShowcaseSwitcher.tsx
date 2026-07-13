"use client";

import { useState } from "react";
import DeviceSlideshow from "./DeviceSlideshow";
import FlxOSSimulator from "./FlxOSSimulator";

export default function ShowcaseSwitcher() {
  const [activeTab, setActiveTab] = useState<"gallery" | "simulator">("gallery");

  return (
    <div className="w-full flex flex-col">
      {/* Toggle Controls */}
      <div className="flex justify-center gap-1.5 mb-6 bg-[rgba(var(--surface-rgb),0.75)] p-1 rounded-xl w-fit mx-auto border border-[color:var(--border-muted)] backdrop-blur-md shadow-sm z-30 relative">
        <button
          className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
            activeTab === "gallery"
              ? "bg-[color:var(--surface)] text-[color:var(--ink)] shadow-md border border-[rgba(0,0,0,0.04)]"
              : "text-[color:var(--muted)] hover:text-[color:var(--ink)]"
          }`}
          onClick={() => setActiveTab("gallery")}
        >
          📷 Screenshot Gallery
        </button>
        <button
          className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "simulator"
              ? "bg-[color:var(--surface)] text-[color:var(--ink)] shadow-md border border-[rgba(0,0,0,0.04)]"
              : "text-[color:var(--muted)] hover:text-[color:var(--ink)]"
          }`}
          onClick={() => setActiveTab("simulator")}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          🎮 Live OS Simulator
        </button>
      </div>

      {/* active tab panel */}
      <div className="relative w-full">
        {activeTab === "gallery" ? (
          <DeviceSlideshow />
        ) : (
          <FlxOSSimulator />
        )}
      </div>
    </div>
  );
}
