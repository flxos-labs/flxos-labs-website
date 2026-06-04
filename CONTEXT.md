# 🧠 FlxOS Labs — Master Project Context

> **Last Updated:** 2026-06-04
> **Active Branch:** `develop` (HEAD: `bbfd7f9`)
> **Deployment:** [flxos-labs.github.io](https://flxos-labs.github.io) via Vercel
> **Repository:** [github.com/flxos-labs/flxos-labs.github.io](https://github.com/flxos-labs/flxos-labs.github.io)

---

## 📋 Project Overview

FlxOS Labs is the **marketing & showcase website** for the FlxOS project — a modular, profile-driven operating system spanning ESP32 microcontrollers to desktop platforms. It serves as the landing page, documentation hub, and feature showcase for the open-source community.

> [!NOTE]
> The private romantic dedication page (`/us`) was successfully migrated to a standalone repository (`solid-pancake`) on June 3, 2026. This repository is now 100% dedicated to FlxOS marketing and public-facing documentation.

---

## 🛠️ Tech Stack

| Layer             | Technology                                          | Version      |
| :---------------- | :-------------------------------------------------- | :----------- |
| **Framework**     | Next.js (App Router)                                | `16.2.6`     |
| **Language**      | TypeScript                                          | `^5`         |
| **UI Library**    | React                                               | `19.2.4`     |
| **Styling**       | Tailwind CSS v4 (via `@tailwindcss/postcss`)        | `^4`         |
| **Fonts**         | Google Fonts — Space Grotesk, Figtree, JetBrains Mono | via `next/font` |
| **Build System**  | Next.js built-in (Turbopack in dev)                 | —            |
| **Linting**       | ESLint with `eslint-config-next` (core-web-vitals + typescript) | `^9` |
| **Deployment**    | Vercel                                              | —            |

---

## 📁 File Structure Map

```
flxos-labs/
├── .env.local                          # Environment variables (gitignored)
├── .gitignore
├── CONTEXT.md                          # ← THIS FILE
├── README.md                           # Basic setup instructions
├── next.config.ts                      # Image remote patterns (github.com avatar)
├── tsconfig.json                       # TS config (ES2017, bundler resolution, @/* alias)
├── eslint.config.mjs                   # ESLint flat config
├── postcss.config.mjs                  # PostCSS with @tailwindcss/postcss
├── package.json                        # Dependencies & scripts
│
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│       ├── hardware/                   # 5 LilyGo T-HMI device photos (.jpg)
│       ├── screenshots/                # 32 FlxOS desktop simulator screenshots (.png, .webp)
│       └── og-image.png                # OpenGraph social share image
│
└── src/
    ├── app/
    │   ├── layout.tsx                  # Root layout — fonts, theme script, SiteLayout wrapper
    │   ├── globals.css                 # Global stylesheet (~110 lines) — Tailwind base directives and design tokens
    │   ├── page.module.css             # Page-specific styles (~320 lines)
    │   ├── page.tsx                    # Home page — hero, workflow, hardware, features, stack, CTA
    │   ├── not-found.tsx               # Custom 404 page
    │   ├── favicon.ico
    │   │
    │   ├── about/
    │   │   ├── page.tsx                # Metadata + AboutContent
    │   │   ├── AboutContent.module.css # Component-scoped styles (~125 lines)
    │   │   └── AboutContent.tsx        # About page client component (480 lines)
    │   │
    │   └── docs/
    │       ├── page.tsx                # Metadata + DocsContent
    │       ├── DocsContent.module.css  # Component-scoped styles (~90 lines)
    │       └── DocsContent.tsx         # Documentation page client component (641 lines)
    │
    ├── components/                     # Shared UI components
    │   ├── SiteLayout.module.css       # Layout shell styles
    │   ├── SiteLayout.tsx              # Shell wrapper — renders header, background, footer, command palette
    │   ├── Header.module.css           # Header navigation styles (~310 lines)
    │   ├── Header.tsx                  # Nav bar — desktop + mobile drawer, theme toggle, command palette trigger
    │   ├── CommandPalette.tsx          # Ctrl+K command palette — search & navigate
    │   ├── InteractiveBackground.tsx   # Animated background for main site (496 lines)
    │   ├── DeviceSlideshow.module.css  # Slideshow styles
    │   ├── DeviceSlideshow.tsx         # Hero section device screenshot slideshow
    │   ├── ThemeToggle.module.css      # Theme toggle button styles
    │   ├── ThemeToggle.tsx             # Light/dark theme switcher
    │   ├── PlatformCycler.tsx          # Animated "ESP32" text cycler in hero heading
    │   ├── Buttons.module.css          # Button variant styles (primary, secondary, ghost)
    │   └── CopyCommand.tsx             # Click-to-copy CLI command component
    │
    └── lib/                            # Shared utilities
        ├── docs-menu.ts                # Sidebar menu navigation items
        ├── scrollLock.ts               # Reusable scroll lock/unlock with ref counting
        └── supabase.ts                 # Legacy Supabase client (unused/deprecated)
```

### Source Code Statistics

| Metric                    | Value       |
| :------------------------ | :---------- |
| **Total source files**    | 27          |
| **Total lines of code**   | ~4,100      |
| **Largest file**          | `DocsContent.tsx` (641 lines) |
| **Largest component**     | `DocsContent.tsx` (641 lines) |
| **Image assets**          | 38 files    |

---

## 🏗️ Architecture & Design Patterns

### Rendering Strategy

- **Server Components (default):** Page-level components (`page.tsx`) for metadata, SEO, JSON-LD
- **Client Components (`"use client"`):** Interactive UI components (Header, CommandPalette, etc.)

### Layout System

```
RootLayout (layout.tsx)
  └── SiteLayout (client)
        ├── InteractiveBackground
        ├── Header
        ├── children (page content)
        ├── Footer
        └── CommandPalette
```

### Theme System

- **Two themes:** `light` and `dark`
- **Storage:** `localStorage('flxos-theme')`
- **Anti-flash:** Inline `<script>` in `<body>` sets `data-theme` before paint
- **CSS Variables:** All colors defined as CSS custom properties in `globals.css` under `[data-theme="light"]` and `[data-theme="dark"]`

---

## 🎨 Styling Conventions

### CSS Organization

The styling system is split between:
1. **Global stylesheet (`globals.css` — ~110 lines)** containing Tailwind base imports, theme-based CSS variables (design tokens), and body resets.
2. **Component-scoped CSS Modules (`*.module.css`)** containing component-specific layouts, styles, and custom `@keyframes` animations.

### Naming Patterns

| Pattern         | Usage                          | Example                  |
| :-------------- | :----------------------------- | :----------------------- |
| `.site-*`       | Main site shell components     | `.site-header`, `.site-nav` |
| `.btn-*`        | Button variants                | `.btn-primary`, `.btn-secondary` |
| `.feature-*`    | Feature section cards          | `.feature-card`          |
| `.hardware-*`   | Hardware gallery section       | `.hardware-card`, `.hardware-photo` |
| `.workflow-*`   | Workflow/step section          | `.workflow-step`         |

### Typography Scale

| Variable         | Font Family     | Usage              |
| :--------------- | :-------------- | :----------------- |
| `--font-display` | Space Grotesk   | Headings, branding |
| `--font-body`    | Figtree         | Body text          |
| `--font-mono`    | JetBrains Mono  | Code, KBD          |

---

## 🔀 Git Branching Strategy

| Branch                      | Purpose                                           |
| :-------------------------- | :------------------------------------------------- |
| `main`                      | Production-ready, deployed branch                  |
| `develop` *(active)*        | Active development branch                          |
| `fix/phase-1-review-violations` | Fix branch for review issues                  |
| `phase-2/hero-overhaul`    | Feature branch for hero section redesign           |

---

## ⚡ Performance Optimizations Applied

- **Image optimization:** Next.js `<Image>` component with `fill` + `sizes` attributes for responsive loading
- **Font optimization:** `next/font/google` with `display: "swap"` for all font families
- **Anti-flash theme:** Inline script prevents theme flash on page load
- **Scroll lock ref counting:** Multiple overlays (mobile menu, command palette) don't conflict

---

## 🧩 Component Dependency Graph

```
RootLayout
└── SiteLayout
    ├── InteractiveBackground
    ├── Header
    │   ├── ThemeToggle
    │   └── scrollLock (lib)
    ├── [Page Content]
    │   ├── Home: PlatformCycler, DeviceSlideshow, CopyCommand
    │   ├── About: AboutContent
    │   └── Docs: DocsContent
    ├── Footer (inline in SiteLayout)
    └── CommandPalette
        └── scrollLock (lib)
```

---

## 🚧 Current Status & Known State

### Known Areas for Improvement
- No automated tests exist
- No CI/CD pipeline configured

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check (manual)
npx tsc --noEmit
```
