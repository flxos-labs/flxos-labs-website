
export default function About() {
  return (
    <>
      

        {/* ── Hero ──────────────────────────────────── */}
        <section className="about-hero">
            <div className="about-hero-mesh" aria-hidden="true">
                <div className="about-mesh-orb about-mesh-orb-1"></div>
                <div className="about-mesh-orb about-mesh-orb-2"></div>
                <div className="about-mesh-orb about-mesh-orb-3"></div>
            </div>
            <div className="container">
                <div className="about-hero-copy" id="aboutHeroCopy">
                    
                    <div className="section-eyebrow">The story</div>
                    <h1>We believe embedded software deserves<br/><span className="gradient-text aurora-text">world-class developer experience.</span></h1>
                    <p className="hero-subtitle">FlxOS Labs is on a mission to make microcontrollers feel like first-class computing platforms — with rich interfaces, clean APIs, and zero boilerplate.</p>
                    <div className="hero-badges">
                        <span className="hero-badge"><i className="fas fa-microchip"></i> ESP32 / ESP-IDF</span>
                        <span className="hero-badge"><i className="fas fa-palette"></i> LVGL 9</span>
                        <span className="hero-badge"><i className="fas fa-bolt"></i> 60 FPS Graphics</span>
                        <span className="hero-badge"><i className="fab fa-osi"></i> AGPL-3.0</span>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Founder ────────────────────────────────── */}
        <section className="founder-section">
            <div className="container">
                <div className="section-eyebrow" style={{display: 'block', textAlign: 'center', marginBottom: '40px'}}>The person behind FlxOS</div>
                <div className="founder-card">
                    <div className="founder-avatar-wrap">
                        <img
                            id="founder-avatar-img"
                            className="founder-avatar"
                            src="https://github.com/Itsmeakash248.png?size=200"
                            alt="Akash — Founder of FlxOS Labs"
                        />
                        <div id="founder-avatar-fallback" className="founder-avatar-initial" style={{display: 'none'}}>A</div>
                        <span className="founder-badge">Founder</span>
                    </div>
                    <div className="founder-info">
                        <h3>Akash</h3>
                        <div className="founder-title">Creator &amp; Lead Engineer, FlxOS Labs</div>
                        <p className="founder-bio">Building FlxOS from scratch — from the bare-metal ESP-IDF kernel to the LVGL touch UI, the Python build toolchain, and the profile-driven hardware abstraction. Passionate about making embedded systems as delightful as desktop software.</p>
                        <div className="founder-links">
                            <a href="https://github.com/Itsmeakash248" target="_blank" rel="noopener noreferrer" className="founder-link" id="founder-github-link">
                                <i className="fab fa-github"></i> @Itsmeakash248
                            </a>
                            <a href="https://github.com/flxos-labs/flxos" target="_blank" rel="noopener noreferrer" className="founder-link" id="founder-repo-link">
                                <i className="fas fa-code"></i> FlxOS Repo
                            </a>
                        </div>
                        <div className="founder-metrics" id="founderMetrics" aria-label="Live founder activity">
                            <div className="founder-metric">
                                <span className="founder-metric-value" id="founderCommitCount">--</span>
                                <span className="founder-metric-label">Repo Commits</span>
                            </div>
                            <div className="founder-metric">
                                <span className="founder-metric-value" id="founderRepoCount">--</span>
                                <span className="founder-metric-label">Public Repos</span>
                            </div>
                            <div className="founder-metric">
                                <span className="founder-metric-value" id="founderFollowerCount">--</span>
                                <span className="founder-metric-label">Followers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Tech Stack Marquee ─────────────────────── */}
        <div className="tech-stack">
            <div className="tech-label">Built with</div>
            <div className="marquee-track" aria-hidden="true">
                <span className="tech-chip"><i className="fas fa-microchip"></i> ESP32</span>
                <span className="tech-chip"><i className="fas fa-layer-group"></i> ESP-IDF</span>
                <span className="tech-chip"><i className="fas fa-paint-brush"></i> LVGL 9</span>
                <span className="tech-chip"><i className="fas fa-tachometer-alt"></i> LovyanGFX</span>
                <span className="tech-chip"><i className="fas fa-cogs"></i> FreeRTOS</span>
                <span className="tech-chip"><i className="fab fa-python"></i> Python Build</span>
                <span className="tech-chip"><i className="fas fa-wifi"></i> Wi-Fi Stack</span>
                <span className="tech-chip"><i className="fas fa-database"></i> NVS Storage</span>
                {/* duplicate for seamless loop */}
                <span className="tech-chip"><i className="fas fa-microchip"></i> ESP32</span>
                <span className="tech-chip"><i className="fas fa-layer-group"></i> ESP-IDF</span>
                <span className="tech-chip"><i className="fas fa-paint-brush"></i> LVGL 9</span>
                <span className="tech-chip"><i className="fas fa-tachometer-alt"></i> LovyanGFX</span>
                <span className="tech-chip"><i className="fas fa-cogs"></i> FreeRTOS</span>
                <span className="tech-chip"><i className="fab fa-python"></i> Python Build</span>
                <span className="tech-chip"><i className="fas fa-wifi"></i> Wi-Fi Stack</span>
                <span className="tech-chip"><i className="fas fa-database"></i> NVS Storage</span>
            </div>
        </div>

        {/* ── Mission ────────────────────────────────── */}
        <section className="mission">
            <div className="container">
                <div className="mission-content">
                    <div className="mission-text">
                        <h2 className="reveal">Our Mission</h2>
                        <p>FlxOS Labs is dedicated to pushing the boundaries of what's possible on embedded hardware. We believe that microcontrollers deserve rich, intuitive user interfaces that rival desktop operating systems.</p>
                        <p>By combining the power of ESP-IDF with cutting-edge graphics libraries like LVGL, we're creating a platform that makes embedded development accessible, enjoyable, and visually stunning.</p>
                    </div>
                    <div className="mission-stats">
                        <div className="stat-card">
                            <div className="stat-number" data-target="7">7+</div>
                            <div className="stat-label">Core Modules</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">Open</div>
                            <div className="stat-label">Source</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">AGPL-3.0</div>
                            <div className="stat-label">License</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Project Story ──────────────────────────── */}
        <section className="story">
            <div className="container">
                <h2 className="reveal">Project Story</h2>
                <div className="timeline" id="aboutTimeline">
                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-year">2024 — Genesis</div>
                        <div className="timeline-content">
                            <h3>The Beginning</h3>
                            <p>FlxOS started as an experiment to create a desktop-like environment on ESP32 hardware. The goal was simple: prove that embedded systems could offer rich, interactive user experiences beyond simple blinking LEDs.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-year">2024 — Architecture</div>
                        <div className="timeline-content">
                            <h3>Building the Foundation</h3>
                            <p>LVGL 9 integrated with ESP-IDF under a modular architecture that separates concerns cleanly. Hardware acceleration through LovyanGFX enabled smooth 60 FPS graphics at display resolutions previously unheard of on microcontrollers.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-year">March 2026 — Today</div>
                        <div className="timeline-content">
                            <h3>v0.1.0 — Running on Real Hardware</h3>
                            <p>FlxOS now ships a usable embedded desktop environment with multitasking layouts, built-in apps, Wi-Fi foundations, and profile-driven builds. The next push is stability, breadth, and desktop-class tooling.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Technology Philosophy ──────────────────── */}
        <section className="philosophy">
            <div className="container">
                <h2 className="reveal">Technology Philosophy</h2>
                <p className="philosophy-subtitle">Core principles that guide every design decision in FlxOS</p>
                <div className="philosophy-grid">
                    <div className="philosophy-card">
                        <div className="philosophy-icon-wrap">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <h3>Modularity First</h3>
                        <p>Every component is designed to be independent and reusable. Apps, system services, and drivers are cleanly separated, making the codebase maintainable and extensible.</p>
                    </div>
                    <div className="philosophy-card">
                        <div className="philosophy-icon-wrap">
                            <i className="fas fa-rocket"></i>
                        </div>
                        <h3>Performance Matters</h3>
                        <p>We optimize for efficiency without sacrificing features. Hardware acceleration, smart memory management, and FreeRTOS task scheduling ensure smooth operation even on resource-constrained devices.</p>
                    </div>
                    <div className="philosophy-card">
                        <div className="philosophy-icon-wrap">
                            <i className="fas fa-terminal"></i>
                        </div>
                        <h3>Developer Experience</h3>
                        <p>Creating apps should be straightforward. Our API is designed to be intuitive, with clear patterns and comprehensive examples that get developers productive quickly.</p>
                    </div>
                    <div className="philosophy-card">
                        <div className="philosophy-icon-wrap">
                            <i className="fas fa-code-branch"></i>
                        </div>
                        <h3>Open Collaboration</h3>
                        <p>FlxOS is open source and community-driven. We welcome contributions, feedback, and ideas from developers around the world.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* ── Roadmap ────────────────────────────────── */}
        <section className="roadmap">
            <div className="container">
                <h2>Roadmap</h2>
                <p className="section-subtitle">Our vision for the future of FlxOS</p>

                <div className="roadmap-grid">
                    <div className="roadmap-card current">
                        <div className="roadmap-header">
                            <span className="roadmap-badge">Current</span>
                            <h3>v0.1.0</h3>
                        </div>
                        <ul>
                            <li><i className="fas fa-check"></i> Modular architecture &amp; profile system</li>
                            <li><i className="fas fa-check"></i> Calendar, Files, Image Viewer, Text Editor</li>
                            <li><i className="fas fa-check"></i> Wi-Fi connectivity &amp; network base</li>
                            <li><i className="fas fa-check"></i> LVGL integration &amp; headless mode</li>
                        </ul>
                    </div>

                    <div className="roadmap-card">
                        <div className="roadmap-header">
                            <span className="roadmap-badge upcoming">Next</span>
                            <h3>v1.0</h3>
                        </div>
                        <ul>
                            <li><i className="far fa-circle"></i> Bluetooth support</li>
                            <li><i className="far fa-circle"></i> Media player app</li>
                            <li><i className="far fa-circle"></i> Theme customization</li>
                            <li><i className="far fa-circle"></i> Plugin system</li>
                        </ul>
                    </div>

                    <div className="roadmap-card">
                        <div className="roadmap-header">
                            <span className="roadmap-badge future">Future</span>
                            <h3>v2.0</h3>
                        </div>
                        <ul>
                            <li><i className="far fa-circle"></i> Multi-display support</li>
                            <li><i className="far fa-circle"></i> Cloud integration</li>
                            <li><i className="far fa-circle"></i> Voice assistant</li>
                            <li><i className="far fa-circle"></i> Desktop Native + Plugins</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* ── FAQ — Accordion ────────────────────────── */}
        <section className="faq">
            <div className="container">
                <h2>Frequently Asked Questions</h2>
                <p className="faq-subtitle">Everything you need to know about FlxOS</p>

                <div className="faq-list" id="faqList">

                    <div className="faq-item" id="faq-1">
                        <div className="faq-question" role="button" tabIndex={0} aria-expanded="false" aria-controls="faq-1-answer">
                            <h4>Is FlxOS production-ready?</h4>
                            <span className="faq-toggle" aria-hidden="true"><i className="fas fa-plus"></i></span>
                        </div>
                        <div className="faq-answer" id="faq-1-answer" role="region">
                            <div className="faq-answer-inner">
                                <p>FlxOS v0.1.0 is actively developed and running on real ESP32 hardware today. It's ideal for projects, experiments, and early adopters. We continuously improve the project — check the roadmap for what's coming before using in production-critical applications.</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-item" id="faq-2">
                        <div className="faq-question" role="button" tabIndex={0} aria-expanded="false" aria-controls="faq-2-answer">
                            <h4>What hardware do I need?</h4>
                            <span className="faq-toggle" aria-hidden="true"><i className="fas fa-plus"></i></span>
                        </div>
                        <div className="faq-answer" id="faq-2-answer" role="region">
                            <div className="faq-answer-inner">
                                <p>At minimum, you need an ESP32 or ESP32-S3 development board and a compatible TFT display. We recommend displays with touch support for the full interactive experience. Check the documentation for a list of tested hardware configurations.</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-item" id="faq-3">
                        <div className="faq-question" role="button" tabIndex={0} aria-expanded="false" aria-controls="faq-3-answer">
                            <h4>Can I contribute to FlxOS?</h4>
                            <span className="faq-toggle" aria-hidden="true"><i className="fas fa-plus"></i></span>
                        </div>
                        <div className="faq-answer" id="faq-3-answer" role="region">
                            <div className="faq-answer-inner">
                                <p>Absolutely! We welcome contributions of all kinds — code, documentation, bug reports, feature requests, and hardware compatibility reports. Check out our GitHub repository and the CONTRIBUTING.md guide to get started.</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-item" id="faq-4">
                        <div className="faq-question" role="button" tabIndex={0} aria-expanded="false" aria-controls="faq-4-answer">
                            <h4>What license is FlxOS under?</h4>
                            <span className="faq-toggle" aria-hidden="true"><i className="fas fa-plus"></i></span>
                        </div>
                        <div className="faq-answer" id="faq-4-answer" role="region">
                            <div className="faq-answer-inner">
                                <p>FlxOS is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0), ensuring that any modified versions remain open source and available to the community. This means you're free to use, study, share, and modify the software.</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-item" id="faq-5">
                        <div className="faq-question" role="button" tabIndex={0} aria-expanded="false" aria-controls="faq-5-answer">
                            <h4>How can I get help?</h4>
                            <span className="faq-toggle" aria-hidden="true"><i className="fas fa-plus"></i></span>
                        </div>
                        <div className="faq-answer" id="faq-5-answer" role="region">
                            <div className="faq-answer-inner">
                                <p>The best place to get help is our GitHub Issues page. You can also refer to the documentation, explore the source code, or check the project wiki. We aim to respond to all issues within 48 hours.</p>
                            </div>
                        </div>
                    </div>

                    <div className="faq-item" id="faq-6">
                        <div className="faq-question" role="button" tabIndex={0} aria-expanded="false" aria-controls="faq-6-answer">
                            <h4>Where is FlxOS heading?</h4>
                            <span className="faq-toggle" aria-hidden="true"><i className="fas fa-plus"></i></span>
                        </div>
                        <div className="faq-answer" id="faq-6-answer" role="region">
                            <div className="faq-answer-inner">
                                <p>Our roadmap includes expanded hardware support, more built-in apps like a media player, Bluetooth connectivity, cloud integration, and enhanced IoT capabilities. We're building towards making embedded systems truly first-class computing platforms.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* ── Call to Action ─────────────────────────── */}
        <section className="cta">
            <div className="container">
                <div className="cta-inner">
                    <div className="cta-icon" aria-hidden="true">
                        <i className="fab fa-github"></i>
                    </div>
                    <h2>Join the Journey</h2>
                    <p>Help us build the future of embedded operating systems. Star the repo, file an issue, or send a PR — every contribution counts.</p>
                    <div className="cta-buttons">
                        <a href="https://github.com/flxos-labs/flxos" target="_blank" rel="noopener noreferrer"
                            className="btn btn-primary" id="cta-github-btn">
                            <i className="fab fa-github"></i>
                            <span>Star on GitHub</span>
                        </a>
                        <a href="/docs" className="btn btn-secondary" id="cta-docs-btn">
                            <i className="fas fa-book"></i>
                            <span>Read the Docs</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

    
    </>
  );
}
