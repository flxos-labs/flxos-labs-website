"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import CommandPalette from "./CommandPalette";
import InteractiveBackground from "./InteractiveBackground";
import Link from "next/link";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname();
  const isUsPage = pathname === "/us" || pathname.startsWith("/us/");

  if (isUsPage) {
    return <>{children}</>;
  }

  return (
    <>
      <InteractiveBackground />
      <div className="site-shell">
        <Header />
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <span className="footer-brand">FlxOS Labs</span>
              <p className="footer-copy">
                Modular OS for embedded devices and the desktop horizon.
              </p>
            </div>
            <div className="footer-links">
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
