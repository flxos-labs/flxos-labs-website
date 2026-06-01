# Cinematic Movie Intro & Velvet Curtain Reveal Summary

We have upgraded the `/us` entrance animation into a premium, **10-second choreographed cinematic movie intro** driven by a custom CSS/React state machine, and fully optimized for transition smoothness.

---

## 🎬 Cinematic Timeline & Phases

| Phase | Duration | Visual Effect |
| :--- | :--- | :--- |
| **Phase 1** | `0ms` – `2000ms` | Warm center projector glow, floating golden dust particles (randomized sizes, drifts, and delays), and a subtle film grain overlay. |
| **Phase 2** | `2000ms` – `4000ms` | Concentric golden monogram crest containing the initials **"A ♥ R"** fades in with an organic pulsing bloom. |
| **Phase 3** | `4000ms` – `5500ms` | Tagline text *"A Universe Made for Two"* types in letter-by-letter, and a self-drawing golden rule animates underneath. |
| **Phase 4** | `5500ms` – `7000ms` | Center radial light intensifies, a sharp horizontal lens flare beam sweeps across, and the crest/tagline zoom-dissolves away. |
| **Phase 5** | `7000ms` – `9000ms` | Velvet crimson curtains part vertically (skewing slightly for organic fabric gather), splitting the central heart medallion. The overlay background fades to transparent, and warm white-gold light spills through the gap. |
| **Phase 6** | `9000ms` – `10200ms` | Seamless transition phase leading to final cleanup. |
| **Phase 7** | `10200ms`+ | Overlay completely unmounts, giving the user full interaction/scroll controls. |

---

## ⚡ Performance & Visual Optimizations

- **GPU Acceleration (translate3d)**: Added `will-change: transform, opacity;` and forced layout-free 3D rendering (`transform: translate3d(...)` / `scale3d(...)`) on all animating elements (curtains, crest, tagline, dust particles, lens flare).
- **Reflow Elimination (Lens Flare)**: Shifted the horizontal flare sweep from a layout-heavy `left` transition to a 100% GPU-accelerated `translate3d` path.
- **Static Blur Optimization**: Eliminated dynamic blur repaint overhead on the projector glow by setting a static filter blur radius and animating only opacity/scale.
- **Full-Screen Height Fix**: Removed the widescreen cinematic black letterbox bars at the top and bottom of the overlay, allowing the curtains and animations to fill 100% of the viewport height.
- **Overlay Background Reveal**: Configured a transition to fade the solid black overlay background to transparent during Phase 5, ensuring the page content becomes visible through the parting gap.

---

## 🛠️ Codebase Health & React 19 Compliance

- **Purity Resolution**: Extracted particle spawning DOM manipulations and random getters (`Math.random()`) from the component body into module-scoped helpers in [UsContent.tsx](src/app/us/UsContent.tsx), satisfying strict React compiler rules.
- **Cascading Render Avoidance**: Restructured typewriter timing transitions and track change states to avoid synchronous `setState` warnings in React effects.
- **Validation**: Verified build pipelines and type safety checks cleanly (`npx tsc --noEmit` and `npx eslint`) with **0 errors**.
