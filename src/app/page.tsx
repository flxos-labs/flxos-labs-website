import PlatformCycler from "../components/PlatformCycler";
import DeviceSlideshow from "../components/DeviceSlideshow";
import CopyCommand from "../components/CopyCommand";
import Image from "next/image";
import Link from "next/link";

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
              Modular OS from <PlatformCycler /> to the desktop horizon.
            </h1>
            <p className="max-w-xl text-lg text-[color:var(--muted)]">
              FlxOS ships a profile-driven build system, a rich GUI stack, and
              a clear path from embedded hardware to full desktop experiences.
              One repo, one CLI, many form factors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/#cta">
                Get started
              </Link>
              <a
                className="btn-secondary"
                href="https://github.com/flxos-labs/flxos"
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub
              </a>
            </div>
            <CopyCommand command={"git clone https://github.com/flxos-labs/flxos && cd flxos && flxos init"} />
            <div className="hero-highlights">
              <div className="highlight-card">
                <p className="highlight-title">Profile graph</p>
                <p className="highlight-copy">
                  Define board, display, and input defaults in a single profile.
                </p>
              </div>
              <div className="highlight-card">
                <p className="highlight-title">GUI foundation</p>
                <p className="highlight-copy">
                  LVGL plus tuned drivers for responsive, crisp interfaces.
                </p>
              </div>
              <div className="highlight-card">
                <p className="highlight-title">Desktop horizon</p>
                <p className="highlight-copy">
                  Carry the same design language into simulators and desktop shells.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
              <span className="chip">ESP-IDF</span>
              <span className="chip">LVGL</span>
              <span className="chip">LovyanGFX</span>
              <span className="chip">CMake</span>
              <span className="chip">Python</span>
            </div>
          </div>
          <div className="relative w-full">
            <DeviceSlideshow />
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="section-header">
          <h2 className="font-display text-3xl">The build loop</h2>
          <p className="text-[color:var(--muted)]">
            Move from a profile to hardware in a short loop and keep the same
            foundation as you scale the interface.
          </p>
        </div>
        <div className="workflow-grid">
          <div className="workflow-step">
            <span className="workflow-step-number">01</span>
            <h3 className="font-display text-lg">Pick a profile</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Start with a board preset that bundles display, input, and storage
              defaults.
            </p>
          </div>
          <div className="workflow-step">
            <span className="workflow-step-number">02</span>
            <h3 className="font-display text-lg">Compose modules</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Add UI, connectivity, and app layers without forking core
              services.
            </p>
          </div>
          <div className="workflow-step">
            <span className="workflow-step-number">03</span>
            <h3 className="font-display text-lg">Build and flash</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Generate the image and deploy to hardware in one repeatable flow.
            </p>
          </div>
          <div className="workflow-step">
            <span className="workflow-step-number">04</span>
            <h3 className="font-display text-lg">Refine the surface</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Tune visuals, animations, and layouts while the config stays
              consistent.
            </p>
          </div>
        </div>
      </section>

      <section id="hardware" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="section-header">
          <h2 className="font-display text-3xl">Hardware in the lab</h2>
          <p className="text-[color:var(--muted)]">
            Real devices running FlxOS, captured on LilyGo T-HMI prototypes.
          </p>
        </div>
        <div className="hardware-grid">
          <figure className="hardware-card">
            <Image
              src="/images/hardware/lilygo-thmi-systeminfo-app.jpg"
              alt="LilyGo T-HMI system info screen"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="hardware-photo"
            />
            <figcaption className="hardware-caption">
              <span className="hardware-label">LilyGo T-HMI</span>
              <span className="hardware-title">System info on-device</span>
              <span className="hardware-meta">
                Live diagnostics, sensor readouts, and UI timing.
              </span>
            </figcaption>
          </figure>
          <figure className="hardware-card">
            <Image
              src="/images/hardware/lilygo-thmi-calculator-app.jpg"
              alt="Calculator app on LilyGo T-HMI"
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="hardware-photo"
            />
            <figcaption className="hardware-caption">
              <span className="hardware-label">Input demo</span>
              <span className="hardware-title">Calculator app</span>
            </figcaption>
          </figure>
          <figure className="hardware-card">
            <Image
              src="/images/hardware/lilygo-thmi-notification-panel.jpg"
              alt="Notification panel on LilyGo T-HMI"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="hardware-photo"
            />
            <figcaption className="hardware-caption">
              <span className="hardware-label">Status layer</span>
              <span className="hardware-title">Notification panel</span>
            </figcaption>
          </figure>
          <figure className="hardware-card">
            <Image
              src="/images/hardware/lilygo-thmi-quickaccess-panel.jpg"
              alt="Quick access panel on LilyGo T-HMI"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="hardware-photo"
            />
            <figcaption className="hardware-caption">
              <span className="hardware-label">Controls</span>
              <span className="hardware-title">Quick access panel</span>
            </figcaption>
          </figure>
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
            <Link className="btn-ghost" href="/#features">
              Learn the stack
            </Link>
          </div>
            <CopyCommand command={"git clone https://github.com/flxos-labs/flxos && cd flxos"} />
        </div>
      </section>
    </main>
  );
}
