# FlxOS Website — Redesign Tracker

> Tracks implementation progress for [REDESIGN_PLAN.md](./REDESIGN_PLAN.md).
> Updated after each PR is merged.

---

## Legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Complete — merged to `develop`
- `[~]` Complete — PR open, pending review
- `[!]` Blocked / issue found

---

## Phase 1 — Critical Bug Fixes ✅

**Branch:** `phase-1/critical-fixes` → **PR #11** → merged to `develop`

| # | Task | Status |
|---|------|--------|
| 1.1 | `about/index.html` — mobile hamburger button | [x] |
| 1.2 | `about/index.html` — `id="main-content"` on `<main>` (skip-link) | [x] |
| 1.3 | `about/index.html` — `defer` on `<script src="/script.js">` | [x] |
| 1.4 | `about/index.html` — OG + Twitter Card meta tags | [x] |
| 1.5 | `docs/index.html` — OG + Twitter Card meta tags | [x] |
| 1.6 | `404.html` — mobile hamburger + theme toggle (DOM) | [x] |
| 1.7 | `styles.css` — `.logo-icon.small` CSS rule | [x] |
| 1.8 | `styles.css` — `.newsletter-error` styling | [x] |
| 1.9 | `index.html` — 4 missing screenshots added (now 16 total) | [x] |
| 1.10 | `index.html` — newsletter error message element | [x] |
| 1.11 | `script.js` — newsletter failure shows error with 5s dismiss | [x] |

### Phase 1 Hotfix — Code Review Violations

**Branch:** `fix/phase-1-review-violations` → **PR #14** → pending review

| # | Task | Status |
|---|------|--------|
| H1 | `404.html` — theme toggle click handler (was non-functional) | [~] |
| H2 | `404.html` — mobile menu toggle logic (was non-functional) | [~] |
| H3 | `og-image.png` dimensions — file exists (640×640), non-standard size | [!] noted, future pass |

---

## Phase 2 — Hero Section Overhaul

**Branch:** `phase-2/hero-overhaul` → **PR #12** → pending review

| # | Task | Status |
|---|------|--------|
| 2.1 | Animated gradient mesh background (3 drifting orbs) | [~] |
| 2.2 | 3D device mockup — framed FlxOS screenshot (dock+wallpaper) | [~] |
| 2.3 | Device mockup — floating animation + perspective tilt | [~] |
| 2.4 | Device mockup — mouse-tracking parallax (pointer devices) | [~] |
| 2.5 | Device mockup — glare overlay + glow pulse | [~] |
| 2.6 | Spring-physics `easeOutExpo` counter animation | [~] |
| 2.7 | Scroll progress shimmer bar | [~] |
| 2.8 | SVG wave section divider (hero → features) | [~] |
| 2.9 | `prefers-reduced-motion` guards on all animations | [~] |

---

## Phase 3 — Section-by-Section Overhaul

**Branch:** `phase-3/section-overhaul` → not started

| # | Task | Status |
|---|------|--------|
| 3A | Features → Apple-style bento grid (mixed-size cards) | [ ] |
| 3B | Gallery → device-framed horizontal carousel (all 16 screenshots) | [ ] |
| 3C | Tech Stack → real SVG logo cloud with floating/constellation animation | [ ] |
| 3D | Roadmap → horizontal animated timeline with progress indicators | [ ] |
| 3E | Community → GitHub contributor avatars + star count glow | [ ] |
| 3F | Get Started → animated step-by-step with scroll-triggered replay | [ ] |
| 3G | Newsletter → full-width dramatic CTA with confetti success state | [ ] |

---

## Phase 4 — Motion & Micro-Interaction System

**Branch:** `phase-4/motion-system` → not started

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

**Branch:** `phase-5/mobile-excellence` → not started

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

**Branch:** `phase-6/seo-performance` → not started

| # | Task | Status |
|---|------|--------|
| 6A | JSON-LD `SoftwareApplication` schema on homepage | [ ] |
| 6B | JSON-LD `Organization` schema on About page | [ ] |
| 6C | JSON-LD `WebSite` + `SearchAction` schema | [ ] |
| 6D | Convert screenshots to WebP (40-60% size savings) | [ ] |
| 6E | `fetchpriority="high"` on hero image | [x] done in Phase 2 |
| 6F | Cache-busting `?v=3` standardized across all pages | [ ] |
| 6G | `og-image.png` resized to 1200×630 standard | [ ] |
| 6H | Docs + About pages match homepage polish level | [ ] |

---

## Open Pull Requests

| PR | Branch | Target | Description |
|----|--------|--------|-------------|
| #12 | `phase-2/hero-overhaul` | `develop` | Hero overhaul — gradient mesh, device mockup, spring counters |
| #14 | `fix/phase-1-review-violations` | `develop` | 404 page — functional theme toggle + mobile menu |

## Merged Pull Requests

| PR | Branch | Description |
|----|--------|-------------|
| #11 | `phase-1/critical-fixes` | Phase 1 — critical bug fixes & foundation improvements |

---

## Notes
- Deploy triggers on `develop` → `main` merge via GitHub Actions (Jekyll)
- Always branch from `develop`, never directly from `main`
- Branch naming: `phase-N/description` or `fix/description`
