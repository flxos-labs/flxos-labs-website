"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { lockScroll, unlockScroll } from "../lib/scrollLock";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when pathname changes (e.g. page navigation)
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMobileMenuOpen(false);
    });
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [mobileMenuOpen]);

  const toggleCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" href="/" aria-label="FlxOS home">
            <span className="brand-mark" aria-hidden="true">
              F
            </span>
            <span className="brand-text">FlxOS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="site-nav" aria-label="Primary">
            <Link className="nav-link" href="/#features">
              Features
            </Link>
            <Link className="nav-link" href="/docs">
              Docs
            </Link>
            <Link className="nav-link" href="/about">
              About
            </Link>
            <a
              className="nav-link"
              href="https://github.com/flxos-labs/flxos"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link className="nav-link us-nav-heart" href="/us" title="For Us" aria-label="For Us">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ display: "inline-block", verticalAlign: "middle" }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="site-header-actions">
            {/* Search Button for Mobile (opens Command Palette) */}
            <button
              onClick={toggleCommandPalette}
              className="mobile-search-btn"
              aria-label="Open search palette"
              title="Search documentation and commands"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>

            <ThemeToggle />

            {/* Desktop Star on GitHub */}
            <a
              className="cta-pill desktop-cta"
              href="https://github.com/flxos-labs/flxos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star on GitHub
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <div className={`mobile-drawer-backdrop ${mobileMenuOpen ? "active" : ""}`} onClick={handleCloseMobileMenu} />
      
      <div className={`mobile-drawer ${mobileMenuOpen ? "active" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <span className="drawer-title">Navigation</span>
          <button
            onClick={handleCloseMobileMenu}
            className="drawer-close"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="mobile-drawer-nav overflow-y-auto max-h-[calc(100vh-140px)] pr-1 pb-6">
          <Link href="/#features" className="drawer-link" onClick={handleCloseMobileMenu}>
            Features
          </Link>
          <Link href="/docs" className="drawer-link" onClick={handleCloseMobileMenu}>
            Docs
          </Link>
          <Link href="/about" className="drawer-link" onClick={handleCloseMobileMenu}>
            About
          </Link>
          <a
            href="https://github.com/flxos-labs/flxos"
            className="drawer-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCloseMobileMenu}
          >
            GitHub
          </a>
          <Link href="/us" className="drawer-link" style={{ color: "#e8475f" }} onClick={handleCloseMobileMenu}>
            For Us ❤️
          </Link>
          <div className="drawer-divider" />
          <a
            className="drawer-cta"
            href="https://github.com/flxos-labs/flxos"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCloseMobileMenu}
          >
            Star on GitHub
          </a>


        </nav>
      </div>
    </>
  );
}
