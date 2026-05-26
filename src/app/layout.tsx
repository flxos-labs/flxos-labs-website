import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'FlxOS - Modular OS from ESP32 to Desktop',
  description: 'FlxOS is a modular, profile-driven operating system — from ESP32 microcontrollers to desktop platforms. Built on ESP-IDF, LVGL, and LovyanGFX.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha384-iw3OoTErCYJJB9mCa8LNS2hbsQ7M3C0EpIsO/H5+EGAkPGc6rk+V8i04oW/K5xq0"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23F59E0B'/%3E%3Ctext x='50' y='70' font-family='sans-serif' font-size='60' font-weight='bold' fill='%230A0A0B' text-anchor='middle'%3EF%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body>
        <div id="scroll-progress" aria-hidden="true"></div>
        <a href="#main-content" className="skip-to-main">Skip to main content</a>
        <div className="cursor-glow"></div>
        <div className="menu-backdrop" id="menuBackdrop" aria-hidden="true"></div>
        
        <div className="hero-gradient-mesh" aria-hidden="true">
            <div className="mesh-orb mesh-orb-1"></div>
            <div className="mesh-orb mesh-orb-2"></div>
            <div className="mesh-orb mesh-orb-3"></div>
        </div>

        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="container nav-container">
                <a href="/" className="logo" aria-label="FlxOS Home">
                    <div className="logo-icon" aria-hidden="true"></div>
                    <span>FlxOS</span>
                </a>
                <div className="nav-links">
                    <a href="/#features">Features</a>
                    <a href="/#screenshots">Gallery</a>
                    <a href="/#tech-stack">Tech Stack</a>
                    <a href="/#roadmap">Roadmap</a>
                    <a href="/#community">Community</a>
                    <a href="/docs">Docs</a>
                    <a href="/about">About</a>
                    <button id="themeToggle" aria-label="Toggle theme">
                        <i className="fas fa-sun"></i>
                    </button>
                    <a href="https://github.com/flxos-labs/flxos" target="_blank" rel="noopener noreferrer"
                        className="github-link">
                        <i className="fab fa-github"></i> GitHub
                    </a>
                </div>
                <button className="mobile-menu-btn" aria-label="Toggle menu">
                    <i className="fas fa-bars"></i>
                </button>
            </div>
        </nav>

        <main id="main-content">
          {children}
        </main>
        <Script src="/js/script.js" strategy="afterInteractive" />
        <Script src="/js/docs.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
