"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { lockScroll, unlockScroll } from "../lib/scrollLock";
import styles from "./Header.module.css";

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
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link className={styles.brand} href="/" aria-label="FlxOS home">
            <span className={styles.brandMark} aria-hidden="true">
              F
            </span>
            <span className={styles.brandText}>FlxOS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="Primary">
            <Link className={styles.navLink} href="/#features">
              Features
            </Link>
            <Link className={styles.navLink} href="/docs">
              Docs
            </Link>
            <Link className={styles.navLink} href="/about">
              About
            </Link>
            <a
              className={styles.navLink}
              href="https://github.com/flxos-labs/flxos"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>

          {/* Header Actions */}
          <div className={styles.actions}>
            {/* Search Button for Mobile (opens Command Palette) */}
            <button
              onClick={toggleCommandPalette}
              className={styles.mobileSearchButton}
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
              className={`${styles.ctaPill} ${styles.desktopCta}`}
              href="https://github.com/flxos-labs/flxos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Star on GitHub
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerActive : ""}`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={styles.hamburgerBox}>
                <span className={styles.hamburgerInner}></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <div className={`${styles.drawerBackdrop} ${mobileMenuOpen ? styles.drawerBackdropActive : ""}`} onClick={handleCloseMobileMenu} />
      
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.mobileDrawerActive : ""}`} role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div className={styles.mobileDrawerHeader}>
          <span className={styles.drawerTitle}>Navigation</span>
          <button
            onClick={handleCloseMobileMenu}
            className={styles.drawerClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className={`${styles.mobileDrawerNav} overflow-y-auto max-h-[calc(100vh-140px)] pr-1 pb-6`}>
          <Link href="/#features" className={styles.drawerLink} onClick={handleCloseMobileMenu}>
            Features
          </Link>
          <Link href="/docs" className={styles.drawerLink} onClick={handleCloseMobileMenu}>
            Docs
          </Link>
          <Link href="/about" className={styles.drawerLink} onClick={handleCloseMobileMenu}>
            About
          </Link>
          <a
            href="https://github.com/flxos-labs/flxos"
            className={styles.drawerLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCloseMobileMenu}
          >
            GitHub
          </a>
          <div className={styles.drawerDivider} />
          <a
            className={styles.drawerCta}
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
