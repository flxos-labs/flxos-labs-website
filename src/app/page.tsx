
export default function Home() {
  return (
    <>
      
        {/* Hero Section */}
        <section className="hero" aria-labelledby="hero-title">
            <div className="container hero-container">
                <div className="hero-content">
                    <div className="hero-badges">
                        <div className="badge" role="status">v0.1.0</div>

                        <div id="latest-release" className="badge secondary" style={{display: 'none'}} role="status">Latest: --</div>

                    </div>
                    <h1 id="hero-title">Born on a chip.<br/><span className="gradient-text aurora-text">Built for everywhere.</span></h1>
                    <p className="hero-subtitle">
                        FlxOS runs on <span className="platform-word" id="platform-word">ESP32</span> — a complete OS with rich GUI, built-in apps, and a one-command build system. From 4MB microcontrollers to full desktop platforms.
                    </p>
                    <div className="hero-cta">
                        <a href="#get-started" className="btn btn-primary">
                            <span>Get Started</span>
                            <i className="fas fa-arrow-right"></i>
                        </a>
                        <a href="https://github.com/flxos-labs/flxos" target="_blank" rel="noopener noreferrer"
                            className="btn btn-secondary">
                            <i className="fab fa-github"></i>
                            <span>View Source</span>
                        </a>
                    </div>
                    <div className="hero-trust-strip">
                        <span>Built with</span>
                        <div className="trust-tech-badges">
                            <span className="trust-badge"><i className="fas fa-microchip"></i> ESP-IDF</span>
                            <span className="trust-badge"><i className="fas fa-paint-brush"></i> LVGL</span>
                            <span className="trust-badge"><i className="fab fa-python"></i> Python</span>
                            <span className="trust-badge"><i className="fas fa-code"></i> CMake</span>
                        </div>
                    </div>
                    <div className="github-stats">
                        <div className="stat-item">
                            <i className="fas fa-star"></i>
                            <div>
                                <div className="stat-value" id="github-stars"><span className="stat-skeleton"></span></div>
                                <div className="stat-label">Stars</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-code-branch"></i>
                            <div>
                                <div className="stat-value" id="github-forks"><span className="stat-skeleton"></span></div>
                                <div className="stat-label">Forks</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <i className="fas fa-eye"></i>
                            <div>
                                <div className="stat-value" id="github-watchers"><span className="stat-skeleton"></span></div>
                                <div className="stat-label">Watchers</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    {/* 3D Device Mockup with auto-cycling slides */}
                    <div className="device-mockup" id="hero-device">
                        <div className="device-frame">
                            <div className="device-screen" id="heroDeviceScreen">
                                <img className="slide-img active" src="/assets/images/screenshots/scr_20260312_161725_home_screen_with_dock_status_bar_wallpaper.png" alt="FlxOS Home Screen" fetchPriority="high"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_162354_sleek_app_launcher.png" alt="FlxOS App Launcher" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_162706_files_app.png" alt="FlxOS Files App" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_162756_settings_app.png" alt="FlxOS Settings App" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_161649_calendar_app.png" alt="FlxOS Calendar App" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_162819_notification_panel.png" alt="FlxOS Notification Panel" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_162917_quickaccess_panel.png" alt="FlxOS Quick Access Panel" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_163034_system_info_app_in_material_theme.png" alt="System Info Material Theme" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_163047_system_info_app_in_hyprland_dark_theme.png" alt="System Info Dark Theme" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_161745_dynamic_tiling_dwindle_layout_with_4_apps.png" alt="Dynamic Tiling Layout" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_163214_text_editor_with_on_screen_keyboard.png" alt="Text Editor with Keyboard" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_164350_tools_app.png" alt="FlxOS Tools App" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_162948_floating_notification.png" alt="FlxOS Floating Notification" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_163129_open_image_in_image_viewer_from_files_app_side_by_side_with_dynamic_dwindle_layout.png" alt="Image Viewer side by side with Files App" loading="lazy"/>
                                <img className="slide-img" src="/assets/images/screenshots/scr_20260312_163152_open_text_file_in_text_editor_from_files_app_side_by_side_with_dynamic_dwindle_layout.png" alt="Text Editor side by side with Files App" loading="lazy"/>
                                <div className="device-screen-glare"></div>
                            </div>
                        </div>
                        <div className="device-glow"></div>
                    </div>
                    {/* Terminal Window */}
                    <div className="code-window">
                        <div className="window-header">
                            <div className="dots">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                            <span className="title">terminal — flxos</span>
                        </div>
                        <div className="window-content" data-terminal-demo="hero">
                            <div className="code-line"><span className="prompt">$</span> git clone --recurse-submodules
                                https://github.com/flxos-labs/flxos.git</div>
                            <div className="code-line"><span className="prompt">$</span> cd flxos</div>
                            <div className="code-line"><span className="prompt">$</span> python flxos.py select esp32s3-ili9341
                            </div>
                            <div className="code-line"><span className="prompt">$</span> python flxos.py build</div>
                            <div className="code-line output">Selecting profile 'esp32s3-ili9341'...</div>
                            <div className="code-line output">Generating hardware initialization code...</div>
                            <div className="code-line output success">Build completed successfully.</div>
                            <div className="code-line output success highlight">FlxOS ready for flashing!</div>
                            <div className="cursor"></div>
                        </div>
                    </div>
                    <div className="visual-bg-glow"></div>
                </div>
            </div>
        </section>

        {/* Section divider */}
        <div className="section-divider" aria-hidden="true">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" style={{fill: 'var(--bg-darker)'}}/>
            </svg>
        </div>

        {/* By the Numbers Strip */}
        <section className="numbers-strip" aria-label="FlxOS by the numbers">
            <div className="container">
                <p className="numbers-eyebrow">By the numbers</p>
                <div className="numbers-grid">
                    <div className="number-item">
                        <div className="number-value">&lt;240<span className="number-unit">KB</span></div>
                        <div className="number-label">RAM Footprint</div>
                    </div>
                    <div className="number-item">
                        <div className="number-value">60<span className="number-unit">FPS</span></div>
                        <div className="number-label">Smooth Graphics</div>
                    </div>
                    <div className="number-item">
                        <div className="number-value">7<span className="number-unit">+</span></div>
                        <div className="number-label">MCU Variants</div>
                    </div>
                    <div className="number-item">
                        <div className="number-value">4<span className="number-unit">min</span></div>
                        <div className="number-label">Zero to Running</div>
                    </div>
                    <div className="number-item">
                        <div className="number-value">$10<span className="number-unit">+</span></div>
                        <div className="number-label">Min Hardware Cost</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section — Bento Grid */}
        <section id="features" className="features">
            <div className="container">
                <div className="section-header">
                    <h2>Advanced Capabilities</h2>
                    <p>Built for performance, scalability, and visual excellence.</p>
                </div>
                <div className="bento-grid">
                    {/* Rich GUI & Apps card */}
                    <div className="bento-card" id="bento-gui">
                        <div className="bento-card-bg"></div>
                        <div className="icon-box">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <h3>Rich GUI &amp; Apps</h3>
                        <p>LVGL-powered touch UI with theming. Calendar, File Manager, Image Viewer,
                            Text Editor, Settings, System Info &mdash; all built-in and extensible.</p>
                        <div className="bento-glow"></div>
                    </div>
                    {/* Right column stacked: Multi-Board on top, Modular below */}
                    <div className="bento-card bento-medium">
                        <div className="icon-box">
                            <i className="fas fa-microchip"></i>
                        </div>
                        <h3>Multi-Board Support</h3>
                        <p>ESP32, S2, S3, C3, C6, H2, P4 &mdash; profile system for hardware-specific builds.</p>
                        <div className="bento-tag-row">
                            <span className="bento-tag">ESP32</span>
                            <span className="bento-tag">ESP32-S3</span>
                            <span className="bento-tag">ESP32-P4</span>
                        </div>
                    </div>
                    <div className="bento-card bento-medium bento-accent">
                        <div className="icon-box">
                            <i className="fas fa-puzzle-piece"></i>
                        </div>
                        <h3>Modular Architecture</h3>
                        <p>Clean Core / Kernel / UI / Hardware layers &mdash; optimal performance &amp; maintainability.</p>
                        <div className="bento-layers">
                            <div className="layer">Core</div>
                            <div className="layer">Kernel</div>
                            <div className="layer">UI</div>
                            <div className="layer">Hardware</div>
                        </div>
                    </div>
                    {/* Bottom row: 3 small cards spanning all 3 columns */}
                    <div className="bento-card bento-small">
                        <div className="icon-box">
                            <i className="fas fa-bolt"></i>
                        </div>
                        <h3>One-Command Builds</h3>
                        <p>flxos.py CLI &mdash; select, build, flash, release.</p>
                    </div>
                    <div className="bento-card bento-small">
                        <div className="icon-box">
                            <i className="fas fa-tv"></i>
                        </div>
                        <h3>Display-Agnostic</h3>
                        <p>ILI9341, ST7789, and many more. Headless mode included.</p>
                    </div>
                    <div className="bento-card bento-small bento-future">
                        <div className="icon-box">
                            <i className="fas fa-desktop"></i>
                        </div>
                        <h3>Desktop <span className="coming-soon-badge">Soon</span></h3>
                        <p>Linux, macOS, and Windows &mdash; same rich UI, same architecture.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Why FlxOS Section */}
        <section id="why-flxos" className="why-section" aria-labelledby="why-title">
            <div className="container">
                <div className="why-inner">
                    <div className="why-statement">
                        <div className="section-eyebrow">The difference</div>
                        <h2 id="why-title">Why developers<br/>choose <span className="gradient-text">FlxOS</span></h2>
                        <p className="why-lead-text">Most embedded projects start with a RTOS. Then a display library. Then a UI framework. Then <strong>weeks of glue code</strong> before anything runs on screen.</p>
                        <p className="why-lead-text">FlxOS ships it all — <strong>unified, from day one</strong>, with a single CLI command to build and flash.</p>
                        <div className="why-cta-row">
                            <a href="#get-started" className="btn btn-primary">
                                <span>Start in Minutes</span>
                                <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="comparison-table">
                        <div className="compare-col compare-others">
                            <h4>Traditional Stack</h4>
                            <ul>
                                <li><i className="fas fa-times compare-icon-no"></i> FreeRTOS + LVGL + display lib — manual setup</li>
                                <li><i className="fas fa-times compare-icon-no"></i> Manual HAL per board variant</li>
                                <li><i className="fas fa-times compare-icon-no"></i> No unified build system</li>
                                <li><i className="fas fa-times compare-icon-no"></i> Weeks to first working UI</li>
                                <li><i className="fas fa-times compare-icon-no"></i> Embedded-only, no desktop path</li>
                            </ul>
                        </div>
                        <div className="compare-col compare-flxos">
                            <h4>FlxOS</h4>
                            <ul>
                                <li><i className="fas fa-check compare-icon-yes"></i> Fully integrated from day one</li>
                                <li><i className="fas fa-check compare-icon-yes"></i> Profile-driven per-board config</li>
                                <li><i className="fas fa-check compare-icon-yes"></i> One-command build &amp; flash</li>
                                <li><i className="fas fa-check compare-icon-yes"></i> Running in minutes</li>
                                <li><i className="fas fa-check compare-icon-yes"></i> Scales to desktop (coming v2.0)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Screenshots Section — Horizontal Carousel */}
        <section id="screenshots" className="screenshots" aria-labelledby="screenshots-title">
            <div className="section-header container">
                <h2 id="screenshots-title">System Gallery</h2>
                <p>Eight key moments that show how FlxOS moves from polished home screen to real multitasking workflows.</p>
            </div>

            {/* Featured hero shot */}
            <div className="gallery-featured">
                <div className="gallery-featured-device">
                    <div className="gf-frame">
                        <img src="/assets/images/screenshots/scr_20260312_161725_home_screen_with_dock_status_bar_wallpaper.png"
                            alt="FlxOS full home screen" loading="lazy" width="320" height="240" decoding="async"/>
                        <div className="gf-glare"></div>
                    </div>
                    <div className="gf-glow"></div>
                </div>
                <div className="gallery-featured-text">
                    <div className="gallery-featured-label">Story Beat 01</div>
                    <h3 className="gallery-featured-title">Home Screen — Full Experience</h3>
                    <p>Dock, status bar, dynamic wallpaper and live widgets — all running on a tiny ESP32 display.</p>
                </div>
            </div>

            {/* Horizontal carousel */}
            <div className="carousel-wrapper">
                <button className="carousel-btn carousel-btn-prev" id="galleryPrev" aria-label="Previous screenshots">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <div className="carousel-track-outer">
                    <div className="carousel-track" id="galleryTrack">
                        <div className="carousel-slide" data-title="Home Screen">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_161725_home_screen_with_dock_status_bar_wallpaper.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_161725_home_screen_with_dock_status_bar_wallpaper.png" alt="FlxOS Home Screen" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Home Screen</span>
                            <span className="slide-why">A full desktop-like shell on a microcontroller is the opening proof point.</span>
                        </div>
                        <div className="carousel-slide" data-title="App Launcher">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_162354_sleek_app_launcher.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_162354_sleek_app_launcher.png" alt="FlxOS App Launcher" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">App Launcher</span>
                            <span className="slide-why">Shows app breadth and a touch-first navigation model that feels deliberate.</span>
                        </div>
                        <div className="carousel-slide" data-title="Tiling Layout">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_161745_dynamic_tiling_dwindle_layout_with_4_apps.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_161745_dynamic_tiling_dwindle_layout_with_4_apps.png" alt="Dynamic Tiling Layout" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Tiling Layout</span>
                            <span className="slide-why">This is the "wait, it can tile windows too?" moment for embedded devs.</span>
                        </div>
                        <div className="carousel-slide" data-title="Image Viewer + Files">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_163129_open_image_in_image_viewer_from_files_app_side_by_side_with_dynamic_dwindle_layout.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_163129_open_image_in_image_viewer_from_files_app_side_by_side_with_dynamic_dwindle_layout.png" alt="Image Viewer side by side with Files App" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Files + Viewer</span>
                            <span className="slide-why">A split-view workflow makes FlxOS feel like an operating system, not a demo.</span>
                        </div>
                        <div className="carousel-slide" data-title="Settings App">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_162756_settings_app.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_162756_settings_app.png" alt="FlxOS Settings App" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Settings</span>
                            <span className="slide-why">Polished system settings signal maturity beyond a flashy shell.</span>
                        </div>
                        <div className="carousel-slide" data-title="Calendar App">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_161649_calendar_app.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_161649_calendar_app.png" alt="FlxOS Calendar App" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Calendar</span>
                            <span className="slide-why">A practical built-in app proves the platform is usable for everyday tasks.</span>
                        </div>
                        <div className="carousel-slide" data-title="Notification Panel">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_162819_notification_panel.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_162819_notification_panel.png" alt="FlxOS Notification Panel" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Notifications</span>
                            <span className="slide-why">OS-level alerts are the kind of detail that turns UI into platform.</span>
                        </div>
                        <div className="carousel-slide" data-title="System Info (Dark)">
                            <div className="slide-device">
                                <picture>
                                    <source srcSet="/assets/images/screenshots/scr_20260312_163047_system_info_app_in_hyprland_dark_theme.webp" type="image/webp"/>
                                    <img src="/assets/images/screenshots/scr_20260312_163047_system_info_app_in_hyprland_dark_theme.png" alt="System Info Dark Theme" loading="lazy"/>
                                </picture>
                            </div>
                            <span className="slide-label">Dark Theme</span>
                            <span className="slide-why">Theme adaptability shows the UI system can scale stylistically too.</span>
                        </div>
                    </div>
                </div>
                <button className="carousel-btn carousel-btn-next" id="galleryNext" aria-label="Next screenshots">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
            {/* Pagination dots */}
            <div className="carousel-dots" id="carouselDots" aria-label="Gallery navigation"></div>

            {/* Lightbox */}
            <div id="lightbox" className="lightbox" aria-hidden="true" role="dialog" aria-modal="true">
                <button className="lightbox-close" aria-label="Close Lightbox">&times;</button>
                <div className="lightbox-content">
                    <img src="" alt="Full size screenshot" id="lightbox-img"/>
                    <div className="lightbox-caption"></div>
                </div>
                <button className="lightbox-prev" aria-label="Previous image"><i className="fas fa-chevron-left"></i></button>
                <button className="lightbox-next" aria-label="Next image"><i className="fas fa-chevron-right"></i></button>
            </div>
        </section>

        {/* Hardware Gallery — Real Device Photos */}
        <section id="hardware" className="hardware-gallery" aria-labelledby="hardware-title">
            <div className="container">
                <div className="section-header">
                    <div className="section-eyebrow">Real hardware</div>
                    <h2 id="hardware-title">FlxOS on <span className="gradient-text">Real Devices</span></h2>
                    <p>Not simulated. Not mocked. FlxOS running live on Lilygo T-HMI and ESP32 hardware.</p>
                </div>
                <div className="hw-photo-grid">
                    <div className="hw-photo-card reveal">
                        <span className="hw-device-badge">Lilygo T-HMI</span>
                        <img src="/assets/images/hardware/lilygo-thmi-quickaccess-panel.jpg" alt="FlxOS Quick Access Panel running on Lilygo T-HMI" loading="lazy"/>
                        <div className="hw-photo-label">Quick Access Panel</div>
                    </div>
                    <div className="hw-photo-card reveal">
                        <span className="hw-device-badge">Lilygo T-HMI</span>
                        <img src="/assets/images/hardware/lilygo-thmi-systeminfo-app.jpg" alt="FlxOS System Info app running on Lilygo T-HMI" loading="lazy"/>
                        <div className="hw-photo-label">System Info App</div>
                    </div>
                    <div className="hw-photo-card reveal">
                        <span className="hw-device-badge">Lilygo T-HMI</span>
                        <img src="/assets/images/hardware/lilygo-thmi-notification-panel.jpg" alt="FlxOS Notification Panel on hardware" loading="lazy"/>
                        <div className="hw-photo-label">Notification Panel</div>
                    </div>
                    <div className="hw-photo-card reveal">
                        <span className="hw-device-badge">Lilygo T-HMI</span>
                        <img src="/assets/images/hardware/lilygo-thmi-calculator-app.jpg" alt="FlxOS Calculator App on Lilygo T-HMI" loading="lazy"/>
                        <div className="hw-photo-label">Calculator App</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Tech Stack — SVG Logo Cloud */}
        <section id="tech-stack" className="tech-stack">
            <div className="container">
                <div className="section-header">
                    <h2>Powered By</h2>
                    <p>Built on industry-standard technologies for reliability and performance.</p>
                </div>
                <div className="tech-logo-cloud" role="list" aria-label="Technology stack">

                    <div className="tech-logo-item" role="listitem">
                        <div className="tech-logo-circle">
                            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect width="80" height="80" rx="12" fill="#E7343A" opacity="0.15"/>
                                <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="800" fill="#E7343A" text-anchor="middle">ESP</text>
                                <text x="40" y="62" font-family="sans-serif" font-size="9" font-weight="600" fill="#E7343A" text-anchor="middle" opacity="0.8">IDF</text>
                            </svg>
                        </div>
                        <span>ESP-IDF</span>
                        <p className="tech-rationale">Chosen for native Espressif support, stable drivers, and the right low-level control for a real OS.</p>
                        <div className="tech-tooltip">Espressif IoT Development Framework — the real-time OS foundation of FlxOS</div>
                    </div>

                    <div className="tech-logo-item" role="listitem">
                        <div className="tech-logo-circle">
                            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect width="80" height="80" rx="12" fill="#00B4D8" opacity="0.15"/>
                                <text x="40" y="52" font-family="sans-serif" font-size="18" font-weight="800" fill="#00B4D8" text-anchor="middle">LVGL</text>
                            </svg>
                        </div>
                        <span>LVGL</span>
                        <p className="tech-rationale">Chosen because it delivers rich embedded UI primitives without forcing FlxOS into a toy interface.</p>
                        <div className="tech-tooltip">Light &amp; Versatile Graphics Library — hardware-accelerated UI engine</div>
                    </div>

                    <div className="tech-logo-item" role="listitem">
                        <div className="tech-logo-circle">
                            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect width="80" height="80" rx="12" fill="#8B5CF6" opacity="0.15"/>
                                <text x="40" y="45" font-family="sans-serif" font-size="10" font-weight="800" fill="#8B5CF6" text-anchor="middle">Lovyan</text>
                                <text x="40" y="59" font-family="sans-serif" font-size="10" font-weight="800" fill="#8B5CF6" text-anchor="middle">GFX</text>
                            </svg>
                        </div>
                        <span>LovyanGFX</span>
                        <p className="tech-rationale">Chosen for fast display support across panels like ILI9341 and ST7789 with minimal friction.</p>
                        <div className="tech-tooltip">High-performance graphics library supporting ILI9341, ST7789 &amp; more</div>
                    </div>

                    <div className="tech-logo-item" role="listitem">
                        <div className="tech-logo-circle">
                            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect width="80" height="80" rx="12" fill="#3B82F6" opacity="0.15"/>
                                <path d="M40 18c-10 0-9 4.5-9 4.5L31 34h18l-1 3H26s-6-0.7-6 9 5.5 9 5.5 9h3.3v-4.3s-0.2-5.3 5.2-5.3h9s5 0.1 5-4.8V26.8s0.8-8.8-9-8.8zm-5 3.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="#3B82F6" opacity="0.8"/>
                                <path d="M40 62c10 0 9-4.5 9-4.5L49 46H31l1-3h22s6 0.7 6-9-5.5-9-5.5-9H51.2v4.3s0.2 5.3-5.2 5.3h-9s-5-0.1-5 4.8v12.8S31.2 62 40 62zm5-3.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#FFD43B" opacity="0.9"/>
                            </svg>
                        </div>
                        <span>Python 3</span>
                        <p className="tech-rationale">Chosen to keep board selection, automation, and release tooling approachable on every developer machine.</p>
                        <div className="tech-tooltip">Python-powered CLI for profile selection, building &amp; flashing</div>
                    </div>

                    <div className="tech-logo-item" role="listitem">
                        <div className="tech-logo-circle">
                            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect width="80" height="80" rx="12" fill="#22C55E" opacity="0.15"/>
                                <polygon points="40,15 60,60 20,60" fill="#22C55E" opacity="0.8"/>
                                <polygon points="40,22 40,60 20,60" fill="#064e3b" opacity="0.4"/>
                            </svg>
                        </div>
                        <span>CMake</span>
                        <p className="tech-rationale">Chosen for reproducible cross-platform builds as FlxOS expands from chips toward desktop targets.</p>
                        <div className="tech-tooltip">Cross-platform build system managing all FlxOS compilation targets</div>
                    </div>

                </div>
            </div>
        </section>

        {/* Roadmap Section — Horizontal Timeline */}
        <section id="roadmap" className="roadmap">
            <div className="container">
                <div className="section-header">
                    <h2>Roadmap</h2>
                    <p>Where FlxOS is headed — from embedded to everywhere.</p>
                </div>
                <div className="roadmap-h-timeline">
                    <div className="roadmap-h-track"></div>
                    <div className="roadmap-h-items">
                        <div className="roadmap-h-item completed" data-version="v0.1">
                            <div className="roadmap-h-marker">
                                <i className="fas fa-check"></i>
                                <div className="roadmap-h-pulse"></div>
                            </div>
                            <div className="roadmap-h-card">
                                <div className="roadmap-h-version">v0.1 &mdash; Released</div>
                                <h3>ESP32 Embedded</h3>
                                <p>Full OS with touch UI, hardware abstraction, built-in apps, and profile-driven builds.</p>
                                <div className="roadmap-h-date">March 2026</div>
                                <div className="roadmap-h-progress">
                                    <div className="roadmap-h-bar"><div className="roadmap-h-fill" style={{width: '100%'}}></div></div>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-h-item upcoming" data-version="v1.0">
                            <div className="roadmap-h-marker">
                                <i className="fas fa-desktop"></i>
                            </div>
                            <div className="roadmap-h-card">
                                <div className="roadmap-h-version">v1.0 &mdash; In Progress</div>
                                <h3>Stable Release</h3>
                                <p>Feature-complete build: Bluetooth, media player, theme customization, and extended hardware support.</p>
                                <div className="roadmap-h-date">Target: Q4 2026</div>
                                <div className="roadmap-h-progress">
                                    <div className="roadmap-h-bar"><div className="roadmap-h-fill" style={{width: '30%'}}></div></div>
                                    <span>30%</span>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-h-item upcoming" data-version="v1.5">
                            <div className="roadmap-h-marker">
                                <i className="fas fa-flask"></i>
                            </div>
                            <div className="roadmap-h-card">
                                <div className="roadmap-h-version">v1.5 &mdash; Planned</div>
                                <h3>Desktop Simulator</h3>
                                <p>Develop and test FlxOS apps on your desktop without any physical hardware.</p>
                                <div className="roadmap-h-date">Target: Q2 2027</div>
                                <div className="roadmap-h-progress">
                                    <div className="roadmap-h-bar"><div className="roadmap-h-fill" style={{width: '0%'}}></div></div>
                                    <span>0%</span>
                                </div>
                            </div>
                        </div>
                        <div className="roadmap-h-item upcoming" data-version="v2.0">
                            <div className="roadmap-h-marker">
                                <i className="fas fa-plug"></i>
                            </div>
                            <div className="roadmap-h-card">
                                <div className="roadmap-h-version">v2.0 &mdash; Vision</div>
                                <h3>Desktop Native + Plugins</h3>
                                <p>Run FlxOS on Linux, macOS, and Windows. Community-driven app and driver extensions.</p>
                                <div className="roadmap-h-date">Target: 2027+</div>
                                <div className="roadmap-h-progress">
                                    <div className="roadmap-h-bar"><div className="roadmap-h-fill" style={{width: '0%'}}></div></div>
                                    <span>0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Community Section — Social Proof */}
        <section id="community" className="community">
            <div className="container">
                <div className="section-header">
                    <h2>Join the Community</h2>
                    <p>FlxOS is open source and community-driven. Get involved today.</p>
                </div>

                {/* Star count hero */}
                <div className="community-hero">
                    <div className="community-star-glow">
                        <i className="fas fa-star"></i>
                        <span className="community-star-count" id="community-stars">—</span>
                        <span className="community-star-label">GitHub Stars</span>
                    </div>
                    <div className="community-contributors">
                        <div className="contributor-label">Contributors</div>
                        <div className="contributor-avatars" id="contributorAvatars">
                            {/* Filled via JS from GitHub API */}
                            <div className="contributor-placeholder"><i className="fab fa-github"></i></div>
                        </div>
                        <a href="https://github.com/flxos-labs/flxos/graphs/contributors" target="_blank"
                            rel="noopener noreferrer" className="contributor-cta">View all contributors →</a>
                    </div>
                </div>

                <div className="community-grid">
                    <a href="https://github.com/flxos-labs/flxos/blob/main/CONTRIBUTING.md" target="_blank"
                        rel="noopener noreferrer" className="community-card">
                        <div className="community-icon">
                            <i className="fas fa-code-pull-request"></i>
                        </div>
                        <h3>Contribute</h3>
                        <p>Submit pull requests, fix bugs, or add new features. Every contribution matters.</p>
                        <span className="community-link">Read Contributing Guide <i className="fas fa-arrow-right"></i></span>
                    </a>
                    <a href="https://github.com/flxos-labs/flxos/issues" target="_blank" rel="noopener noreferrer"
                        className="community-card">
                        <div className="community-icon">
                            <i className="fas fa-bug"></i>
                        </div>
                        <h3>Report Issues</h3>
                        <p>Found a bug or have a feature request? Open an issue on GitHub to help us improve.</p>
                        <span className="community-link">Open an Issue <i className="fas fa-arrow-right"></i></span>
                    </a>
                    <a href="https://github.com/flxos-labs/flxos/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                        target="_blank" rel="noopener noreferrer" className="community-card">
                        <div className="community-icon">
                            <i className="fas fa-seedling"></i>
                        </div>
                        <h3>Good First Issues</h3>
                        <p>New to FlxOS? Start with beginner-friendly issues tagged for first-time contributors.</p>
                        <span className="community-link">Browse Issues <i className="fas fa-arrow-right"></i></span>
                    </a>
                    <a href="https://github.com/flxos-labs/flxos" target="_blank" rel="noopener noreferrer"
                        className="community-card">
                        <div className="community-icon">
                            <i className="fas fa-star"></i>
                        </div>
                        <h3>Star on GitHub</h3>
                        <p>Show your support by starring the project. It helps others discover FlxOS.</p>
                        <span className="community-link">Star the Repo <i className="fas fa-arrow-right"></i></span>
                    </a>
                </div>
            </div>
        </section>

        {/* Testimonials / Community Love */}
        <section id="testimonials" className="testimonials" aria-labelledby="testimonials-title">
            <div className="container">
                <div className="section-header">
                    <div className="section-eyebrow">Community</div>
                    <h2 id="testimonials-title">Built with the <span className="gradient-text">community</span></h2>
                    <p>Real developers. Real hardware. Real feedback driving FlxOS forward.</p>
                </div>
                <div className="testimonial-grid">

                    <div className="testimonial-card">
                        <div className="testimonial-quote-mark">&ldquo;</div>
                        <p className="testimonial-text">Please add support for T-HMI. I tried to compile it and I am <strong>available for testing.</strong> This project is exactly what I've been looking for.</p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar-initials">RB</div>
                            <div>
                                <div className="testimonial-name">@Revers-BR</div>
                                <div className="testimonial-handle"><a href="https://github.com/flxos-labs/flxos/issues/43" target="_blank" rel="noopener noreferrer">github.com/flxos-labs &middot; Issue #43</a></div>
                                <span className="testimonial-source-badge"><i className="fab fa-github"></i> GitHub Issue</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* Get Started — Animated Step-by-Step */}
        <section id="get-started" className="get-started">
            <div className="container">
                <div className="section-header">
                    <h2>Ready to Build?</h2>
                    <p>Get your environment set up and start developing with FlxOS in minutes.</p>
                </div>
                <div className="steps-grid">
                    {/* Step indicators */}
                    <div className="steps-sidebar">
                        <div className="step-indicator active" data-step="0" id="step-btn-0">
                            <div className="step-num">1</div>
                            <div className="step-info">
                                <div className="step-info-title">Clone</div>
                                <div className="step-info-sub">Get the source code</div>
                            </div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-indicator" data-step="1" id="step-btn-1">
                            <div className="step-num">2</div>
                            <div className="step-info">
                                <div className="step-info-title">Environment</div>
                                <div className="step-info-sub">Set up ESP-IDF</div>
                            </div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-indicator" data-step="2" id="step-btn-2">
                            <div className="step-num">3</div>
                            <div className="step-info">
                                <div className="step-info-title">Select Profile</div>
                                <div className="step-info-sub">Choose your board</div>
                            </div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-indicator" data-step="3" id="step-btn-3">
                            <div className="step-num">4</div>
                            <div className="step-info">
                                <div className="step-info-title">Build &amp; Flash</div>
                                <div className="step-info-sub">Deploy to device</div>
                            </div>
                        </div>
                    </div>

                    {/* Code panels */}
                    <div className="steps-code">
                        <div className="step-panel active" id="step-panel-0">
                            <div className="code-block-wrapper">
                                <div className="code-header">
                                    <span>Step 1 — Clone Repository</span>
                                    <button className="copy-btn" id="copyBtn" data-step="0">
                                        <i className="far fa-copy"></i>
                                    </button>
                                </div>
                                <pre><code className="language-bash step-code" id="installCode">{`git clone --recurse-submodules \
  https://github.com/flxos-labs/flxos.git
cd flxos`}</code></pre>
                            </div>
                        </div>
                        <div className="step-panel" id="step-panel-1">
                            <div className="code-block-wrapper">
                                <div className="code-header">
                                    <span>Step 2 — Set Up Environment</span>
                                    <button className="copy-btn" data-step="1">
                                        <i className="far fa-copy"></i>
                                    </button>
                                </div>
                                <pre><code className="language-bash step-code">{`# Requires ESP-IDF v5.5+
source \$IDF_PATH/export.sh`}</code></pre>
                            </div>
                        </div>
                        <div className="step-panel" id="step-panel-2">
                            <div className="code-block-wrapper">
                                <div className="code-header">
                                    <span>Step 3 — Select Your Profile</span>
                                    <button className="copy-btn" data-step="2">
                                        <i className="far fa-copy"></i>
                                    </button>
                                </div>
                                <pre><code className="language-bash step-code">{`# List available hardware profiles
python flxos.py list

# Select your board
python flxos.py select esp32s3-ili9341-xpt`}</code></pre>
                            </div>
                        </div>
                        <div className="step-panel" id="step-panel-3">
                            <div className="code-block-wrapper">
                                <div className="code-header">
                                    <span>Step 4 — Build &amp; Flash</span>
                                    <button className="copy-btn" data-step="3">
                                        <i className="far fa-copy"></i>
                                    </button>
                                </div>
                                <pre><code className="language-bash step-code">{`# Build the project
python flxos.py build

# Flash to your device
python flxos.py flash --port /dev/ttyUSB0`}</code></pre>
                            </div>
                        </div>
                        {/* Prerequisites pill */}
                        <div className="prereqs-pill">
                            <i className="fas fa-info-circle"></i>
                            <strong>Prerequisites:</strong> ESP-IDF v5.5+ &nbsp;·&nbsp; Python 3.10+ &nbsp;·&nbsp; CMake 3.16+
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section id="build-story" className="build-story" aria-labelledby="build-story-title">
            <div className="container">
                <div className="build-story-shell">
                    <div className="build-story-copy">
                        <div className="section-eyebrow">Zero to running</div>
                        <h2 id="build-story-title">From clone to flashing in one clean flow</h2>
                        <p>The build experience is part of the product. FlxOS uses a profile-driven CLI so setup feels guided instead of stitched together from docs, shell history, and guesswork.</p>
                        <div className="build-story-points">
                            <div className="build-story-point">
                                <strong>Profile-aware</strong>
                                <span>Select the board once and the build pipeline follows that hardware path.</span>
                            </div>
                            <div className="build-story-point">
                                <strong>Repeatable</strong>
                                <span>The same command flow works for demos, iteration, and release builds.</span>
                            </div>
                            <div className="build-story-point">
                                <strong>Fast feedback</strong>
                                <span>You get visible progress instead of opaque build-system noise.</span>
                            </div>
                        </div>
                    </div>
                    <div className="code-window build-story-terminal">
                        <div className="window-header">
                            <div className="dots">
                                <span className="dot red"></span>
                                <span className="dot yellow"></span>
                                <span className="dot green"></span>
                            </div>
                            <span className="title">zero-to-running.sh</span>
                        </div>
                        <div className="window-content" data-terminal-demo="build-story"></div>
                    </div>
                </div>
            </div>
        </section>
        {/* Newsletter Section — Full-Width Dramatic CTA */}
        <section className="newsletter" id="newsletter">
            <div className="newsletter-bg-wrap" aria-hidden="true">
                <div className="newsletter-orb newsletter-orb-1"></div>
                <div className="newsletter-orb newsletter-orb-2"></div>
            </div>
            <div className="container">
                <div className="newsletter-inner">
                    <div className="newsletter-eyebrow"><i className="fas fa-satellite-dish"></i> Stay in the loop</div>
                    <h2 className="newsletter-headline">Join the Future of <span className="gradient-text">Embedded</span></h2>
                    <p className="newsletter-subtext">Get releases, roadmap updates, and early access to new features — directly to your inbox.</p>
                    <form id="newsletter-form" className="newsletter-form-v2" action="https://formspree.io/f/xqeynadn" method="POST">
                        <div className="newsletter-input-wrap">
                            <i className="fas fa-envelope newsletter-input-icon"></i>
                            <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address" className="newsletter-input-v2"/>
                        </div>
                        <button type="submit" className="btn btn-primary btn-newsletter-cta">
                            <span>Subscribe Free</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </form>
                    <div id="newsletter-message" className="newsletter-message" style={{display: 'none'}}>
                        <i className="fas fa-check-circle"></i> You're in! Welcome to FlxOS updates.
                    </div>
                    <div id="newsletter-error" className="newsletter-error" style={{display: 'none'}}>
                        <i className="fas fa-exclamation-circle"></i> Something went wrong. Please try again.
                    </div>
                    <div className="newsletter-trust">
                        <span><i className="fas fa-lock"></i> No spam</span>
                        <span><i className="fas fa-times"></i> No tracking</span>
                        <span><i className="fas fa-heart"></i> Unsubscribe anytime</span>
                    </div>
                </div>
            </div>
            {/* Confetti canvas */}
            <canvas id="confettiCanvas" aria-hidden="true"></canvas>
        </section>
    
    </>
  );
}
