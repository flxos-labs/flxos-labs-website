import Image from "next/image";

export default function Home() {
  return (
    <main className="relative">
      <section className="relative overflow-hidden">
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="orb orb-3" />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-16 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-24">
          <div className="space-y-6">
            <p className="section-eyebrow">FlxOS Labs</p>
            <h1 className="font-display text-4xl leading-tight text-[color:var(--ink)] md:text-5xl">
              Modular OS from ESP32 chips to the desktop horizon.
            </h1>
            <p className="max-w-xl text-lg text-[color:var(--muted)]">
              FlxOS ships a profile-driven build system, a rich GUI stack, and
              a clear path from embedded hardware to full desktop experiences.
              One repo, one CLI, many form factors.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="btn-primary" href="/#cta">
                Get started
              </a>
              <a
                className="btn-secondary"
                href="https://github.com/flxos-labs/flxos"
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
              <span className="chip">ESP-IDF</span>
              <span className="chip">LVGL</span>
              <span className="chip">LovyanGFX</span>
              <span className="chip">CMake</span>
              <span className="chip">Python</span>
            </div>
          </div>
          <div className="relative">
            <div className="device-card">
              <Image
                src="/images/screenshots/scr_20260312_161725_home_screen_with_dock_status_bar_wallpaper.png"
                alt="FlxOS home screen"
                width={920}
                height={640}
                priority
              />
            </div>
            <div className="caption-card">
              <p className="font-display text-sm">Live UI on real hardware</p>
              <span className="text-xs text-[color:var(--muted)]">
                Touch UI, panel layouts, and built-in apps.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="section-header">
          <h2 className="font-display text-3xl">Built for real deployments</h2>
          <p className="text-[color:var(--muted)]">
            FlxOS focuses on repeatable builds, clean architecture, and visuals
            that feel premium on embedded devices.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="feature-card">
            <h3 className="font-display text-lg">Profile-first builds</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Select a board profile once and compile, flash, and release with
              one command.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="font-display text-lg">Rich GUI foundation</h3>
            <p className="text-sm text-[color:var(--muted)]">
              LVGL plus optimized drivers deliver polished screens and fluid
              animations.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="font-display text-lg">Desktop trajectory</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Same design language scales from microcontrollers to desktop
              simulators.
            </p>
          </div>
        </div>
      </section>

      <section id="stack" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="section-header">
          <h2 className="font-display text-3xl">Stack at a glance</h2>
          <p className="text-[color:var(--muted)]">
            A tight core focused on stability, UI performance, and consistent
            tooling.
          </p>
        </div>
        <div className="stack-grid">
          <div>
            <p className="stack-label">Core</p>
            <p className="stack-value">ESP-IDF, CMake, Python CLI</p>
          </div>
          <div>
            <p className="stack-label">UI Layer</p>
            <p className="stack-value">LVGL, LovyanGFX, input drivers</p>
          </div>
          <div>
            <p className="stack-label">Roadmap</p>
            <p className="stack-value">Desktop simulator, plugins, theming</p>
          </div>
        </div>
      </section>

      <section id="cta" className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="cta-panel">
          <div>
            <p className="section-eyebrow">Start in minutes</p>
            <h2 className="font-display text-3xl">Clone, select, build.</h2>
            <p className="text-[color:var(--muted)]">
              Use the guided CLI to pick a board profile and flash your first
              build without stitching toolchains together.
            </p>
          </div>
          <div className="cta-actions">
            <a
              className="btn-primary"
              href="https://github.com/flxos-labs/flxos"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open repository
            </a>
            <a className="btn-ghost" href="/#features">
              Learn the stack
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
