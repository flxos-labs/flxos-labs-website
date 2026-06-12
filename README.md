# ⚡ FlxOS Labs

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

**FlxOS Labs** is the modern showcase, marketing, and documentation hub for the [FlxOS project](https://github.com/flxos-labs/flxos) — a modular, profile-driven operating system spanning embedded platforms (such as ESP32) to full desktop experiences.

Designed with rich aesthetics, glassmorphism, responsive grids, and interactive elements, this landing page provides a seamless window into the FlxOS ecosystem.

---

## 🎨 Design & Interaction Features

- **Dynamic Interactive Background:** A custom canvas-based particle network that reacts dynamically to theme changes and user actions.
- **Glassmorphic Styling:** Sleek, modern overlays using backdrop filters and tailored HSL color systems.
- **Command Palette:** Quick-access terminal drawer (`Ctrl + K` or search bar) built for keyboard-first site-wide navigation.
- **Responsive Layout:** A modular interface supporting form factors from mobile devices to ultrawide screens.
- **System Platform Cycler:** Interactive text cycler illustrating the versatility of FlxOS.
- **Anti-Theme-Flash Sync:** Lightweight, render-blocking script synchronized with `localStorage` to guarantee immediate light/dark styling without flash.

---

## 🛠️ Technology Stack

| Layer | Technology / Package | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js v16.2.6 (App Router)](https://nextjs.org/) | Core application architecture and routing. |
| **UI Library** | [React v19.2.4](https://react.dev/) | Component-driven interface development. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Styling foundation with PostCSS compiler. |
| **Language** | [TypeScript v5](https://www.typescriptlang.org/) | Strict static typing and code reliability. |
| **Fonts** | Space Grotesk, Figtree, JetBrains Mono | Curated typography via `next/font/google`. |
| **Icons & Media**| Custom Responsive Images & SVGs | Rich graphical representations of LilyGo T-HMI hardware. |

---

## 📂 Project Structure Map

Here is the outline of the main directories and components in this repository:

```text
flxos-labs/
├── public/                     # Static assets (LilyGo T-HMI photos, simulators, config)
│   ├── images/
│   │   ├── hardware/           # LilyGo T-HMI device photos (.jpg)
│   │   └── screenshots/        # FlxOS desktop simulator screenshots (.png, .webp)
│   └── og-image.png            # OpenGraph card for social shares
└── src/
    ├── app/                    # Next.js App Router views
    │   ├── about/              # About pages and specific content
    │   ├── docs/               # Documentation system client pages
    │   ├── globals.css         # Tailwind base imports & custom theme tokens
    │   └── page.tsx            # Main Landing / Showcase page
    ├── components/             # Reusable UI elements
    │   ├── SiteLayout.tsx      # Application layout shell (includes header/footer)
    │   ├── CommandPalette.tsx  # Keyboard-friendly drawer menu
    │   ├── ThemeToggle.tsx     # Light/Dark transition logic
    │   └── DeviceSlideshow.tsx # Showcase gallery slideshow
    └── lib/                    # Shared helper utilities
```

---

## 🚀 Getting Started

To run the FlxOS Labs website locally, follow these steps:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and `npm` installed.

### 1. Clone the Repository
```bash
git clone https://github.com/flxos-labs/flxos-labs.github.io.git
cd flxos-labs.github.io
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## ⚡ Development & Build Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the development server with hot reloading. |
| `npm run build` | Compiles a production-ready bundle of the site. |
| `npm run start` | Runs the compiled production server. |
| `npm run lint` | Analyzes code for quality, correctness, and potential bugs. |
| `npx tsc --noEmit` | Manually triggers the TypeScript type-checker. |

---

## ⚙️ Key Optimization Highlights

- **Font Optimization:** Google Fonts loaded with `next/font` using `display: swap` to prevent layout shifts.
- **Images:** Fully optimized with custom layouts, sizes, formats (`webp`/`jpg`), and modern lazy-loading practices via the `next/image` component.
- **Ref-Counted Scroll Lock:** Dynamic UI elements (mobile drawer, modals) lock page scrolling safely without visual glitches or double-locking conflicts.
- **CSS Modules Integration:** Isolated styles to avoid scope pollution, while preserving global Tailwind design tokens.

---

## 📄 License & Deploy

- **License:** Open Source under the project licensing terms.
- **Deployment:** Fully compatible and optimized for deployment to [Vercel](https://vercel.com).
