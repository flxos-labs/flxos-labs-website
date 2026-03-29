# FlxOS Website — Redesign Tracker

> Tracks implementation progress for [REDESIGN_PLAN.md](./REDESIGN_PLAN.md).
> **Git workflow:** Commit directly to `develop`. Deploy via `develop` → `main`.

---

## Legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Complete — in `develop`
- `[!]` Issue noted / blocked

---

## Phase 1 — Critical Bug Fixes ✅

| # | Task | Status |
|---|------|--------|
| 1.1 | `about/index.html` — mobile hamburger button | [x] |
| 1.2 | `about/index.html` — `id="main-content"` on `<main>` (skip-link) | [x] |
| 1.3 | `about/index.html` — `defer` on `<script src="/script.js">` | [x] |
| 1.4 | `about/index.html` — OG + Twitter Card meta tags | [x] |
| 1.5 | `docs/index.html` — OG + Twitter Card meta tags | [x] |
| 1.6 | `404.html` — mobile hamburger + theme toggle (DOM + handlers) | [x] |
| 1.7 | `styles.css` — `.logo-icon.small` CSS rule | [x] |
| 1.8 | `styles.css` — `.newsletter-error` styling | [x] |
| 1.9 | `index.html` — 4 missing screenshots added (now 16 total) | [x] |
| 1.10 | `index.html` — newsletter error message element | [x] |
| 1.11 | `script.js` — newsletter failure shows error with 5s dismiss | [x] |
| 1.12 | `og-image.png` — file exists but is 640×640 (non-standard) | [!] fix in Phase 6 |

---

## Phase 2 — Hero Section Overhaul ✅

| # | Task | Status |
|---|------|--------|
| 2.1 | Animated gradient mesh background (3 drifting orbs) | [x] |
| 2.2 | 3D device mockup — framed FlxOS screenshot (dock+wallpaper) | [x] |
| 2.3 | Device mockup — floating animation + perspective tilt | [x] |
| 2.4 | Device mockup — mouse-tracking parallax (pointer devices) | [x] |
| 2.5 | Device mockup — glare overlay + glow pulse | [x] |
| 2.6 | Spring-physics `easeOutExpo` counter animation | [x] |
| 2.7 | Scroll progress shimmer bar | [x] |
| 2.8 | SVG wave section divider (hero → features) | [x] |
| 2.9 | `prefers-reduced-motion` guards on all animations | [x] |

---

## Phase 3 — Section-by-Section Overhaul ✅

| # | Task | Status |
|---|------|--------|
| 3A | Features → Apple-style bento grid (mixed-size cards) | [x] |
| 3B | Gallery → device-framed horizontal carousel (all 16 screenshots) | [x] |
| 3C | Tech Stack → real SVG logo cloud with floating animation | [x] |
| 3D | Roadmap → horizontal animated timeline with progress indicators | [x] |
| 3E | Community → GitHub contributor avatars + star count glow | [x] |
| 3F | Get Started → animated step-by-step with scroll-triggered replay | [x] |
| 3G | Newsletter → full-width dramatic CTA with confetti success state | [x] |

---

## Phase 4 — Motion & Micro-Interaction System

| # | Task | Status |
|---|------|--------|
| 4A | Scroll-driven stagger animations (section headers, cards) | [ ] |
| 4B | Card 3D tilt — cursor-following perspective | [ ] |
| 4C | Magnetic button pull effect | [ ] |
| 4D | Link underline grow from left-to-right | [ ] |
| 4E | Nav active indicator slides between items | [ ] |
| 4F | Page-load skeleton → content cascade | [ ] |

---

## Phase 5 — Mobile Excellence

| # | Task | Status |
|---|------|--------|
| 5A | Swipeable gallery carousel with touch events | [ ] |
| 5B | Pagination dots for gallery | [ ] |
| 5C | Bottom-sheet mobile nav (slide-from-bottom) | [ ] |
| 5D | Frosted glass mobile menu backdrop | [ ] |
| 5E | Swipe-down gesture to close mobile menu | [ ] |
| 5F | Typography audit — no text < 16px on mobile | [ ] |

---

## Phase 6 — SEO, Performance & Polish

| # | Task | Status |
|---|------|--------|
| 6A | JSON-LD `SoftwareApplication` schema on homepage | [ ] |
| 6B | JSON-LD `Organization` schema on About page | [ ] |
| 6C | JSON-LD `WebSite` + `SearchAction` schema | [ ] |
| 6D | Convert screenshots to WebP (40-60% size savings) | [ ] |
| 6E | `fetchpriority="high"` on hero image | [x] done in Phase 2 |
| 6F | Cache-busting `?v=` standardized across all pages | [ ] |
| 6G | `og-image.png` resized to 1200×630 standard | [ ] |
| 6H | Docs + About pages match homepage polish level | [ ] |

---

## Notes
- All work commits directly to `develop`
- Deploy: merge `develop` → `main` triggers GitHub Actions (Jekyll → GitHub Pages)
- Use `fix/description` branches only for isolated bug fixes that need code review
