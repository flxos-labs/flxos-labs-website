"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GithubStats {
  commits: string;
  repos: string;
  followers: string;
}

export default function AboutContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stats, setStats] = useState<GithubStats>({
    commits: "550+",
    repos: "24",
    followers: "48",
  });

  useEffect(() => {
    // Fetch live developer profile statistics from GitHub
    Promise.all([
      fetch("https://api.github.com/users/Itsmeakash248").then((res) => {
        if (!res.ok) throw new Error("Profile request failed");
        return res.json();
      }),
      fetch("https://api.github.com/repos/flxos-labs/flxos").then((res) => {
        if (!res.ok) throw new Error("Repo request failed");
        return res.json();
      }),
    ])
      .then(([userData, repoData]) => {
        setStats({
          commits: "570+", // Core commits baseline
          repos: String(userData.public_repos ?? 24),
          followers: String(userData.followers ?? 48),
        });
      })
      .catch((err) => {
        console.warn("GitHub API fetch error (likely rate limit):", err);
      });
  }, []);

  const faqs = [
    {
      q: "Is FlxOS production-ready?",
      a: "FlxOS v0.1.0 is actively developed and running on real ESP32 hardware today. It's ideal for projects, experiments, and early adopters. We continuously improve the project — check the roadmap for what's coming before using in production-critical applications.",
    },
    {
      q: "What hardware do I need?",
      a: "At minimum, you need an ESP32 or ESP32-S3 development board and a compatible TFT display. We recommend displays with touch support for the full interactive experience. Check the documentation for a list of tested hardware configurations.",
    },
    {
      q: "Can I contribute to FlxOS?",
      a: "Absolutely! We welcome contributions of all kinds — code, documentation, bug reports, feature requests, and hardware compatibility reports. Check out our GitHub repository and the CONTRIBUTING.md guide to get started.",
    },
    {
      q: "What license is FlxOS under?",
      a: "FlxOS is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0), ensuring that any modified versions remain open source and available to the community. This means you're free to use, study, share, and modify the software.",
    },
    {
      q: "How can I get help?",
      a: "The best place to get help is our GitHub Issues page. You can also refer to the documentation, explore the source code, or check the project wiki. We aim to respond to all issues within 48 hours.",
    },
    {
      q: "Where is FlxOS heading?",
      a: "Our roadmap includes expanded hardware support, more built-in apps like a media player, Bluetooth connectivity, cloud integration, and enhanced IoT capabilities. We're building towards making embedded systems truly first-class computing platforms.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero Orbs background */}
      <div className="hero-orbs" aria-hidden="true">
        <span className="orb orb-1 opacity-40" />
        <span className="orb orb-2 opacity-35" />
        <span className="orb orb-3 opacity-30" />
      </div>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="space-y-6 text-center md:text-left">
          <nav className="flex items-center justify-center md:justify-start gap-2 text-xs text-[color:var(--muted)] font-medium" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[color:var(--ink)] transition-colors">Home</a>
            <span>/</span>
            <span>About</span>
          </nav>
          <p className="section-eyebrow">The Story</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-[color:var(--ink)] max-w-4xl">
            We believe embedded software deserves{" "}
            <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-3)] bg-clip-text text-transparent">
              world-class developer experience.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-[color:var(--muted)] leading-relaxed">
            FlxOS Labs is on a mission to make microcontrollers feel like first-class computing platforms — with rich interfaces, clean APIs, and zero boilerplate.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs">
            <span className="chip gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="4" /><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
              ESP32 / ESP-IDF
            </span>
            <span className="chip gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 2 12 2ZM12 22V12" /><path d="M12 12L19.07 4.92999" /><path d="M12 12L4.92999 4.92999" /><path d="M12 12H22" /><path d="M12 12H2" /></svg>
              LVGL 9
            </span>
            <span className="chip gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              60 FPS Graphics
            </span>
            <span className="chip gap-1.5 font-medium">
              <svg className="w-3.5 h-3.5 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              AGPL-3.0
            </span>
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="section-header text-center md:text-left">
          <p className="section-eyebrow">The Creator</p>
          <h2 className="font-display text-3xl">The person behind FlxOS</h2>
        </div>
        <div className="feature-card grid gap-8 p-6 md:p-10 md:grid-cols-[200px_1fr] items-center">
          <div className="relative mx-auto md:mx-0 w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-[color:var(--surface-2)] border border-[rgba(0,0,0,0.08)] flex items-center justify-center shadow-lg group">
            <Image
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              src="https://github.com/Itsmeakash248.png?size=200"
              alt="Akash — Creator of FlxOS"
              fill
              sizes="(max-width: 768px) 144px, 176px"
              priority
            />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <div>
              <h3 className="font-display text-2xl font-bold text-[color:var(--ink)]">Akash</h3>
              <p className="text-sm font-semibold text-[color:var(--accent)]">Creator &amp; Lead Engineer, FlxOS Labs</p>
            </div>
            <p className="text-[color:var(--muted)] leading-relaxed">
              Building FlxOS from scratch — from the bare-metal ESP-IDF kernel to the LVGL touch UI, the Python build toolchain, and the profile-driven hardware abstraction. Passionate about making embedded systems as delightful as desktop software.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                href="https://github.com/Itsmeakash248"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-[color:var(--accent)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                @Itsmeakash248
              </a>
              <a
                href="https://github.com/flxos-labs/flxos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-[color:var(--accent)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55l8.96-5.17a1.78 1.78 0 0 0 0-3.1Z" /></svg>
                FlxOS Code Repo
              </a>
            </div>
            {/* GitHub metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(0,0,0,0.06)]">
              <div className="text-center md:text-left">
                <span className="block font-display text-2xl font-bold text-[color:var(--ink)]">{stats.commits}</span>
                <span className="text-[11px] text-[color:var(--muted)] uppercase tracking-wider font-semibold">Commits</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-display text-2xl font-bold text-[color:var(--ink)]">{stats.repos}</span>
                <span className="text-[11px] text-[color:var(--muted)] uppercase tracking-wider font-semibold">Public Repos</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block font-display text-2xl font-bold text-[color:var(--ink)]">{stats.followers}</span>
                <span className="text-[11px] text-[color:var(--muted)] uppercase tracking-wider font-semibold">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-[color:var(--ink)]">Our Mission</h2>
            <p className="text-[color:var(--muted)] leading-relaxed">
              FlxOS Labs is dedicated to pushing the boundaries of what's possible on embedded hardware. We believe that microcontrollers deserve rich, intuitive user interfaces that rival desktop operating systems.
            </p>
            <p className="text-[color:var(--muted)] leading-relaxed">
              By combining the power of ESP-IDF with cutting-edge graphics libraries like LVGL, we're creating a platform that makes embedded development accessible, enjoyable, and visually stunning.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            <div className="feature-card p-5 text-center md:text-left">
              <span className="block font-display text-3xl font-extrabold text-[color:var(--accent)]">7+</span>
              <span className="text-xs text-[color:var(--muted)] font-semibold uppercase tracking-wide">Core System Modules</span>
            </div>
            <div className="feature-card p-5 text-center md:text-left">
              <span className="block font-display text-3xl font-extrabold text-[color:var(--accent-2)]">Open</span>
              <span className="text-xs text-[color:var(--muted)] font-semibold uppercase tracking-wide">Source &amp; Free</span>
            </div>
            <div className="feature-card p-5 text-center md:text-left">
              <span className="block font-display text-xl font-extrabold text-[color:var(--accent-3)]">AGPL-3.0</span>
              <span className="text-xs text-[color:var(--muted)] font-semibold uppercase tracking-wide">Permissive Copyleft</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline (History) ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="section-header text-center md:text-left">
          <p className="section-eyebrow">Milestones</p>
          <h2 className="font-display text-3xl">Project Story</h2>
        </div>
        <div className="relative pl-6 border-l-2 border-[rgba(0,0,0,0.06)] space-y-12 max-w-3xl ml-2">
          {/* Milestone 1 */}
          <div className="relative space-y-2">
            <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[color:var(--accent)] border-4 border-[color:var(--surface)] ring-2 ring-[color:var(--accent)]" />
            <span className="text-xs font-bold text-[color:var(--accent)] uppercase tracking-wider">2024 — Genesis</span>
            <h3 className="font-display text-xl font-bold">The Beginning</h3>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              FlxOS started as an experiment to create a desktop-like environment on ESP32 hardware. The goal was simple: prove that embedded systems could offer rich, interactive user experiences beyond simple blinking LEDs.
            </p>
          </div>
          {/* Milestone 2 */}
          <div className="relative space-y-2">
            <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[color:var(--accent-2)] border-4 border-[color:var(--surface)] ring-2 ring-[color:var(--accent-2)]" />
            <span className="text-xs font-bold text-[color:var(--accent-2)] uppercase tracking-wider">2024 — Architecture</span>
            <h3 className="font-display text-xl font-bold">Building the Foundation</h3>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              LVGL 9 integrated with ESP-IDF under a modular architecture that separates concerns cleanly. Hardware acceleration through LovyanGFX enabled smooth 60 FPS graphics at display resolutions previously unheard of on microcontrollers.
            </p>
          </div>
          {/* Milestone 3 */}
          <div className="relative space-y-2">
            <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[color:var(--accent-3)] border-4 border-[color:var(--surface)] ring-2 ring-[color:var(--accent-3)]" />
            <span className="text-xs font-bold text-[color:var(--accent-3)] uppercase tracking-wider">March 2026 — Today</span>
            <h3 className="font-display text-xl font-bold">v0.1.0 — Running on Real Hardware</h3>
            <p className="text-sm text-[color:var(--muted)] leading-relaxed">
              FlxOS now ships a usable embedded desktop environment with multitasking layouts, built-in apps, Wi-Fi foundations, and profile-driven builds. The next push is stability, breadth, and desktop-class tooling.
            </p>
          </div>
        </div>
      </section>

      {/* ── Technology Philosophy ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="section-header text-center">
          <p className="section-eyebrow">Principles</p>
          <h2 className="font-display text-3xl">Technology Philosophy</h2>
          <p className="text-sm text-[color:var(--muted)]">Core principles that guide every design decision in FlxOS</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-6">
          <div className="feature-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold">M</div>
            <h3 className="font-display text-lg font-bold">Modularity First</h3>
            <p className="text-xs text-[color:var(--muted)] leading-relaxed">
              Every component is designed to be independent and reusable. Apps, system services, and drivers are cleanly separated, making the codebase maintainable and extensible.
            </p>
          </div>
          <div className="feature-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">P</div>
            <h3 className="font-display text-lg font-bold">Performance Matters</h3>
            <p className="text-xs text-[color:var(--muted)] leading-relaxed">
              We optimize for efficiency without sacrificing features. Hardware acceleration, smart memory management, and FreeRTOS scheduling ensure smooth operation on resource-constrained devices.
            </p>
          </div>
          <div className="feature-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">D</div>
            <h3 className="font-display text-lg font-bold">Developer Experience</h3>
            <p className="text-xs text-[color:var(--muted)] leading-relaxed">
              Creating apps should be straightforward. Our API is designed to be intuitive, with clear patterns and comprehensive examples that get developers productive quickly.
            </p>
          </div>
          <div className="feature-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">O</div>
            <h3 className="font-display text-lg font-bold">Open Collaboration</h3>
            <p className="text-xs text-[color:var(--muted)] leading-relaxed">
              FlxOS is open source and community-driven. We welcome contributions, feedback, and ideas from developers around the world to expand hardware boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="section-header text-center">
          <p className="section-eyebrow">Roadmap</p>
          <h2 className="font-display text-3xl">Our Vision for FlxOS</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 pt-6">
          <div className="feature-card border-t-4 border-[color:var(--accent)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--accent)] text-black font-bold uppercase">Current</span>
              <span className="font-display font-bold text-sm">v0.1.0</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[color:var(--muted)]">
              <li className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg> Modular profile system</li>
              <li className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg> Calendar, Files, Text Editor</li>
              <li className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg> Wi-Fi &amp; network base</li>
              <li className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg> LVGL UI integration</li>
            </ul>
          </div>
          <div className="feature-card border-t-4 border-[color:var(--accent-2)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--accent-2)] text-black font-bold uppercase">Next</span>
              <span className="font-display font-bold text-sm">v1.0</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[color:var(--muted)]">
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Bluetooth support</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Media player app</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Theme customization</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Native plugin system</li>
            </ul>
          </div>
          <div className="feature-card border-t-4 border-[color:var(--accent-3)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[color:var(--accent-3)] text-black font-bold uppercase">Future</span>
              <span className="font-display font-bold text-sm">v2.0</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[color:var(--muted)]">
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Multi-display support</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Cloud integrations</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Voice assistant</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-gray-400" /> Desktop Native builds</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="section-header text-center">
          <h2 className="font-display text-3xl">Frequently Asked Questions</h2>
          <p className="text-sm text-[color:var(--muted)]">Everything you need to know about FlxOS</p>
        </div>
        <div className="space-y-3.5 pt-6">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border border-[rgba(0,0,0,0.06)] rounded-2xl overflow-hidden bg-[rgba(var(--surface-rgb),0.65)] backdrop-blur-md transition-all duration-300 ${
                  isOpen ? "border-[rgba(231,111,81,0.25)] shadow-md" : "hover:border-[rgba(0,0,0,0.1)]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:px-6 text-left font-display font-semibold text-[color:var(--ink)] hover:bg-[rgba(231,111,81,0.02)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] md:text-[16px] leading-snug">{faq.q}</span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(231,111,81,0.08)] border border-[rgba(231,111,81,0.15)] flex items-center justify-center text-[color:var(--accent)] text-xs transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-[rgba(231,111,81,0.15)] border-[rgba(231,111,81,0.3)]" : ""
                    }`}
                  >
                    ＋
                  </span>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-5 pb-5 md:px-6 md:pb-6 pt-1 text-sm text-[color:var(--muted)] leading-relaxed border-t border-[rgba(0,0,0,0.03)]">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Join the Journey CTA ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="cta-panel text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <p className="section-eyebrow">Join the Journey</p>
            <h2 className="font-display text-3xl font-bold">Help us shape embedded computing.</h2>
            <p className="text-sm text-[color:var(--muted)] max-w-xl">
              Star our GitHub repository, report issues, or contribute code. Every single contribution helps build the modular operating system of the future.
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a
              href="https://github.com/flxos-labs/flxos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <span>Star on GitHub</span>
            </a>
            <a href="/docs" className="btn-secondary gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10M6 14h6"/></svg>
              <span>Read the Docs</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
