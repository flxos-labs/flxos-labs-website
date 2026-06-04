"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { sidebarData } from "@/lib/docs-menu";
import buttonStyles from "@/components/Buttons.module.css";
import styles from "./DocsContent.module.css";

export default function DocsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("installation");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (!activeEl) return;

      const isEditable =
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement).isContentEditable;

      if (e.key === "/" && !isEditable) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scrollspy to update active sidebar link
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.docSection}`);
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section is in middle of viewport
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Dispatch custom event to notify layout header about the active section
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("active-section-changed", { detail: activeSection }));
  }, [activeSection]);

  // Clipboard copy handler
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedBlock(id);
      setTimeout(() => setCopiedBlock(null), 2000);
    });
  };

  // Scroll to section helper
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Filter links based on search
  const filteredSidebar = sidebarData.map((section) => {
    const matchedLinks = section.links.filter(
      (link) =>
        link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...section,
      links: matchedLinks,
    };
  }).filter((section) => section.links.length > 0);

  return (
    <main className="relative min-h-screen text-[color:var(--ink)]">
      {/* Hero Orbs background */}
      <div className={styles.heroOrbs} aria-hidden="true">
        <span className={`${styles.orb} ${styles.orb1} opacity-40`} />
        <span className={`${styles.orb} ${styles.orb2} opacity-35`} />
        <span className={`${styles.orb} ${styles.orb3} opacity-30`} />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16 grid gap-10 md:grid-cols-[250px_1fr]">
        
        {/* Sidebar Nav (Desktop Only) */}
        <aside
          className="hidden md:block md:sticky z-10 w-auto self-start"
          style={{ height: "calc(100vh - 100px)", top: "100px" }}
        >
          {/* Search Box */}
          <div className="relative mb-6">
            <span className="absolute left-3 top-3 text-[color:var(--muted)]">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search docs... (press /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[rgba(var(--surface-rgb),0.5)] border border-[color:var(--border-muted)] rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-6 overflow-y-auto pr-2" style={{ maxHeight: "calc(100% - 60px)" }}>
            {filteredSidebar.length > 0 ? (
              filteredSidebar.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-display text-[11px] uppercase tracking-wider font-bold text-[color:var(--muted)]">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.links.map((link) => {
                      const isActive = activeSection === link.id;
                      return (
                        <li key={link.id}>
                          <button
                            onClick={() => scrollTo(link.id)}
                            className={`w-full text-left py-1 text-xs font-semibold rounded-lg hover:text-[color:var(--ink)] hover:bg-[rgba(var(--surface-rgb),0.8)] transition-all ${
                              isActive
                                ? "text-[color:var(--accent)] bg-[rgba(231,111,81,0.06)] pl-2"
                                : "text-[color:var(--muted)]"
                            }`}
                          >
                            {link.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-xs text-[color:var(--muted)] italic">No results found.</p>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="space-y-16 max-w-3xl min-w-0">
          <header className="space-y-3">
            <nav className="flex items-center gap-2 text-xs text-[color:var(--muted)] font-medium" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[color:var(--ink)] transition-colors">Home</Link>
              <span>/</span>
              <span>Documentation</span>
            </nav>
            <h1 className="font-display text-4xl font-extrabold text-[color:var(--ink)]">FlxOS Documentation</h1>
            <p className="text-md text-[color:var(--muted)] leading-relaxed">
              Complete guide to installing, configuring, and developing with FlxOS.
            </p>

            {/* Mobile search & inline navigation */}
            <div className="w-full md:hidden space-y-3 bg-[rgba(var(--surface-rgb),0.35)] border border-[color:var(--border-faint)] rounded-2xl p-4 !mt-5 shadow-sm text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[color:var(--muted)] block px-0.5">
                Table of Contents
              </span>
              
              {/* Search Box */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[color:var(--muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[rgba(var(--surface-rgb),0.5)] border border-[color:var(--border-muted)] rounded-xl py-1.5 pl-8 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* List of sections */}
              <div className={`space-y-3 overflow-y-auto pr-1 transition-all duration-300 ${
                isSearchFocused || searchQuery.length > 0
                  ? "max-h-[220px] pt-1.5 opacity-100 mt-3"
                  : "max-h-0 pt-0 opacity-0 mt-0 pointer-events-none"
              }`}>
                {filteredSidebar.length > 0 ? (
                  filteredSidebar.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[color:var(--muted)] block px-0.5">
                        {section.title}
                      </span>
                      <div className="flex flex-col gap-1 pl-2 border-l border-[color:var(--border-faint)]">
                        {section.links.map((link) => {
                          const isActive = activeSection === link.id;
                          return (
                            <button
                              key={link.id}
                              onClick={() => scrollTo(link.id)}
                              className={`w-full text-left py-1 px-2 text-[11px] font-semibold rounded-lg transition-all ${
                                isActive
                                  ? "text-[color:var(--accent)] bg-[rgba(231,111,81,0.06)]"
                                  : "text-[color:var(--muted)] hover:text-[color:var(--ink)] hover:bg-[rgba(var(--surface-rgb),0.8)]"
                              }`}
                            >
                              {link.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[color:var(--muted)] italic px-0.5">No sections found.</p>
                )}
              </div>
            </div>
          </header>

          {/* Section: Installation */}
          <section id="installation" className={`${styles.docSection} space-y-4 pt-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Installation
            </h2>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              FlxOS requires ESP-IDF v5.5+ and a compatible ESP32 development board. Follow these steps to clone and build the repository.
            </p>
            <div className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-[color:var(--border-faint)] bg-[rgba(var(--surface-rgb),0.5)] flex items-center justify-between text-xs font-semibold text-[color:var(--muted)]">
                <span>Clone Repository</span>
                <button
                  onClick={() => copyToClipboard("git clone --recurse-submodules https://github.com/flxos-labs/flxos.git\ncd flxos", "clone")}
                  className="hover:text-[color:var(--ink)] flex items-center gap-1 transition-colors"
                >
                  {copiedBlock === "clone" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-[color:var(--ink)]">
                <code>{`git clone --recurse-submodules https://github.com/flxos-labs/flxos.git
cd flxos`}</code>
              </pre>
            </div>
          </section>

          {/* Section: Quick Start */}
          <section id="quick-start" className={`${styles.docSection} space-y-6 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.886H3.877l5.016 3.644L6.98 18.416 12 14.772l5.019 3.644-1.913-4.886 5.016-3.644h-6.211L12 3z"/></svg>
              Quick Start
            </h2>
            <p className="text-sm text-[color:var(--muted)]">Get FlxOS running on your ESP32 in just a few minutes.</p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(231,111,81,0.08)] border border-[rgba(231,111,81,0.15)] flex items-center justify-center font-display text-xs font-bold text-[color:var(--accent)]">1</div>
                <div className="space-y-2 flex-grow">
                  <h3 className="text-sm font-bold">Set up ESP-IDF environment</h3>
                  <div className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl overflow-hidden text-xs">
                    <pre className="p-3 overflow-x-auto font-mono text-[color:var(--ink)]">
                      <code>. $HOME/esp/esp-idf/export.sh</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(42,157,143,0.08)] border border-[rgba(42,157,143,0.15)] flex items-center justify-center font-display text-xs font-bold text-[color:var(--accent-2)]">2</div>
                <div className="space-y-2 flex-grow">
                  <h3 className="text-sm font-bold">List and Select Profile</h3>
                  <div className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl overflow-hidden text-xs">
                    <pre className="p-3 overflow-x-auto font-mono text-[color:var(--ink)]">
                      <code>{`python flxos.py list
python flxos.py select esp32s3-ili9341-xpt`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(233,196,106,0.08)] border border-[rgba(233,196,106,0.15)] flex items-center justify-center font-display text-xs font-bold text-[color:var(--accent-3)]">3</div>
                <div className="space-y-2 flex-grow">
                  <h3 className="text-sm font-bold">Build and Flash</h3>
                  <div className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl overflow-hidden text-xs">
                    <pre className="p-3 overflow-x-auto font-mono text-[color:var(--ink)]">
                      <code>{`python flxos.py build
python flxos.py flash --port /dev/ttyUSB0`}</code>
                    </pre>
                  </div>
                  <div className="flex gap-2 p-3.5 rounded-xl border border-[rgba(233,196,106,0.12)] bg-[rgba(233,196,106,0.04)] text-xs text-[color:var(--muted)] leading-relaxed">
                    <svg className="w-4 h-4 text-[color:var(--accent-3)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    <span>Board profiles are defined via YAML files inside the <code>Profiles/</code> directory.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Prerequisites */}
          <section id="prerequisites" className={`${styles.docSection} space-y-6 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              Prerequisites
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className={`${styles.featureCard} p-5 space-y-3`}>
                <h4 className="text-sm font-bold text-[color:var(--accent-2)]">Required Software</h4>
                <ul className="space-y-2 text-xs text-[color:var(--muted)]">
                  <li><strong>ESP-IDF v5.5+</strong> (Official Espressif SDK)</li>
                  <li><strong>CMake 3.16+</strong> (Build script parsing)</li>
                  <li><strong>Ninja build</strong> (Fast compilation backend)</li>
                  <li><strong>Python 3.10+</strong> (Script execution core)</li>
                </ul>
              </div>
              <div className={`${styles.featureCard} p-5 space-y-3`}>
                <h4 className="text-sm font-bold text-[color:var(--accent)]">Supported Hardware</h4>
                <ul className="space-y-2 text-xs text-[color:var(--muted)]">
                  <li>ESP32 &amp; ESP32-S3 (all footprints)</li>
                  <li>SPI TFT displays (ILI9341, ST7789, LovyanGFX targets)</li>
                  <li>Touch controllers (XPT2046 SPI, FT6336 I2C)</li>
                  <li>PSRAM (highly recommended for fluid double-buffering)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section: System Overview */}
          <section id="overview" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              System Overview
            </h2>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              FlxOS is architected as a modular operating system with a clear separation of concerns across physical and logical boundaries.
            </p>
            {/* Visual representation grid */}
            <div className="border border-[color:var(--border-faint)] rounded-2xl overflow-hidden bg-[rgba(var(--surface-rgb),0.55)] backdrop-blur-md shadow-sm p-5 space-y-3.5 max-w-md">
              <div className="p-3 text-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs font-bold">
                Application Layer (Settings, Files, Calendar apps)
              </div>
              <div className="text-center text-[color:var(--muted)] text-xs">↓</div>
              <div className="p-3 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold">
                Desktop Environment (Window Manager, Taskbar, Launcher)
              </div>
              <div className="text-center text-[color:var(--muted)] text-xs">↓</div>
              <div className="p-3 text-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold">
                System Services (Wi-Fi, Bluetooth, Storage)
              </div>
              <div className="text-center text-[color:var(--muted)] text-xs">↓</div>
              <div className="p-3 text-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold">
                Hardware Abstraction Layer (HAL Module, LovyanGFX, Drivers)
              </div>
              <div className="text-center text-[color:var(--muted)] text-xs">↓</div>
              <div className="p-3 text-center rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-xs font-bold">
                Bare Metal Kernel (ESP-IDF, FreeRTOS schedulers)
              </div>
            </div>
          </section>

          {/* Section: Directory Structure */}
          <section id="directory" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              Directory Structure
            </h2>
            <pre className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl p-4 overflow-x-auto text-xs leading-relaxed font-mono text-[color:var(--ink)]">
              <code>{`flxos/
├── Applications/    # User-facing apps (calendar, files, text editor, settings, ...)
├── Apps/            # App framework and lifecycle management
├── Buildscripts/    # CMake modules, profile loader, HW code generator
├── Connectivity/    # WiFi, networking modules
├── Core/            # Core OS headers and utilities
├── Firmware/        # Firmware entry point and initialization
├── HalModule/       # Hardware Abstraction Layer
├── Kernel/          # Kernel services (tasks, memory, logging)
├── Profiles/        # Board/device profiles (YAML + generated config)
├── Services/        # System services
├── System/          # System-level modules (drivers, buses)
├── UI/              # LVGL UI framework, themes
├── flxos.py         # Main CLI build tool
└── CMakeLists.txt   # Top-level CMake project file`}</code>
            </pre>
          </section>

          {/* Section: Core Modules */}
          <section id="modules" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 2 12 2ZM12 22V12" /><path d="M12 12L19.07 4.92999" /><path d="M12 12L4.92999 4.92999" /><path d="M12 12H22" /><path d="M12 12H2" /></svg>
              Core Modules
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={`${styles.featureCard} p-4 space-y-2`}>
                <h4 className="text-sm font-bold">Hardware Abstraction (HAL)</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Unified interface wrapping display drivers, touch controller coordinates, and storage blocks in a simple, profile-driven configuration.
                </p>
                <code className="block text-[10px] text-[color:var(--accent)] font-semibold">HalModule/</code>
              </div>
              <div className={`${styles.featureCard} p-4 space-y-2`}>
                <h4 className="text-sm font-bold">UI &amp; App Framework</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Provides standard event loops, screen containers, lifecycle events (create, resume, pause), and modular window bounds.
                </p>
                <code className="block text-[10px] text-[color:var(--accent-2)] font-semibold">UI/ &amp; Apps/</code>
              </div>
              <div className={`${styles.featureCard} p-4 space-y-2`}>
                <h4 className="text-sm font-bold">Connectivity</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Wi-Fi manager with automated connection retries, background scan, and custom network state emitters.
                </p>
                <code className="block text-[10px] text-[color:var(--accent-3)] font-semibold">Connectivity/</code>
              </div>
              <div className={`${styles.featureCard} p-4 space-y-2`}>
                <h4 className="text-sm font-bold">Applications</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Ships complete embedded apps (Files browser, Text Editor, Calendar widget, Settings controller, System Information).
                </p>
                <code className="block text-[10px] text-blue-500 font-semibold font-mono">Applications/</code>
              </div>
            </div>
          </section>

          {/* Section: Building */}
          <section id="building" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              Building
            </h2>
            <div className="flex gap-3 p-4 rounded-xl border border-red-500/12 bg-red-500/4 text-xs text-[color:var(--muted)] leading-relaxed">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m10.29 3.86 8 18a1 1 0 0 1-.9 1.4H4.61a1 1 0 0 1-.9-1.4l8-18a1 1 0 0 1 1.8 0zM12 9v4M12 17h.01"/></svg>
              <span><strong>Warning:</strong> Always select a hardware profile using <code>python flxos.py select &lt;id&gt;</code> before building the project.</span>
            </div>

            <div className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-[color:var(--border-faint)] bg-[rgba(var(--surface-rgb),0.5)] flex items-center justify-between text-xs font-semibold text-[color:var(--muted)]">
                <span>Compilation Commands</span>
                <button
                  onClick={() => copyToClipboard("python flxos.py build\npython flxos.py build --dev\npython flxos.py flash --port /dev/ttyUSB0", "build-cmd")}
                  className="hover:text-[color:var(--ink)] flex items-center gap-1 transition-colors"
                >
                  {copiedBlock === "build-cmd" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-[color:var(--ink)]">
                <code>{`# Standard build
python flxos.py build

# Dev build (faster builds, optimized symbols)
python flxos.py build --dev

# Flash and connect serial logger monitor
python flxos.py flash --port /dev/ttyUSB0`}</code>
              </pre>
            </div>
          </section>

          {/* Section: Configuration */}
          <section id="configuration" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Configuration
            </h2>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              FlxOS uses a declarative YAML profile system instead of traditional Espressif menuconfig for platform definitions. This maps displays, peripherals, and storage blocks cleanly.
            </p>
            <pre className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl p-4 overflow-x-auto text-xs font-mono text-[color:var(--ink)]">
              <code>{`python flxos.py list
python flxos.py diff a b --json`}</code>
            </pre>
            <h3 className="text-sm font-bold pt-2">Key Profile Mappings:</h3>
            <ul className="list-disc pl-5 text-xs text-[color:var(--muted)] space-y-1">
              <li><strong>SoC Target:</strong> Chip configuration and memory partitioning.</li>
              <li><strong>Display Interface:</strong> LCD Controller model (ILI9341, ST7789), SPI frequencies, pinouts.</li>
              <li><strong>Touch Interface:</strong> Coordinate mappings and I2C/SPI pins.</li>
              <li><strong>Peripherals:</strong> SD Card slot configurations and battery state ADC pins.</li>
            </ul>
          </section>

          {/* Section: Creating Apps */}
          <section id="apps" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Creating Apps
            </h2>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              Creating custom applications in FlxOS is simple. Inherit from the <code>App</code> class and override the lifecycle functions. Here is a basic template:
            </p>

            <div className="bg-[color:var(--surface-2)] border border-[color:var(--border-faint)] rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2 border-b border-[color:var(--border-faint)] bg-[rgba(var(--surface-rgb),0.5)] flex items-center justify-between text-xs font-semibold text-[color:var(--muted)]">
                <span>MyApp.hpp</span>
                <button
                  onClick={() => copyToClipboard(`#pragma once\n#include "App.hpp"\n\nclass MyApp : public App {\npublic:\n    MyApp() : App("MyApp", "My Application") {}\n    \n    void onCreate() override {\n        // Initialize app UI\n        lv_obj_t* label = lv_label_create(getContainer());\n        lv_label_set_text(label, "Hello, FlxOS!");\n    }\n    \n    void onResume() override {\n        // App brought to foreground\n    }\n    \n    void onPause() override {\n        // App sent to background\n    }\n};`, "app-code")}
                  className="hover:text-[color:var(--ink)] flex items-center gap-1 transition-colors"
                >
                  {copiedBlock === "app-code" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-[color:var(--ink)]">
                <code>{`#pragma once
#include "App.hpp"

class MyApp : public App {
public:
    MyApp() : App("MyApp", "My Application") {}
    
    void onCreate() override {
        // Initialize your app UI inside the root container
        lv_obj_t* label = lv_label_create(getContainer());
        lv_label_set_text(label, "Hello, FlxOS!");
    }
    
    void onResume() override {
        // Event triggered when app is focused
    }
    
    void onPause() override {
        // Event triggered when app is minimized
    }
};`}</code>
              </pre>
            </div>
          </section>

          {/* Section: API Reference */}
          <section id="api" className={`${styles.docSection} space-y-4 scroll-mt-24`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/></svg>
              API Reference
            </h2>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              Complete header API docs are actively generated. For current definitions, you can directly inspect the clean declarations in the source tree:
            </p>
            <div className="pt-2">
              <a
                href="https://github.com/flxos-labs/flxos/tree/main/Core"
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonStyles.primary} gap-2`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
                <span>Browse Header Directory</span>
              </a>
            </div>
          </section>

          {/* Section: Troubleshooting */}
          <section id="troubleshooting" className={`${styles.docSection} space-y-6 scroll-mt-24 pb-16`}>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[color:var(--accent-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              Troubleshooting
            </h2>

            <div className="space-y-4">
              <div className="border border-[color:var(--border-faint)] rounded-xl p-4 space-y-1 bg-[rgba(var(--surface-rgb),0.4)]">
                <h4 className="text-sm font-bold text-[color:var(--ink)]">Build fails with &quot;Target Not Set&quot;</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Make sure you have selected an active target profile before executing the compile command: <code>python flxos.py select &lt;profile&gt;</code>.
                </p>
              </div>

              <div className="border border-[color:var(--border-faint)] rounded-xl p-4 space-y-1 bg-[rgba(var(--surface-rgb),0.4)]">
                <h4 className="text-sm font-bold text-[color:var(--ink)]">Display shows garbage or remains black</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Check your SPI connections and pinout settings defined in the active profile&apos;s YAML structure. Double-check power supply levels; some displays require clean 5V lines.
                </p>
              </div>

              <div className="border border-[color:var(--border-faint)] rounded-xl p-4 space-y-1 bg-[rgba(var(--surface-rgb),0.4)]">
                <h4 className="text-sm font-bold text-[color:var(--ink)]">Touch clicks not responding or offset</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Make sure the touch driver chip matches your hardware model, and coordinate rotation variables (e.g. swap XY, invert X) match the screen orientation details.
                </p>
              </div>

              <div className="border border-[color:var(--border-faint)] rounded-xl p-4 space-y-1 bg-[rgba(var(--surface-rgb),0.4)]">
                <h4 className="text-sm font-bold text-[color:var(--ink)]">Wi-Fi fails to establish connection</h4>
                <p className="text-xs text-[color:var(--muted)] leading-relaxed">
                  Confirm that the SSID and password are correct. Ensure your router broadcasts a 2.4GHz network, as ESP32 chips do not support 5GHz frequencies.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-[rgba(42,157,143,0.12)] bg-[rgba(42,157,143,0.04)] justify-between items-center flex-wrap">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[color:var(--accent-2)]">Still need help?</h4>
                <p className="text-xs text-[color:var(--muted)] max-w-md leading-relaxed">
                  If you run into issues that aren&apos;t covered here, check open issues on our GitHub tracker or open a new one.
                </p>
              </div>
              <a
                href="https://github.com/flxos-labs/flxos/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonStyles.secondary} text-xs gap-2 py-2 px-4 border border-[rgba(42,157,143,0.25)] hover:bg-[rgba(42,157,143,0.08)]`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01" /></svg>
                <span>Report an Issue</span>
              </a>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
