"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface PaletteItem {
  label: string;
  sub: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const items: PaletteItem[] = [
    {
      label: "Home Page",
      sub: "Return to the main overview",
      href: "/",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
      ),
    },
    {
      label: "Features Section",
      sub: "Explore modular profiles and multitasking app frameworks",
      href: "/#features",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
      ),
    },
    {
      label: "Tech Stack",
      sub: "View ESP-IDF, LVGL, Python CLI structure",
      href: "/#stack",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      ),
    },
    {
      label: "FlxOS Documentation",
      sub: "Guides for installation, select profiles, and API reference",
      href: "/docs",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></svg>
      ),
    },
    {
      label: "About FlxOS Labs",
      sub: "Read our story, creator profile, and milestones",
      href: "/about",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      ),
    },
    {
      label: "GitHub Code Repository",
      sub: "Star us, report issues, and send pull requests",
      href: "https://github.com/flxos-labs/flxos",
      external: true,
      icon: (
        <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
      ),
    },
  ];

  // Open / Close actions
  const openPalette = () => {
    setIsOpen(true);
    setSearch("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
  };

  const closePalette = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  // Keystroke & custom event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };

    const handleToggleEvent = () => {
      if (isOpen) {
        closePalette();
      } else {
        openPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggle-command-palette", handleToggleEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggle-command-palette", handleToggleEvent);
    };
  }, [isOpen]);

  // Command selection execution
  const executeItem = (item: PaletteItem) => {
    closePalette();
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  };

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const filtered = items.filter(
      (item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.sub.toLowerCase().includes(search.toLowerCase())
    );

    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        executeItem(filtered[activeIndex]);
      }
    }
  };

  // Auto-scroll inside list container
  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector(
      `[data-index="${activeIndex}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.sub.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) {
    // Show a floating indicator in bottom-right corner for accessibility discovery
    return (
      <button
        onClick={openPalette}
        className="fixed bottom-6 right-6 hidden md:flex items-center gap-2 px-3 py-1.5 bg-[rgba(var(--surface-rgb),0.85)] border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.15)] text-[10px] text-[color:var(--muted)] font-semibold shadow-lg hover:shadow-xl rounded-xl z-40 transition-all cursor-pointer backdrop-blur-md"
        aria-label="Open Command Palette"
      >
        <span>Search</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[color:var(--surface-2)] border border-[rgba(0,0,0,0.06)] font-mono text-[9px] text-[color:var(--ink)]">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 md:pt-36 px-4">
      {/* Backdrop */}
      <div
        onClick={closePalette}
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[rgba(var(--surface-rgb),0.92)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden z-10 flex flex-col max-h-[75vh] md:max-h-[440px] animate-reveal-up">
        {/* Search Bar Input */}
        <div className="relative flex items-center border-b border-[rgba(0,0,0,0.05)] px-4">
          <span className="text-[color:var(--muted)]">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a page section or command..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent border-0 outline-none text-xs md:text-sm text-[color:var(--ink)] py-4 px-3 placeholder-[color:var(--muted)]"
          />
          <button
            onClick={closePalette}
            className="text-[10px] px-2 py-0.5 rounded border border-[rgba(0,0,0,0.1)] text-[color:var(--muted)] font-mono font-semibold"
            aria-label="Close"
          >
            ESC
          </button>
        </div>

        {/* Scrollable List Container */}
        <div
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto p-2.5 space-y-1"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  data-index={idx}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-start gap-3.5 p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-[rgba(231,111,81,0.08)] border border-[rgba(231,111,81,0.15)] text-[color:var(--ink)]"
                      : "border border-transparent text-[color:var(--muted)] hover:bg-[rgba(var(--surface-rgb),0.55)]"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-8.5 h-8.5 rounded-lg flex items-center justify-center border transition-all ${
                      isActive
                        ? "bg-[rgba(231,111,81,0.12)] border-[rgba(231,111,81,0.25)] text-[color:var(--accent)]"
                        : "bg-[color:var(--surface-2)] border-[rgba(0,0,0,0.05)] text-[color:var(--muted)]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-grow space-y-0.5 min-w-0">
                    <span
                      className={`block font-display text-xs font-bold ${
                        isActive ? "text-[color:var(--ink)]" : "text-[color:var(--ink)]"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="block text-[10px] text-[color:var(--muted)] truncate leading-snug">
                      {item.sub}
                    </span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-mono text-[color:var(--accent)] self-center pr-1.5 font-bold">
                      ⏎
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-[color:var(--muted)] italic">
              No matching pages or anchors found.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-[rgba(var(--surface-rgb),0.5)] border-t border-[rgba(0,0,0,0.04)] px-4 py-2 flex items-center gap-4 text-[9px] text-[color:var(--muted)] font-semibold">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-neutral-300 font-mono text-[8px] bg-white">↑↓</kbd> to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-neutral-300 font-mono text-[8px] bg-white">Enter</kbd> to select
          </span>
        </div>
      </div>
    </div>
  );
}
