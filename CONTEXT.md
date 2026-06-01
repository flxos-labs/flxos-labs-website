# 🧠 FlxOS Labs — Master Project Context

> **Last Updated:** 2026-06-01
> **Active Branch:** `develop` (HEAD: `5c037e0`)
> **Deployment:** [flxos-labs.github.io](https://flxos-labs.github.io) via Vercel
> **Repository:** [github.com/flxos-labs/flxos-labs.github.io](https://github.com/flxos-labs/flxos-labs.github.io)

---

## 📋 Project Overview

FlxOS Labs is the **marketing & showcase website** for the FlxOS project — a modular, profile-driven operating system spanning ESP32 microcontrollers to desktop platforms. The site also hosts a **private cinematic romance dedication page** (`/us`) gated behind secure authentication.

### Two Distinct Experiences

| Surface        | Purpose                                                    | Audience         |
| :------------- | :--------------------------------------------------------- | :--------------- |
| **Main Site**  | Product marketing — features, docs, about, hardware demos  | Public / OSS     |
| **`/us` Page** | Private cinematic romance page dedicated to Rekha by Akash | Private (gated)  |

---

## 🛠️ Tech Stack

| Layer             | Technology                                          | Version      |
| :---------------- | :-------------------------------------------------- | :----------- |
| **Framework**     | Next.js (App Router)                                | `16.2.6`     |
| **Language**      | TypeScript                                          | `^5`         |
| **UI Library**    | React                                               | `19.2.4`     |
| **Styling**       | Tailwind CSS v4 (via `@tailwindcss/postcss`)        | `^4`         |
| **Backend/BaaS**  | Supabase (Auth rate-limiting, data persistence)     | `^2.106.2`   |
| **Fonts**         | Google Fonts — Space Grotesk, Figtree, JetBrains Mono | via `next/font` |
| **Build System**  | Next.js built-in (Turbopack in dev)                 | —            |
| **Linting**       | ESLint with `eslint-config-next` (core-web-vitals + typescript) | `^9` |
| **Deployment**    | Vercel                                              | —            |

### Key Environment Variables (`.env.local`)

| Variable                        | Purpose                                |
| :------------------------------ | :------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL (client-side)     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client-side)        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Admin key for server-side ops (optional) |
| `US_PAGE_PASSCODE`              | Secret passcode for `/us` auth gate    |
| `US_PAGE_AUTH_SECRET`           | HMAC signing secret for auth tokens    |

---

## 📁 File Structure Map

```
flxos-labs/
├── .env.local                          # Environment variables (gitignored)
├── .gitignore
├── CONTEXT.md                          # ← THIS FILE
├── README.md                           # Basic setup instructions
├── summary.md                          # Cinematic intro animation summary
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
│       ├── screenshots/                # 20 FlxOS desktop simulator screenshots (.png, .webp)
│       ├── her.jpg                     # /us page — Rekha's photo
│       ├── me.jpg                      # /us page — Akash's photo
│       └── og-image.png               # OpenGraph social share image
│
└── src/
    ├── app/
    │   ├── layout.tsx                  # Root layout — fonts, theme script, SiteLayout wrapper
    │   ├── globals.css                 # Master stylesheet (4535 lines) — design tokens, components, animations
    │   ├── page.tsx                    # Home page — hero, workflow, hardware, features, stack, CTA
    │   ├── not-found.tsx               # Custom 404 page
    │   ├── favicon.ico
    │   │
    │   ├── about/
    │   │   ├── page.tsx                # Metadata + AboutContent
    │   │   └── AboutContent.tsx        # About page client component (478 lines)
    │   │
    │   ├── docs/
    │   │   ├── page.tsx                # Metadata + DocsContent
    │   │   └── DocsContent.tsx         # Documentation page client component (632 lines)
    │   │
    │   ├── us/                         # ⭐ Private romantic dedication page
    │   │   ├── page.tsx                # Metadata, JSON-LD, auth gate wrapper
    │   │   ├── layout.tsx              # /us sub-layout
    │   │   ├── UsAuthGate.tsx          # Password-gated lock screen (238 lines)
    │   │   ├── UsContent.tsx           # Main romance page content (2535 lines) — LARGEST FILE
    │   │   └── StarfieldCanvas.tsx     # Parallax starfield background (775 lines)
    │   │
    │   └── api/
    │       └── us/
    │           └── auth/
    │               └── route.ts        # Auth API — passcode validation, HMAC tokens, rate limiting (338 lines)
    │
    ├── components/                     # Shared UI components (main site only)
    │   ├── SiteLayout.tsx              # Shell wrapper — conditionally hides header/footer on /us
    │   ├── Header.tsx                  # Nav bar — desktop + mobile drawer, theme toggle, command palette trigger
    │   ├── CommandPalette.tsx           # Ctrl+K command palette — search & navigate
    │   ├── InteractiveBackground.tsx   # Animated background for main site (496 lines)
    │   ├── DeviceSlideshow.tsx         # Hero section device screenshot slideshow
    │   ├── ThemeToggle.tsx             # Light/dark theme switcher
    │   ├── PlatformCycler.tsx          # Animated "ESP32" text cycler in hero heading
    │   └── CopyCommand.tsx            # Click-to-copy CLI command component
    │
    └── lib/                            # Shared utilities
        ├── supabase.ts                 # Supabase client + admin client initialization
        └── scrollLock.ts               # Reusable scroll lock/unlock with ref counting
```

### Source Code Statistics

| Metric                    | Value       |
| :------------------------ | :---------- |
| **Total source files**    | 24          |
| **Total lines of code**   | ~10,300     |
| **Largest file**          | `globals.css` (4,535 lines) |
| **Largest component**     | `UsContent.tsx` (2,535 lines) |
| **Image assets**          | 40 files    |

---

## 🏗️ Architecture & Design Patterns

### Rendering Strategy

- **Server Components (default):** Page-level components (`page.tsx`) for metadata, SEO, JSON-LD
- **Client Components (`"use client"`):** All interactive components (Header, UsContent, CommandPalette, etc.)
- **API Routes:** `/api/us/auth/route.ts` — server-side only

### Layout System

```
RootLayout (layout.tsx)
  └── SiteLayout (client)
        ├── [if /us] → children only (no header/footer)
        └── [else]
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

### `/us` Page Architecture

The `/us` page operates as an **isolated experience** with its own:
- Dark theme (always, no toggle)
- Starfield background canvas
- No header/footer from the main site
- Multi-phase cinematic intro animation (10-second choreographed sequence)
- Password-gated authentication via `UsAuthGate`

**Authentication Flow:**
1. `UsAuthGate` checks `localStorage` for stored HMAC token
2. If found → verifies token via `GET /api/us/auth` (Bearer header)
3. If not found → shows password lock screen
4. On submit → `POST /api/us/auth` validates passcode, returns HMAC token
5. Rate limiting: 5 attempts / 15-min window, 15-min lockout (Supabase-backed with in-memory fallback)

**Cinematic Intro Phases:**
| Phase | Time       | Effect                                        |
| :---- | :--------- | :--------------------------------------------- |
| 1     | 0–2s       | Projector glow, golden dust particles, film grain |
| 2     | 2–4s       | Monogram crest "A ♥ R" fades in               |
| 3     | 4–5.5s     | Tagline typewriter + golden rule animation     |
| 4     | 5.5–7s     | Light wash + lens flare + zoom-dissolve        |
| 5     | 7–9s       | Velvet curtains part, medallion splits         |
| 6     | 9–10.2s    | Transition cleanup                             |
| 7     | 10.2s+     | Overlay unmounts, full interaction enabled     |

**`/us` Sections (in scroll order):**
1. Hero — photos, love counter (live odometer), compliments, music player
2. "Our Love Story" — interactive timeline with expandable memories
3. "Reasons I Love You" — 8-card horizontal carousel
4. "Heart Constellation" — drag-to-connect star game
5. "Our Love Foundation" — interactive value nodes
6. "Love Oracle" — random cosmic predictions
7. "Love Dashboard" — animated stats with progress bars
8. "How Well Do You Know Me?" — 15-question interactive quiz
9. "Flip Through Our Memories" — category-filtered flip cards
10. "Deep Questions" — accordion-style Q&A
11. "My Promises to You" — checkable promise list with particle effects
12. "Compliment Jar" — random compliment generator with jar animation
13. "A Letter to Our Future" — expandable wax-sealed letter
14. Footer — back-to-top, navigation link

---

## 🎨 Styling Conventions

### CSS Organization (`globals.css` — 4535 lines)

The global stylesheet is a **monolith** containing:
1. **Tailwind directives** (`@import "tailwindcss"`)
2. **CSS custom properties** (design tokens for both themes)
3. **Base resets and typography**
4. **Component-specific styles** (`.site-header`, `.brand`, `.btn-primary`, etc.)
5. **Page-specific styles** (`.us-*` prefix for the /us page)
6. **Animations** (`@keyframes` for all micro-animations, intro phases, particles)
7. **Responsive breakpoints** (mobile-first with `@media` queries)

### Naming Patterns

| Pattern         | Usage                          | Example                  |
| :-------------- | :----------------------------- | :----------------------- |
| `.site-*`       | Main site shell components     | `.site-header`, `.site-nav` |
| `.us-*`         | `/us` page exclusive styles    | `.us-auth-card`, `.us-section-glow` |
| `.btn-*`        | Button variants                | `.btn-primary`, `.btn-ghost` |
| `.feature-*`    | Feature section cards          | `.feature-card`          |
| `.hardware-*`   | Hardware gallery section       | `.hardware-card`, `.hardware-photo` |
| `.workflow-*`   | Workflow/step section          | `.workflow-step`         |
| `.drawer-*`     | Mobile navigation drawer       | `.drawer-link`, `.drawer-cta` |
| BEM-like modifiers | State variants              | `.us-auth-card--shake`, `--error` |

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
| `backup/*`                  | Manual backup snapshots before major changes       |

### Commit Convention

Commits follow **conventional commits** format:
- `feat:` — New features
- `fix:` — Bug fixes
- `refactor:` — Code restructuring without behavior change
- `style:` — Styling/layout changes
- `chore:` — Maintenance tasks
- `docs:` — Documentation updates

---

## 🔐 Security Architecture

| Concern             | Implementation                                     |
| :------------------ | :------------------------------------------------- |
| Auth passcode       | Server-side only (`US_PAGE_PASSCODE` env var)      |
| Token signing       | HMAC-SHA256 with `US_PAGE_AUTH_SECRET`             |
| Token validation    | Timing-safe comparison (`crypto.timingSafeEqual`)  |
| Token expiration    | 30-day rolling window                              |
| Rate limiting       | IP-based, 5 attempts/15min, Supabase-persisted     |
| Rate limit fallback | Bounded in-memory map (max 1000 entries)           |
| Client storage      | `localStorage('us_page_auth_v1')` for session token |

---

## 📦 External Dependencies (Runtime)

| Package                | Purpose                            |
| :--------------------- | :--------------------------------- |
| `next`                 | Framework — routing, SSR, API routes |
| `react` / `react-dom`  | UI rendering                       |
| `@supabase/supabase-js` | Database client for rate limiting |

### Dev Dependencies

| Package               | Purpose                  |
| :-------------------- | :----------------------- |
| `tailwindcss`         | Utility-first CSS        |
| `@tailwindcss/postcss`| PostCSS plugin for TW v4 |
| `typescript`          | Type checking            |
| `eslint`              | Code linting             |
| `eslint-config-next`  | Next.js linting rules    |
| `@types/*`            | Type definitions         |

---

## ⚡ Performance Optimizations Applied

- **GPU-accelerated animations:** All intro animations use `translate3d()` / `scale3d()` with `will-change` hints
- **Reflow elimination:** Lens flare uses `translate3d` path instead of `left` transitions
- **Static blur optimization:** Projector glow uses fixed `filter: blur()` with only opacity/scale animated
- **Image optimization:** Next.js `<Image>` component with `fill` + `sizes` attributes for responsive loading
- **Font optimization:** `next/font/google` with `display: "swap"` for all three font families
- **Anti-flash theme:** Inline script prevents theme flash on page load
- **Scroll lock ref counting:** Multiple overlays (mobile menu, command palette) don't conflict

---

## 🧩 Component Dependency Graph

```
RootLayout
├── SiteLayout
│   ├── InteractiveBackground
│   ├── Header
│   │   ├── ThemeToggle
│   │   └── scrollLock (lib)
│   ├── [Page Content]
│   │   ├── Home: PlatformCycler, DeviceSlideshow, CopyCommand
│   │   ├── About: AboutContent
│   │   └── Docs: DocsContent
│   ├── Footer (inline in SiteLayout)
│   └── CommandPalette
│       └── scrollLock (lib)
│
├── /us (bypasses SiteLayout shell)
│   └── UsAuthGate
│       ├── StarfieldCanvas
│       ├── /api/us/auth (API route)
│       │   └── supabase (lib)
│       └── UsContent
│           ├── StarfieldCanvas
│           ├── SectionHeading (local)
│           ├── TypewriterText (local)
│           ├── Odometer / OdometerDigit (local)
│           └── scrollLock (lib)
```

---

## 🚧 Current Status & Known State

### Active Development
- **Branch:** `develop` — latest commit styles the "Reasons" section carousel for improved responsiveness
- **Last major feature:** Cinematic 10-second movie intro with velvet curtain reveal for `/us`
- **Recent fixes:** Carousel card dimensions, responsive padding, scroll snapping

### Known Areas for Improvement
- `globals.css` is a **monolith** (4535 lines) — could benefit from splitting into per-page CSS modules
- `UsContent.tsx` is **very large** (2535 lines) — could be decomposed into smaller section components
- No automated tests exist
- No CI/CD pipeline configured
- No image optimization pipeline (WebP conversions done manually)

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

---

## 📌 Important Notes for AI Assistants

1. **The `/us` page is a private romantic dedication** — treat content with care and sensitivity
2. **`globals.css` is the single source of truth for all styles** — there are no CSS modules or scoped styles
3. **All `/us` styles use the `us-` prefix** — maintain this convention for any new /us features
4. **The cinematic intro is precisely choreographed** — changing timings requires updating both CSS keyframes and the React state machine in `UsContent.tsx`
5. **Supabase is used ONLY for auth rate limiting** — it is not a general-purpose database for this project
6. **Theme system uses `data-theme` attribute on `<html>`** — not class-based
7. **Path alias `@/*`** maps to `./src/*` — use this for all imports
8. **React 19** — be aware of strict mode and compiler rules (no impure renders)
9. **The existing `summary.md`** documents only the cinematic intro feature, not the whole project

---

*This file is the single source of truth for project context. Update it when making significant architectural changes, adding new pages/features, or modifying the tech stack.*
