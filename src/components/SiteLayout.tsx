"use client";

import React from "react";
import Header from "./Header";
import CommandPalette from "./CommandPalette";
import InteractiveBackground from "./InteractiveBackground";
import Link from "next/link";
import styles from "./SiteLayout.module.css";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {

  return (
    <>
      <InteractiveBackground />
      <div className={styles.shell}>
        <Header />
        {children}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div>
              <span className={styles.footerBrand}>FlxOS Labs</span>
              <p className={styles.footerCopy}>
                Modular OS for embedded devices and the desktop horizon.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/#features">Features</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/about">About</Link>
              <a
                href="https://github.com/flxos-labs/flxos"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
      <CommandPalette />
    </>
  );
}
