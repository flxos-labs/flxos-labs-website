import type { Metadata } from "next";
import { Figtree, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const fontDisplay = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const fontBody = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlxOS - Modular OS from ESP32 to Desktop",
  description:
    "FlxOS is a modular, profile-driven operating system spanning ESP32 microcontrollers to desktop platforms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body className="min-h-screen text-[color:var(--ink)]">
        <div className="site-shell">
          <header className="site-header">
            <div className="site-header-inner">
              <a className="brand" href="/" aria-label="FlxOS home">
                <span className="brand-mark" aria-hidden="true">
                  F
                </span>
                <span className="brand-text">FlxOS</span>
              </a>
              <nav className="site-nav" aria-label="Primary">
                <a className="nav-link" href="/#features">
                  Features
                </a>
                <a className="nav-link" href="/docs">
                  Docs
                </a>
                <a className="nav-link" href="/about">
                  About
                </a>
                <a
                  className="nav-link"
                  href="https://github.com/flxos-labs/flxos"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </nav>
              <a
                className="cta-pill"
                href="https://github.com/flxos-labs/flxos"
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on GitHub
              </a>
            </div>
          </header>
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
                <a href="/#features">Features</a>
                <a href="/docs">Docs</a>
                <a href="/about">About</a>
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
      </body>
    </html>
  );
}
