# Ultimate Migration Plan: FlxOS Web

This document outlines the end-to-end plan for migrating the FlxOS web project from static HTML/CSS on GitHub Pages to a modern stack: Next.js (App Router), Tailwind CSS, Supabase, and Vercel.

**Current scope:** The active Next.js app lives directly in the **repository root**. The legacy static site files are preserved in Git history under the `legacy/` path (commit `6e6e8c2`). All remaining steps apply to the root directory.

## 🏁 Phase 1: Setup & Initialization (✅ Completed)
- [x] Back up all existing static files into `legacy/` folder.
- [x] Initialize a Next.js app in the repository root with App Router, TypeScript, ESLint, Tailwind CSS v4, and `src/` directory.
- [x] Install the `@supabase/supabase-js` client.
- [x] Set up Supabase configuration files:
  - `src/lib/supabase.ts`
  - `.env.local.example`

## 🗄️ Phase 2: Supabase Integration (In Progress)
- [x] **Create Supabase Project:** Create a new project in the Supabase Dashboard.
- [x] **Configure Environment Variables:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
- [ ] **Database Schema:** Define and generate the database schema (if migrating dynamic data like users or posts).
- [ ] **Setup Authentication (Optional):** Implement Supabase Auth if the site requires user logins.

## 🖼️ Phase 3: Asset Migration (✅ Completed)
- [x] **Move Images:** Transfer files from `legacy/assets/images/` to `public/images/`.
- [x] **Move Static Files:** Relocate any standalone static files (favicon, robots.txt, sitemap.xml) to `public/`.

## ⚛️ Phase 4: UI & Page Migration (Next.js + Tailwind)
- [x] **Global Layout:** Configured `src/app/layout.tsx` with navigation, footer, and Google Fonts (Space Grotesk, Figtree, JetBrains Mono).
- [x] **Home Page (`legacy/index.html`):** Converted to `src/app/page.tsx` with Tailwind CSS utility classes.
- [ ] **About Page (`legacy/about/index.html`):** Convert to `src/app/about/page.tsx`.
- [ ] **Docs Page (`legacy/docs/index.html`):** Convert to `src/app/docs/page.tsx`.
- [ ] **404 Page (`legacy/404.html`):** Create `src/app/not-found.tsx`.

## ⚙️ Phase 5: Interactivity & Scripts
- [ ] **Migrate Vanilla JS:** Review `legacy/assets/js/script.js` and `legacy/assets/js/docs.js`.
- [ ] **React State:** Convert DOM manipulations into React state (`useState`, `useEffect`) and event handlers within Client Components (`"use client"`).

## 🔍 Phase 6: SEO & Routing
- [ ] **Metadata API:** Use the Next.js Metadata API in `src/app/layout.tsx` and each `page.tsx` for rich SEO (title, description, OpenGraph).
- [ ] **Sitemap & Robots.txt:**
  - Verify/update `public/robots.txt`.
  - Verify/update `public/sitemap.xml` or generate dynamically via `src/app/sitemap.ts`.

## 🚀 Phase 7: Deployment to Vercel
- [ ] **Disable GitHub Pages:** Go to GitHub Repository Settings → Pages → set Source to "None".
- [ ] **Import to Vercel:** Open the Vercel dashboard and import the GitHub repository.
- [ ] **Configure Vercel Environment:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel's Environment Variables settings.
- [ ] **Deploy & Verify:** Trigger the production build and verify that all pages, styles, and integrations are functioning correctly on the live URL.
