# Ultimate Migration Plan: FlxOS Web

This document outlines the end-to-end plan for migrating the FlxOS web project from static HTML/CSS to Next.js (App Router), Tailwind CSS, Supabase, and Vercel. 

---

## 🏁 Phase 1: Setup & Initialization (✅ Completed)
- [x] Back up all existing static files into `legacy/` folder.
- [x] Initialize a Next.js app in the repository root with App Router, TypeScript, ESLint, Tailwind CSS v4, and `src/` directory.
- [x] Install the `@supabase/supabase-js` client.
- [x] Set up Supabase configuration files (`src/lib/supabase.ts`, `.env.local.example`).

---

## 🗄️ Phase 2: Supabase Integration (In Progress)
- [x] **Create Supabase Project:** Create a new project in the Supabase Dashboard.
- [x] **Configure Environment Variables:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
- [ ] **Database Schema:** Define and generate the database schema (if migrating dynamic data like users or posts).
- [ ] **Setup Authentication (Optional):** Implement Supabase Auth if the site requires user logins.

---

## 🖼️ Phase 3: Asset Migration (✅ Completed)
- [x] **Move Images:** Transfer files from `legacy/assets/images/` to `public/images/`.
- [x] **Move Static Files:** Relocate any standalone static files (favicon, robots.txt, sitemap.xml) to `public/`.

---

## ⚛️ Phase 4: UI & Page Migration (✅ Completed)
- [x] **Global Layout:** Configured `src/app/layout.tsx` with navigation, footer, and Google Fonts.
- [x] **Home Page:** Converted legacy home page to `src/app/page.tsx` with Tailwind utility classes.
- [x] **About Page:** Recreated legacy About page as a server-client pair (`src/app/about/page.tsx` and `src/app/about/AboutContent.tsx`).
- [x] **Docs Page:** Recreated legacy Documentation page as a server-client pair (`src/app/docs/page.tsx` and `src/app/docs/DocsContent.tsx`).
- [x] **404 Page:** Created custom Next.js 404 page at `src/app/not-found.tsx`.

---

## ⚙️ Phase 5: Interactivity & Scripts (In Progress)
Migrate legacy scripts (`script.js`, `docs.js`) into native React/Tailwind interactive components:

### 1. New Interactive Components to Build
- [ ] **Global Command Palette (`src/components/CommandPalette.tsx`)**
  - Triggered globally by `Ctrl+K` or `Cmd+K` keystrokes.
  - Sleek glassmorphic layout.
  - Fuzzy-searches nav routes (Home, Features, Docs, About, GitHub).
  - Supports keyboard arrows, `Enter` to open, and `Escape` to close.
- [ ] **Platform Word Cycler (`src/components/PlatformCycler.tsx`)**
  - Dynamic rotating text cycle inside the Home hero header.
  - Cycles supported platforms: `ESP32`, `ESP32-S3`, `ESP32-P4`, `ESP32-C6`, `Linux`, `macOS`, `Windows`.
  - Smooth CSS opacity transitions.
- [ ] **Device Mockup Slideshow (`src/components/DeviceSlideshow.tsx`)**
  - Smoothly rotates screenshot slides (Calendar App, Files App, Settings, Editor) within the homepage device mockup.
  - Synchronizes corresponding captions dynamically.

### 2. Integration
- [ ] **Integrate Command Palette:** Load globally inside `src/app/layout.tsx`.
- [ ] **Integrate Cycler & Slideshow:** Mount inside the home page `src/app/page.tsx`.

---

## 🔍 Phase 6: SEO & Routing (In Progress)
- [x] **Metadata API:** Custom metadata set up in layout and page routes.
- [x] **Sitemap & Robots.txt:** Configured inside `public/robots.txt` and `public/sitemap.xml`.

---

## 🚀 Phase 7: Deployment to Vercel (✅ Completed)
- [x] **Import Repository:** Configure project import on Vercel platform.
- [x] **Set Environment Variables:** Define Supabase variables in Vercel.
- [x] **Trigger Production Build:** Verify all routes build and render statically.
