"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when pathname changes (e.g. page navigation)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
      <div className={`mobile-drawer-backdrop ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      
      <div className={`mobile-drawer ${mobileMenuOpen ? "active" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <span className="drawer-title">Navigation</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="drawer-close"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="mobile-drawer-nav">
          <Link href="/#features" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link href="/docs" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
            Docs
          </Link>
          <Link href="/about" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <a
            href="https://github.com/flxos-labs/flxos"
            className="drawer-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
          >
            GitHub
          </a>
          <div className="drawer-divider" />
          <a
            className="drawer-cta"
            href="https://github.com/flxos-labs/flxos"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
          >
            Star on GitHub
          </a>
        </nav>
      </div>
    </>
  );
}
