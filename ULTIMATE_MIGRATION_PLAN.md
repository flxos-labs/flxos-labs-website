# Ultimate Migration Plan: FlxOS Web

This document outlines the end-to-end plan for migrating the FlxOS web project from static HTML/CSS on GitHub Pages to a modern stack: Next.js (App Router), Tailwind CSS, Supabase, and Vercel.

## 🏁 Phase 1: Setup & Initialization (✅ Completed)
- [x] Create a `legacy` folder and backup all existing static files.
- [x] Initialize Next.js with the App Router, TypeScript, ESLint, and Tailwind CSS.
- [x] Install the `@supabase/supabase-js` client.
- [x] Set up initial Supabase configuration files (`src/lib/supabase.ts` and `.env.local.example`).

## 🗄️ Phase 2: Supabase Integration (In Progress)
- [x] **Create Supabase Project:** Create a new project in the Supabase Dashboard.
- [x] **Configure Environment Variables:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the `.env.local` file.
- [ ] **Database Schema:** Define and generate the database schema (if migrating dynamic data like users or posts).
- [ ] **Setup Authentication (Optional):** Implement Supabase Auth if the site requires user logins.

## 🖼️ Phase 3: Asset Migration (✅ Completed)
- [x] **Move Images:** Transfer files from `legacy/assets/images/` to the new Next.js `public/images/` directory.
- [x] **Move Static Files:** Relocate any standalone static files (like favicon, etc.) to the `public/` folder.

## ⚛️ Phase 4: UI & Page Migration (Next.js + Tailwind)
- [ ] **Global Layout:** Configure `src/app/layout.tsx` to include global navigation, footers, and meta tags.
- [ ] **Home Page (`legacy/index.html`):** Convert to `src/app/page.tsx`. Rewrite `legacy/assets/css/styles.css` classes into Tailwind CSS utility classes.
- [ ] **About Page (`legacy/about/index.html`):** Convert to `src/app/about/page.tsx`. Apply Tailwind styling.
- [ ] **Docs Page (`legacy/docs/index.html`):** Convert to `src/app/docs/page.tsx`. Standardize the documentation layout using React components.
- [ ] **404 Page (`legacy/404.html`):** Create a custom `src/app/not-found.tsx` using Tailwind.

## ⚙️ Phase 5: Interactivity & Scripts
- [ ] **Migrate Vanilla JS:** Review `legacy/assets/js/script.js` and `legacy/assets/js/docs.js`.
- [ ] **React State:** Convert DOM manipulations into React state (`useState`, `useEffect`) and event handlers within Client Components (`"use client"`).

## 🔍 Phase 6: SEO & Routing
- [ ] **Metadata API:** Use the Next.js Metadata API in `layout.tsx` and `page.tsx` features for rich SEO (title, description, OpenGraph).
- [ ] **Sitemap & Robots.txt:** 
  - Move/recreate `legacy/robots.txt` in `public/robots.txt` or generate it dynamically (`src/app/robots.ts`).
  - Move/recreate `legacy/sitemap.xml` in `public/sitemap.xml` or generate it dynamically (`src/app/sitemap.ts`).

## 🚀 Phase 7: Deployment to Vercel
- [ ] **Disable GitHub Pages:** Go to GitHub Repository Settings -> Pages -> set Source to "None".
- [ ] **Import to Vercel:** Open the Vercel dashboard and import the GitHub repository.
- [ ] **Configure Vercel Environment:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel's Environment Variables settings.
- [ ] **Deploy & Verify:** Trigger the production build and verify that all pages, styles, and integrations are functioning correctly on the live URL.
