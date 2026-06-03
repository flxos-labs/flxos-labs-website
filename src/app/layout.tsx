import type { Metadata } from "next";
import { Figtree, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteLayout from "../components/SiteLayout";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('flxos-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark';}else{document.documentElement.dataset.theme='light';}}catch(e){} })();`,
          }}
        />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
