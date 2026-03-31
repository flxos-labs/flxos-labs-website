# FlxOS 11/10 Upgrade — Task Tracker

## Wave 1: High Impact (Phases 1, 3, 5) ✅ COMPLETE

### Phase 1: Typography & Visual Identity
- [x] Add Outfit display font to Google Fonts (index.html, about/index.html)
- [x] Update :root CSS variables (--font-display, --spring easing, --shadow-card)
- [x] Apply Outfit to h1, h2, h3, h4 in styles.css
- [x] Animate .aurora-text class with shimmer keyframe
- [x] Add layered depth shadows to .bento-card, .community-card

### Phase 3: Content & Trust Signals
- [x] Fix version: v1.0.0 → v0.1.0 in index.html (badge, JSON-LD)
- [x] Fix version in about/index.html roadmap
- [x] Fix About page FAQ text (v1.0 → v0.1 language)
- [x] Remove 2 anonymous testimonials — keep only @Revers-BR
- [x] Add "By the Numbers" strip section (after divider, before features)
- [x] Add progress bars + dates to roadmap items (v0.1→v1.0→v1.5→v2.0)
- [x] Add skeleton shimmer to GitHub stats placeholders

### Phase 5: Motion & Micro-Interaction Polish
- [x] Add spring `linear()` easing to transitions
- [x] Add button shimmer sweep animation
- [x] Add nav link sliding underline hover effect
- [x] Add bento card spotlight glow on hover (JS + CSS vars)
- [x] Clear skeleton states when GitHub API responds

---

## Wave 2: Visual Polish (Phases 2, 4) ✅ COMPLETE (UNCOMMITTED)

### Phase 2: CSS Scroll-Driven Animations
- [x] Replace IntersectionObserver with CSS `animation-timeline: view()` reveals
- [x] Add `@supports` guard in script.js so JS observer is fallback only
- [x] Apply scroll-scale-in to bento cards, community cards, tech logos
- [x] Apply scroll-parallax to hardware photo cards

### Phase 4: Visual Storytelling
- [x] Curate gallery from ~15 screenshots down to 8 with captioned story flow
- [x] Add animated CSS terminal simulation (clone→build→flash→boot)
- [x] Add visible "why we chose X" subtitle text to each tech stack logo

---

## Wave 3: Final Polish (Phases 6, 7) ✅ COMPLETE (UNCOMMITTED)

### Phase 6: About Page Elevation
- [x] Add animated gradient mesh + orb background to about/index.html hero
- [x] Convert static timeline dots to scroll-driven fill animation
- [x] Add hover glow effect to philosophy cards (same as main bento cards)
- [x] Add parallax to about hero text on scroll
- [x] Add live founder activity metrics fed from GitHub API

### Phase 7: Light Mode Polish
- [x] Warm tint card backgrounds in light theme (not pure white)
- [x] Softer, less saturated gradient-text in light theme
- [x] Keep code blocks dark in light mode
- [x] Reduce hero orb opacity in light mode, shift to warmer hue

---

## Commit History

| Wave | Commit | Changes |
|---|---|---|
| Wave 1 | `7ef43e4` | Outfit font, numbers strip, roadmap progress, trust signals — 5 files, +1438/-424 |
| Docs Baseline | `ca7dfe9` | Added UPGRADE_PLAN.md and UPGRADE_TASKS.md scaffolding |
| Wave 2 | `pending` | Scroll-driven CSS animations, JS fallback guard, curated 8-screen gallery, terminal story, tech rationale (working tree changes) |
| Wave 3 | `pending` | About page elevation, founder live metrics, timeline fill/parallax, light-theme polish (working tree changes) |
