
export default function Docs() {
  return (
    <>
      
        {/* Mobile Sidebar Toggle */}
        <button id="mobileSidebarToggle" className="mobile-sidebar-toggle" aria-label="Toggle documentation menu">
            <i className="fas fa-list-ul"></i>
            <span>Menu</span>
        </button>

        {/* Sidebar Backdrop */}
        <div id="sidebarBackdrop" className="sidebar-backdrop"></div>

        <div className="container docs-container">
            {/* Sidebar Navigation */}
            <aside className="docs-sidebar" id="docsSidebar">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" id="docSearch" placeholder="Search docs... (press /)" />
                    <button id="clearSearch" className="clear-btn" style={{display: 'none'}}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="sidebar-section">
                    <h4>Getting Started</h4>
                    <ul>
                        <li><a href="#installation" className="active">Installation</a></li>
                        <li><a href="#quick-start">Quick Start</a></li>
                        <li><a href="#prerequisites">Prerequisites</a></li>
                    </ul>
                </div>
                <div className="sidebar-section">
                    <h4>Architecture</h4>
                    <ul>
                        <li><a href="#overview">System Overview</a></li>
                        <li><a href="#directory">Directory Structure</a></li>
                        <li><a href="#modules">Core Modules</a></li>
                    </ul>
                </div>
                <div className="sidebar-section">
                    <h4>Development</h4>
                    <ul>
                        <li><a href="#building">Building</a></li>
                        <li><a href="#configuration">Configuration</a></li>
                        <li><a href="#apps">Creating Apps</a></li>
                    </ul>
                </div>
                <div className="sidebar-section">
                    <h4>Reference</h4>
                    <ul>
                        <li><a href="#api">API Reference</a></li>
                        <li><a href="#troubleshooting">Troubleshooting</a></li>
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="docs-content">
                <div className="breadcrumb">
                    <a href="/">Home</a>
                    <span>/</span>
                    <span>Documentation</span>
                </div>

                <h1>FlxOS Documentation</h1>
                <p className="lead">Complete guide to installing, configuring, and developing with FlxOS.</p>

                {/* Installation */}
                <section id="installation" className="doc-section">
                    <h2><i className="fas fa-download"></i> Installation</h2>
                    <p>FlxOS requires ESP-IDF v5.5+ and a compatible ESP32 development board. Follow these steps to get
                        started.</p>

                    <div className="code-block-wrapper">
                        <div className="code-header">
                            <span>Clone Repository</span>
                            <button className="copy-btn" data-target="install-code-1">
                                <i className="far fa-copy"></i>
                            </button>
                        </div>
                        <pre><code id="install-code-1" className="language-bash">{`git clone --recurse-submodules https://github.com/flxos-labs/flxos.git
cd flxos`}</code></pre>
                    </div>
                </section>

                {/* Quick Start */}
                <section id="quick-start" className="doc-section">
                    <h2><i className="fas fa-rocket"></i> Quick Start</h2>
                    <p>Get FlxOS running on your ESP32 in just a few minutes.</p>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Set up ESP-IDF environment</h3>
                                <div className="code-block-wrapper">
                                    <pre><code className="language-bash">{`. \$HOME/esp/esp-idf/export.sh`}</code></pre>
                                </div>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>List and Select Profile</h3>
                                <div className="code-block-wrapper">
                                    <pre><code className="language-bash">{`python flxos.py list
python flxos.py select esp32s3-ili9341-xpt`}</code></pre>
                                </div>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Build and flash</h3>
                                <div className="code-block-wrapper">
                                    <pre><code className="language-bash">{`python flxos.py build
python flxos.py flash --port /dev/ttyUSB0`}</code></pre>
                                </div>
                                <p className="note"><i className="fas fa-info-circle"></i> Profiles are defined via YAML files
                                    in the Profiles directory.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prerequisites */}
                <section id="prerequisites" className="doc-section">
                    <h2><i className="fas fa-check-circle"></i> Prerequisites</h2>

                    <div className="info-box">
                        <h4>Required Software</h4>
                        <ul>
                            <li><strong>ESP-IDF v5.5+</strong> - <a
                                    href="https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/"
                                    target="_blank" rel="noopener noreferrer">Installation Guide</a></li>
                            <li><strong>CMake 3.16+</strong> - Build system generator</li>
                            <li><strong>Ninja</strong> - Fast build tool</li>
                            <li><strong>Python 3.10+</strong> - Required for ESP-IDF tools</li>
                        </ul>
                    </div>

                    <div className="info-box">
                        <h4>Supported Hardware</h4>
                        <ul>
                            <li>ESP32 (all variants)</li>
                            <li>ESP32-S3</li>
                            <li>Compatible TFT display (recommended: ILI9341, ST7789)</li>
                            <li>Touch controller (optional: XPT2046, FT6336)</li>
                        </ul>
                    </div>
                </section>

                {/* System Overview */}
                <section id="overview" className="doc-section">
                    <h2><i className="fas fa-sitemap"></i> System Overview</h2>
                    <p>FlxOS is architected as a modular embedded system with clear separation of concerns.</p>

                    <div className="architecture-diagram">
                        <div className="arch-layer">
                            <h4>Application Layer</h4>
                            <p>Settings, Files, Text Editor, Tools</p>
                        </div>
                        <div className="arch-arrow">↓</div>
                        <div className="arch-layer">
                            <h4>Desktop Environment</h4>
                            <p>Window Manager, Task Bar, Launcher</p>
                        </div>
                        <div className="arch-arrow">↓</div>
                        <div className="arch-layer">
                            <h4>System Services</h4>
                            <p>Wi-Fi, Bluetooth, File System, Settings</p>
                        </div>
                        <div className="arch-arrow">↓</div>
                        <div className="arch-layer">
                            <h4>Hardware Abstraction</h4>
                            <p>LVGL, LovyanGFX, Drivers</p>
                        </div>
                        <div className="arch-arrow">↓</div>
                        <div className="arch-layer">
                            <h4>ESP-IDF & FreeRTOS</h4>
                            <p>Hardware, Network Stack, Task Scheduler</p>
                        </div>
                    </div>
                </section>

                {/* Directory Structure */}
                <section id="directory" className="doc-section">
                    <h2><i className="fas fa-folder-tree"></i> Directory Structure</h2>

                    <div className="code-block-wrapper">
                        <pre><code className="language-bash">{`flxos/
├── Applications/    # User-facing apps (calendar, files, text editor, settings, ...)
├── Apps/            # App framework and lifecycle management
├── Buildscripts/    # CMake modules, profile loader, HW code generator
├── Connectivity/    # WiFi, networking modules
├── Core/            # Core OS headers and utilities
├── Firmware/        # Firmware entry point and initialization
├── HalModule/       # Hardware Abstraction Layer
├── Kernel/          # Kernel services (tasks, memory, logging)
├── Profiles/        # Board/device profiles (YAML + generated config)
├── Services/        # System services
├── System/          # System-level modules (drivers, buses)
├── UI/              # LVGL UI framework, themes
├── flxos.py         # Main CLI build tool
└── CMakeLists.txt   # Top-level CMake project file`}</code></pre>
                    </div>
                </section>

                {/* Core Modules */}
                <section id="modules" className="doc-section">
                    <h2><i className="fas fa-puzzle-piece"></i> Core Modules</h2>

                    <div className="module-grid">
                        <div className="module-card">
                            <h4>Hardware Abstraction Layer (HAL)</h4>
                            <p>Centralized hardware abstraction interface and implementations for optimal performance.
                            </p>
                            <code>{`HalModule/`}</code>
                        </div>
                        <div className="module-card">
                            <h4>UI and Apps Framework</h4>
                            <p>Application base classes, lifecycle management, and LVGL UI elements.</p>
                            <code>{`UI/ & Apps/`}</code>
                        </div>
                        <div className="module-card">
                            <h4>Connectivity</h4>
                            <p>Wi-Fi management, network protocols, and IoT capabilities.</p>
                            <code>{`Connectivity/`}</code>
                        </div>
                        <div className="module-card">
                            <h4>Applications</h4>
                            <p>Built-in apps: Calendar, Files, Image Viewer, Text Editor, Settings, System Info, and
                                more.</p>
                            <code>{`Applications/`}</code>
                        </div>
                    </div>
                </section>

                {/* Building */}
                <section id="building" className="doc-section">
                    <h2><i className="fas fa-hammer"></i> Building</h2>

                    <div className="warning-box">
                        <i className="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>Important:</strong> Always select a profile using
                            <code>{`python flxos.py select <id>`}</code> before building.
                        </div>
                    </div>

                    <h3>Build Commands</h3>
                    <div className="code-block-wrapper">
                        <pre><code className="language-bash">{`# Standard build
python flxos.py build

# Dev build with faster iterations
python flxos.py build --dev

# Flash and connect monitor
python flxos.py flash --port /dev/ttyUSB0`}</code></pre>
                    </div>
                </section>

                {/* Configuration */}
                <section id="configuration" className="doc-section">
                    <h2><i className="fas fa-cog"></i> Configuration</h2>
                    <p>FlxOS uses a YAML profile system instead of traditional menuconfig for platform definitions.</p>

                    <div className="code-block-wrapper">
                        <pre><code className="language-bash">{`python flxos.py list
python flxos.py diff a b --json`}</code></pre>
                    </div>

                    <h3>Key Profile Definitions (profile.yaml)</h3>
                    <ul>
                        <li><strong>SoC Target:</strong> Chip sequence and flash sizing.</li>
                        <li><strong>Display Driver:</strong> TFT resolution, backend type, SPI pins.</li>
                        <li><strong>Touch Controller:</strong> XPT2046, FT6336, GT911 mappings.</li>
                        <li><strong>Peripherals:</strong> SD card interfaces and Battery ADC defaults.</li>
                    </ul>
                </section>

                {/* Creating Apps */}
                <section id="apps" className="doc-section">
                    <h2><i className="fas fa-plus-circle"></i> Creating Apps</h2>
                    <p>FlxOS apps follow a simple pattern. Here's a minimal example:</p>

                    <div className="code-block-wrapper">
                        <div className="code-header">
                            <span>MyApp.hpp</span>
                        </div>
                        <pre><code className="language-cpp">{`#pragma once
#include "App.hpp"

class MyApp : public App {
public:
    MyApp() : App("MyApp", "My Application") {}
    
    void onCreate() override {
        // Initialize your app UI
        lv_obj_t* label = lv_label_create(getContainer());
        lv_label_set_text(label, "Hello, FlxOS!");
    }
    
    void onResume() override {
        // App brought to foreground
    }
    
    void onPause() override {
        // App sent to background
    }
};`}</code></pre>
                    </div>
                </section>

                {/* API Reference */}
                <section id="api" className="doc-section">
                    <h2><i className="fas fa-code"></i> API Reference</h2>
                    <p>Complete API documentation coming soon. For now, refer to the source code in
                        <code>{`Core/`}</code> and <code>{`UI/`}</code>.
                    </p>

                    <div className="api-links">
                        <a href="https://github.com/flxos-labs/flxos/tree/main/Core" target="_blank"
                            rel="noopener noreferrer" className="api-link">
                            <i className="fab fa-github"></i>
                            <span>Browse Source Code</span>
                        </a>
                    </div>
                </section>

                {/* Troubleshooting */}
                <section id="troubleshooting" className="doc-section">
                    <h2><i className="fas fa-wrench"></i> Troubleshooting</h2>

                    <div className="faq-item">
                        <h4>Build fails with "Target Not Set"</h4>
                        <p>Ensure you've run <code>{`python flxos.py select <profile>`}</code> before building.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Display shows garbage or doesn't work</h4>
                        <p>Check the <code>{`profile.yaml`}</code> for your selected configuration. Verify pin connections
                            match your hardware pinout.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Touch not responding</h4>
                        <p>Ensure touch controller is correctly mapped in the hardware definitions inside the active
                            profile.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Wi-Fi won't connect</h4>
                        <p>Verify SSID and password in menuconfig. Check that your router supports 2.4GHz (ESP32 doesn't
                            support 5GHz).</p>
                    </div>

                    <div className="help-box">
                        <h4>Need More Help?</h4>
                        <p>Can't find what you're looking for? Check out these resources:</p>
                        <a href="https://github.com/flxos-labs/flxos/issues" target="_blank" rel="noopener noreferrer"
                            className="btn btn-secondary">
                            <i className="fab fa-github"></i>
                            <span>Report an Issue</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    
    </>
  );
}
