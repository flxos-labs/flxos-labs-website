document.addEventListener('DOMContentLoaded', () => {
    const hasScrollTimeline = CSS.supports('animation-timeline', 'view()');

    // ── Scroll Progress Bar ──────────────────────────────────────────────
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ── Device Mockup Parallax ───────────────────────────────────────────
    const heroDevice = document.getElementById('hero-device');
    if (heroDevice && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const deviceFrame = heroDevice.querySelector('.device-frame');
        document.addEventListener('mousemove', (e) => {
            const { innerWidth: W, innerHeight: H } = window;
            const x = (e.clientX / W - 0.5) * 2; // -1 to 1
            const y = (e.clientY / H - 0.5) * 2;
            if (deviceFrame) {
                if (heroDevice.matches(':hover')) {
                    deviceFrame.style.transform = '';
                } else {
                    deviceFrame.style.transform =
                        `rotateY(${-5 + x * 8}deg) rotateX(${3 - y * 5}deg)`;
                }
            }
        }, { passive: true });
        heroDevice.addEventListener('mouseleave', () => {
            if (deviceFrame) {
                deviceFrame.style.transform = '';
            }
        });
    }

    // Current Year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Load saved theme or use system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    // Mobile Menu Toggle with enhanced accessibility
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuBackdrop = document.getElementById('menuBackdrop');

    function openMobileMenu() {
        navLinks.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.classList.add('menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (menuBackdrop) {
            menuBackdrop.removeAttribute('aria-hidden');
            menuBackdrop.setAttribute('aria-hidden', 'false');
        }
        const firstLink = navLinks.querySelector('a');
        if (firstLink) setTimeout(() => firstLink.focus(), 100);
    }

    function closeMobileMenu(returnFocus) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (menuBackdrop) menuBackdrop.setAttribute('aria-hidden', 'true');
        if (returnFocus) mobileMenuBtn.focus();
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMobileMenu(false);
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking backdrop
        if (menuBackdrop) {
            menuBackdrop.addEventListener('click', () => closeMobileMenu(false));
        }

        // Close menu when clicking outside (desktop fallback)
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && e.target !== menuBackdrop) {
                closeMobileMenu(false);
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMobileMenu(false));
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu(true);
            }
        });
    }

    // GitHub Stats and Release info
    fetchGitHubStats();
    fetchLatestRelease();

    async function fetchLatestRelease() {
        try {
            const response = await fetch('https://api.github.com/repos/flxos-labs/flxos/releases/latest');
            // 404 simply means no releases yet — stay silent and keep the badge hidden
            if (response.status === 404) return;
            if (response.ok) {
                const data = await response.json();
                const releaseEl = document.getElementById('latest-release');
                if (releaseEl && data.tag_name) {
                    releaseEl.textContent = `Latest: ${data.tag_name}`;
                    releaseEl.style.display = 'inline-block';
                }
            }
        } catch (error) {
            // Network error — fail silently, badge stays hidden
        }
    }

    async function fetchGitHubStats(retries = 3) {
        // Try to load from cache first
        const cached = loadCachedStats();
        if (cached) {
            displayStats(cached);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch('https://api.github.com/repos/flxos-labs/flxos', {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const stats = {
                stars: data.stargazers_count,
                forks: data.forks_count,
                watchers: data.watchers_count,
                timestamp: Date.now()
            };

            // Cache the stats
            try {
                localStorage.setItem('flxos_github_stats', JSON.stringify(stats));
            } catch (e) { /* ignore storage errors */ }

            displayStats(stats);
        } catch (error) {
            console.warn('GitHub API fetch failed:', error.message);

            // Retry logic
            if (retries > 0 && error.name !== 'AbortError') {
                setTimeout(() => fetchGitHubStats(retries - 1), 2000);
            } else if (!cached) {
                // If no cached data either, show dashes gracefully
                displayStats(null);
            }
        }
    }

    function loadCachedStats() {
        try {
            const cached = localStorage.getItem('flxos_github_stats');
            if (cached) {
                const data = JSON.parse(cached);
                // Cache valid for 1 hour
                if (Date.now() - data.timestamp < 3600000) {
                    return data;
                }
            }
        } catch (e) { /* ignore */ }
        return null;
    }

    function displayStats(stats) {
        const starsElement = document.getElementById('github-stars');
        const forksElement = document.getElementById('github-forks');
        const watchersElement = document.getElementById('github-watchers');

        // Clear any skeleton placeholders first
        [starsElement, forksElement, watchersElement].forEach(el => {
            if (el) {
                const skeleton = el.querySelector('.stat-skeleton');
                if (skeleton) skeleton.remove();
            }
        });

        if (stats) {
            if (starsElement) animateCounter(starsElement, stats.stars);
            if (forksElement) animateCounter(forksElement, stats.forks);
            if (watchersElement) animateCounter(watchersElement, stats.watchers);
        } else {
            if (starsElement) starsElement.textContent = '—';
            if (forksElement) forksElement.textContent = '—';
            if (watchersElement) watchersElement.textContent = '—';
        }
    }

    function animateCounter(element, target) {
        if (target === undefined || target === null) {
            element.textContent = '—';
            return;
        }

        // Spring-physics easing: fast start, smooth deceleration
        const duration = 1400;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(progress);
            const current = Math.round(eased * target);
            element.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    // Copy Code functionality
    const copyBtn = document.getElementById('copyBtn');
    const installCode = document.getElementById('installCode');

    if (copyBtn && installCode) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(installCode.innerText);

                // Visual feedback
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.color = '#4ade80';

                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    }

    // Navbar Scroll Effect with passive listener
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-links');
                if (window.innerWidth <= 768) {
                    mobileMenu.style.display = '';
                }

                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cursor Glow Effect - Only on desktop with fine pointer
    const cursorGlow = document.querySelector('.cursor-glow');

    // Check if device has fine pointer (mouse) capability
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursorGlow && hasFinePointer) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursorGlow.style.top = `${cursorY}px`;
            cursorGlow.style.left = `${cursorX}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    if (!hasScrollTimeline) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe feature cards, tech items, roadmap items for scroll animation
        document.querySelectorAll('.feature-card, .tech-item, .roadmap-item, .community-card').forEach(el => {
            el.classList.add('animate-target');
            observer.observe(el);
        });
    }

    // ────────────────────────────────────────────────
    // Terminal Typing Animation
    // ────────────────────────────────────────────────
    const terminalDemos = {
        hero: [
            { type: 'command', text: '$ git clone --recurse-submodules https://github.com/flxos-labs/flxos.git' },
            { type: 'command', text: '$ cd flxos' },
            { type: 'command', text: '$ python flxos.py select esp32s3-ili9341' },
            { type: 'command', text: '$ python flxos.py build' },
            { type: 'output', text: "Selecting profile 'esp32s3-ili9341'..." },
            { type: 'output', text: 'Generating hardware initialization code...' },
            { type: 'success', text: 'Build completed successfully.' },
            { type: 'highlight', text: 'FlxOS ready for flashing!' }
        ],
        'build-story': [
            { type: 'command', text: '$ git clone --recurse-submodules https://github.com/flxos-labs/flxos.git' },
            { type: 'command', text: '$ cd flxos' },
            { type: 'command', text: '$ python flxos.py select esp32s3-ili9341-xpt' },
            { type: 'output', text: "Profile 'esp32s3-ili9341-xpt' selected." },
            { type: 'command', text: '$ python flxos.py build' },
            { type: 'output', text: 'Resolving dependencies and generating hardware init...' },
            { type: 'success', text: 'Build complete.' },
            { type: 'highlight', text: 'FlxOS ready for flashing!' }
        ]
    };

    document.querySelectorAll('.window-content[data-terminal-demo]').forEach((terminalEl) => {
        const demoName = terminalEl.getAttribute('data-terminal-demo');
        const lines = terminalDemos[demoName];
        if (lines) initTerminalTyping(terminalEl, lines);
    });

    function initTerminalTyping(container, lines) {

        // Clear existing content
        container.innerHTML = '';

        // Use IntersectionObserver to start animation when visible
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeLines(container, lines, 0);
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        terminalObserver.observe(container);
    }

    function typeLines(container, lines, index) {
        if (index >= lines.length) {
            // Add blinking cursor at the end
            const cursorEl = document.createElement('div');
            cursorEl.className = 'cursor';
            container.appendChild(cursorEl);
            return;
        }

        const line = lines[index];
        const lineEl = document.createElement('div');
        lineEl.className = 'code-line';

        if (line.type === 'command') {
            lineEl.classList.add('typing-line');
            // Split prompt from command text
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = '$';
            lineEl.appendChild(promptSpan);

            const textSpan = document.createElement('span');
            textSpan.className = 'typed-text';
            lineEl.appendChild(textSpan);

            container.appendChild(lineEl);

            // Type out the command text (without the "$ " prefix)
            const cmdText = line.text.substring(2);
            typeText(textSpan, cmdText, 0, () => {
                lineEl.classList.remove('typing-line');
                setTimeout(() => typeLines(container, lines, index + 1), 300);
            });
        } else {
            // Output lines appear instantly with fade
            if (line.type === 'output') {
                lineEl.classList.add('output');
            } else if (line.type === 'success') {
                lineEl.classList.add('output', 'success');
            } else if (line.type === 'highlight') {
                lineEl.classList.add('output', 'success', 'highlight');
            }
            lineEl.textContent = line.text;
            lineEl.style.opacity = '0';
            lineEl.style.transform = 'translateY(5px)';
            container.appendChild(lineEl);

            requestAnimationFrame(() => {
                lineEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                lineEl.style.opacity = '1';
                lineEl.style.transform = 'translateY(0)';
            });

            setTimeout(() => typeLines(container, lines, index + 1), 200);
        }
    }

    function typeText(element, text, charIndex, callback) {
        if (charIndex >= text.length) {
            callback();
            return;
        }
        element.textContent += text[charIndex];
        // Vary the typing speed slightly for realism
        const baseSpeed = 25;
        const variance = Math.random() * 20 - 10;
        setTimeout(() => typeText(element, text, charIndex + 1, callback), baseSpeed + variance);
    }

    // ────────────────────────────────────────────────
    // Particle Background for Hero
    // ────────────────────────────────────────────────
    const heroSection = document.querySelector('.hero');
    if (heroSection && hasFinePointer) {
        initParticles(heroSection);
    }

    function initParticles(container) {
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resize() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize, { passive: true });

        // Create particles
        const particleCount = Math.min(60, Math.floor(canvas.width / 25));
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const opacity = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw and update particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if ((p.x < 0 && p.vx < 0) || (p.x > canvas.width && p.vx > 0)) p.vx *= -1;
                if ((p.y < 0 && p.vy < 0) || (p.y > canvas.height && p.vy > 0)) p.vy *= -1;
            });

            animId = requestAnimationFrame(drawParticles);
        }

        // Only run when visible
        const particleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    drawParticles();
                } else {
                    cancelAnimationFrame(animId);
                }
            });
        });

        particleObserver.observe(container);
    }

    // Newsletter Subscription
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterForm && newsletterMessage) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const button = newsletterForm.querySelector('button');
            const email = input.value.trim();

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                input.style.borderColor = '#ef4444';
                setTimeout(() => input.style.borderColor = '', 2000);
                return;
            }

            // Show loading state
            const originalButtonText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            input.disabled = true;

            try {
                // Formspree Form ID: xqeynadn
                const FORMSPREE_ID = 'xqeynadn';

                const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        _subject: 'New Newsletter Subscription'
                    })
                });

                if (!response.ok) {
                    throw new Error('Subscription failed or Form ID is invalid');
                }

                // Final UI state
                newsletterForm.style.display = 'none';
                newsletterMessage.style.display = 'flex';
                newsletterMessage.classList.add('animate-in');
                setTimeout(launchConfetti, 600);

                console.log('Successfully subscribed');
            } catch (error) {
                console.error('Subscription failed:', error);
                button.disabled = false;
                button.innerHTML = originalButtonText;
                input.disabled = false;

                // Show visible error message
                const errorEl = document.getElementById('newsletter-error');
                if (errorEl) {
                    errorEl.style.display = 'flex';
                    setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
                }
            }
        });
    }

    // Scroll to Top Functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add dynamic stylesheet for animations
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-target {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Stagger children */
        .features-grid .animate-in:nth-child(1) { transition-delay: 0s; }
        .features-grid .animate-in:nth-child(2) { transition-delay: 0.1s; }
        .features-grid .animate-in:nth-child(3) { transition-delay: 0.2s; }
        .features-grid .animate-in:nth-child(4) { transition-delay: 0.3s; }
        .features-grid .animate-in:nth-child(5) { transition-delay: 0.4s; }
        .features-grid .animate-in:nth-child(6) { transition-delay: 0.5s; }

        .typing-line .typed-text::after {
            content: '▋';
            animation: blink 0.7s step-end infinite;
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(styleSheet);

    const featuredImg = document.querySelector('.gallery-featured .gf-frame img');
    const featuredTitle = document.querySelector('.gallery-featured-title');
    const featuredDescription = document.querySelector('.gallery-featured-text p');
    const galleryCopy = {
        'Home Screen': 'Dock, status bar, dynamic wallpaper and live widgets all working together in the main FlxOS experience.',
        'App Launcher': 'A compact launcher for browsing apps quickly with a touch-friendly layout built for embedded hardware.',
        'Files App': 'A lightweight file browser for navigating storage, opening assets, and managing content directly on the device.',
        'Settings App': 'System preferences for adjusting behavior, visuals, and device options from a clean native control panel.',
        'Calendar App': 'A focused calendar screen that keeps scheduling readable and fast on a small touchscreen.',
        'Notification Panel': 'A dedicated panel for reviewing alerts and updates without interrupting the rest of the interface.',
        'Quick Access': 'Fast toggles and shortcuts for common actions, giving users an easy control center from anywhere.',
        'System Info (Material)': 'System metrics and device details presented with a bright material-inspired visual treatment.',
        'System Info (Dark)': 'The same live system overview adapted to a darker UI theme for a more contrast-heavy look.',
        'Tiling Layout': 'Multiple apps arranged together to show FlxOS handling dynamic tiled layouts on constrained hardware.',
        'Text Editor': 'An editable text workspace paired with an on-screen keyboard for direct input on the device.',
        'Tools App': 'A utility hub that groups device tools and diagnostics into one practical launcher screen.',
        'Floating Notification': 'Transient notifications appear above the interface to surface updates without taking over the screen.',
        'Image Viewer + Files': 'An image viewer opened side by side with the file browser to demonstrate smooth multi-window workflows.',
        'Text Editor + Files': 'Text editing and file browsing working together in split view for a more desktop-like multitasking setup.'
    };

    function updateFeaturedFromSlide(slides, slide) {
        if (!featuredImg || !slide) return;
        const img = slide.querySelector('img');
        const title = slide.getAttribute('data-title') || img?.alt || 'System Screen';
        if (!img) return;

        featuredImg.src = img.currentSrc || img.src;
        featuredImg.alt = img.alt;
        if (featuredTitle) featuredTitle.textContent = title;
        if (featuredDescription) {
            featuredDescription.textContent = galleryCopy[title] || img.alt || '';
        }

        slides.forEach((item) => item.classList.toggle('active', item === slide));
    }

    // ────────────────────────────────────────────────
    // Phase 3B — Gallery Carousel
    // ────────────────────────────────────────────────
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (galleryTrack) {
        const slides = Array.from(galleryTrack.querySelectorAll('.carousel-slide'));
        const totalSlides = slides.length;
        const visibleSlides = () => Math.max(1, Math.floor(galleryTrack.parentElement.clientWidth / 220));
        const maxOffset = () => Math.max(0, totalSlides - visibleSlides());
        let currentSlide = 0;

        // Build pagination dots — one per reachable scroll position.
        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const positions = Math.max(1, totalSlides - visibleSlides() + 1);
            for (let i = 0; i < positions; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Go to gallery position ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        buildDots();

        function updateDots(idx) {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === idx);
            });
        }

        function goToSlide(idx) {
            const slideWidth = 220; // 200px + 20px gap
            currentSlide = Math.max(0, Math.min(idx, maxOffset()));
            galleryTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            updateDots(currentSlide);
        }

        galleryPrev?.addEventListener('click', () => goToSlide(currentSlide - 1));
        galleryNext?.addEventListener('click', () => goToSlide(currentSlide + 1));

        if (slides.length > 0) {
            updateFeaturedFromSlide(slides, slides[0]);
        }

        // Click slide → update the featured screenshot and its context copy
        slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                updateFeaturedFromSlide(slides, slide);
            });
        });

        // Keyboard carousel navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
        });

        // Resize handler — rebuild dots and re-clamp position
        window.addEventListener('resize', () => {
            buildDots();
            goToSlide(currentSlide);
        }, { passive: true });

        // ── Phase 5A — Touch Swipe for Gallery Carousel ──
        const carouselOuterEl = galleryTrack.closest('.carousel-track-outer');
        if (carouselOuterEl) {
            let touchStartX = 0;
            let touchStartY = 0;

            carouselOuterEl.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            carouselOuterEl.addEventListener('touchend', (e) => {
                const dx = e.changedTouches[0].clientX - touchStartX;
                const dy = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
                    if (dx < 0) goToSlide(currentSlide + 1);
                    else goToSlide(currentSlide - 1);
                }
            }, { passive: true });
        }
    }

    // ────────────────────────────────────────────────
    // Phase 3E — Community Star + Contributor Avatars
    // ────────────────────────────────────────────────
    const communityStars = document.getElementById('community-stars');
    if (communityStars) {
        // Use the cached stats we already have
        const cached = loadCachedStats();
        if (cached && cached.stars != null) {
            animateCounter(communityStars, cached.stars);
        } else {
            // Fallback: wait 2s then try
            setTimeout(() => {
                const c2 = loadCachedStats();
                if (c2 && c2.stars != null) animateCounter(communityStars, c2.stars);
                else communityStars.textContent = '★';
            }, 2500);
        }
    }

    // Fetch contributor avatars
    const avatarContainer = document.getElementById('contributorAvatars');
    if (avatarContainer) {
        fetchContributors();
    }

    async function fetchContributors() {
        try {
            const res = await fetch('https://api.github.com/repos/flxos-labs/flxos/contributors?per_page=8');
            if (!res.ok) return;
            const contributors = await res.json();
            if (!Array.isArray(contributors) || contributors.length === 0) return;

            avatarContainer.innerHTML = '';
            contributors.slice(0, 8).forEach(c => {
                const div = document.createElement('a');
                div.className = 'contributor-avatar';
                div.href = c.html_url;
                div.target = '_blank';
                div.rel = 'noopener noreferrer';
                div.setAttribute('aria-label', c.login);
                div.title = c.login;

                const img = document.createElement('img');
                img.src = c.avatar_url + '&s=80';
                img.alt = c.login;
                img.loading = 'lazy';
                div.appendChild(img);
                avatarContainer.appendChild(div);
            });
        } catch (e) {
            console.warn('Failed to fetch contributors:', e);
        }
    }

    // ────────────────────────────────────────────────
    // Phase 3F — Step-by-Step Get Started
    // ────────────────────────────────────────────────
    const stepButtons = document.querySelectorAll('.step-indicator');
    const stepPanels = document.querySelectorAll('.step-panel');
    const stepCopyBtns = document.querySelectorAll('.copy-btn[data-step]');

    if (stepButtons.length > 0) {
        stepButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const stepIdx = parseInt(btn.getAttribute('data-step'));
                // Deactivate all
                stepButtons.forEach(b => b.classList.remove('active'));
                stepPanels.forEach(p => p.classList.remove('active'));
                // Activate clicked
                btn.classList.add('active');
                const panel = document.getElementById(`step-panel-${stepIdx}`);
                if (panel) panel.classList.add('active');
                // Re-run Prism highlighting if available
                if (window.Prism) Prism.highlightElement(panel.querySelector('code'));
            });
        });
    }

    // Per-step copy buttons
    stepCopyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const stepIdx = btn.getAttribute('data-step');
            const codeEl = document.querySelector(`#step-panel-${stepIdx} .step-code`);
            if (!codeEl) return;
            try {
                await navigator.clipboard.writeText(codeEl.innerText.trim());
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = '#4ade80';
                setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
            } catch (e) { /* clipboard denied */ }
        });
    });

    // ────────────────────────────────────────────────
    // Phase 3G — Confetti on Newsletter Success
    // ────────────────────────────────────────────────
    function launchConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#fbbf24', '#34d399', '#f87171'];
        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: Math.random() * 12 + 6,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 4 + 2,
            vr: (Math.random() - 0.5) * 0.2
        }));

        let rafId;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vr;
                if (p.y < canvas.height + 20) alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            if (alive) rafId = requestAnimationFrame(draw);
            else { canvas.style.display = 'none'; }
        }
        draw();
        setTimeout(() => { cancelAnimationFrame(rafId); canvas.style.display = 'none'; }, 5000);
    }

    // ────────────────────────────────────────────────
    // Phase 4A — Scroll-Reveal (section headers, bento, roadmap, community)
    // ────────────────────────────────────────────────
    let revealObserver;
    if (!hasScrollTimeline) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });

        const bentoGrid = document.querySelector('.bento-grid');
        if (bentoGrid) {
            bentoGrid.classList.add('reveal-stagger');
            bentoGrid.querySelectorAll('.bento-card').forEach((card, i) => {
                card.classList.add('reveal');
                card.style.transitionDelay = `${i * 0.07}s`;
                revealObserver.observe(card);
            });
        }

        document.querySelectorAll('.roadmap-h-item').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
            revealObserver.observe(el);
        });

        document.querySelectorAll('.community-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
            revealObserver.observe(el);
        });

        const communityHero = document.querySelector('.community-hero');
        if (communityHero) {
            communityHero.classList.add('reveal');
            revealObserver.observe(communityHero);
        }

        document.querySelectorAll('.tech-logo-item').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
            revealObserver.observe(el);
        });

        const galleryFeatured = document.querySelector('.gallery-featured');
        if (galleryFeatured) {
            galleryFeatured.classList.add('reveal');
            revealObserver.observe(galleryFeatured);
        }

        document.querySelectorAll('.carousel-slide').forEach((el, i) => {
            el.classList.add('reveal-scale');
            el.style.transitionDelay = `${i * 0.04}s`;
            revealObserver.observe(el);
        });
    }

    // ────────────────────────────────────────────────
    // Phase 4B — Card 3D Tilt (pointer: fine only)
    // ────────────────────────────────────────────────
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasFinePointer && !reducedMotion) {
        document.querySelectorAll('.bento-card, .community-card, .stat-item').forEach(card => {
            card.classList.add('tilt-card');

            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                const rotX = dy * -6; // degrees
                const rotY = dx * 8;
                card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
            }, { passive: true });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ── Phase 5: Bento Card Spotlight Glow (cursor-tracking radial gradient) ──
    if (hasFinePointer) {
        document.querySelectorAll('.bento-card, .philosophy-card').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--glow-x', `${x}%`);
                card.style.setProperty('--glow-y', `${y}%`);
            }, { passive: true });
        });
    }

    // About page hero parallax + timeline progress
    const aboutHeroCopy = document.getElementById('aboutHeroCopy');
    const aboutTimeline = document.getElementById('aboutTimeline');
    if ((aboutHeroCopy || aboutTimeline) && !reducedMotion) {
        const updateAboutMotion = () => {
            if (aboutHeroCopy) {
                const rect = aboutHeroCopy.getBoundingClientRect();
                const offset = Math.max(-18, Math.min(18, rect.top * -0.04));
                aboutHeroCopy.style.transform = `translateY(${offset}px)`;
            }

            if (aboutTimeline && !hasScrollTimeline) {
                const rect = aboutTimeline.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const start = viewportHeight * 0.85;
                const end = viewportHeight * 0.2;
                const progress = (start - rect.top) / Math.max(1, start - end);
                const clamped = Math.max(0, Math.min(progress, 1));
                aboutTimeline.style.setProperty('--timeline-progress', clamped.toFixed(3));
            }
        };

        window.addEventListener('scroll', updateAboutMotion, { passive: true });
        window.addEventListener('resize', updateAboutMotion, { passive: true });
        updateAboutMotion();
    }

    // About page founder activity
    const founderCommitCount = document.getElementById('founderCommitCount');
    const founderRepoCount = document.getElementById('founderRepoCount');
    const founderFollowerCount = document.getElementById('founderFollowerCount');
    if (founderCommitCount || founderRepoCount || founderFollowerCount) {
        fetchFounderStats();
    }

    async function fetchFounderStats() {
        try {
            const [userRes, contributorsRes] = await Promise.all([
                fetch('https://api.github.com/users/Itsmeakash248'),
                fetch('https://api.github.com/repos/flxos-labs/flxos/contributors?per_page=100')
            ]);

            if (userRes.ok) {
                const user = await userRes.json();
                if (founderRepoCount && user.public_repos != null) {
                    founderRepoCount.textContent = user.public_repos;
                }
                if (founderFollowerCount && user.followers != null) {
                    founderFollowerCount.textContent = user.followers;
                }
            }

            if (contributorsRes.ok) {
                const contributors = await contributorsRes.json();
                if (Array.isArray(contributors)) {
                    const founder = contributors.find((entry) => entry.login === 'Itsmeakash248');
                    if (founderCommitCount && founder?.contributions != null) {
                        founderCommitCount.textContent = founder.contributions;
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to fetch founder stats:', error);
        }
    }

    // ────────────────────────────────────────────────
    // Phase 4C — Magnetic Button Pull Effect
    // ────────────────────────────────────────────────
    if (hasFinePointer && !reducedMotion) {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('pointermove', (e) => {
                const rect = btn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.25;
                const dy = (e.clientY - cy) * 0.25;
                btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
            }, { passive: true });

            btn.addEventListener('pointerleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ────────────────────────────────────────────────
    // Phase 4E — Nav Active Section Indicator
    // ────────────────────────────────────────────────
    const sectionNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');

    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    sectionNavLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${id}`) {
                            link.classList.add('section-active');
                        } else {
                            link.classList.remove('section-active');
                        }
                    });
                }
            });
        }, { threshold: 0.35, rootMargin: '-60px 0px -35% 0px' });

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // ────────────────────────────────────────────────
    // Phase 4F — Page-Load Content Cascade
    // ────────────────────────────────────────────────
    if (!reducedMotion) {
        document.body.classList.add('page-loading');
        // Trigger cascade after a short frame delay
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.classList.remove('page-loading');
                document.body.classList.add('page-ready');
            });
        });
    }

    // ── Phase 5A touch swipe is now inside the galleryTrack block (see above) ──
    // ── Phase 5D — Frosted Glass Menu Backdrop: click-to-close is handled    ──
    // ── by the canonical menuBackdrop listener registered in the mobile nav  ──
    // ── setup block above (closeMobileMenu). No second listener needed here. ──

    // ────────────────────────────────────────────────
    // Phase 5E — Swipe-Down to Close Mobile Menu
    // ────────────────────────────────────────────────
    const navLinksSheet = document.querySelector('.nav-links');
    if (navLinksSheet) {
        let sheetTouchStartY = 0;

        navLinksSheet.addEventListener('touchstart', (e) => {
            sheetTouchStartY = e.touches[0].clientY;
        }, { passive: true });

        navLinksSheet.addEventListener('touchend', (e) => {
            const dy = e.changedTouches[0].clientY - sheetTouchStartY;
            // Swipe down > 70px closes the menu
            if (dy > 70 && navLinksSheet.classList.contains('active')) {
                navLinksSheet.classList.remove('active');
                document.querySelector('.mobile-menu-btn')?.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.querySelector('.mobile-menu-btn')?.setAttribute('aria-expanded', 'false');
            }
        }, { passive: true });
    }

    // ────────────────────────────────────────────────
    // TRILLION-DOLLAR — Platform Cycler
    // ────────────────────────────────────────────────
    const platformWord = document.getElementById('platform-word');
    if (platformWord && !reducedMotion) {
        const platforms = ['ESP32', 'ESP32-S3', 'ESP32-P4', 'ESP32-C6', 'Linux', 'macOS', 'Windows'];
        let pIdx = 0;
        setInterval(() => {
            platformWord.classList.add('fade-out');
            setTimeout(() => {
                pIdx = (pIdx + 1) % platforms.length;
                platformWord.textContent = platforms[pIdx];
                platformWord.classList.remove('fade-out');
            }, 260);
        }, 2200);
    }

    // ────────────────────────────────────────────────
    // TRILLION-DOLLAR — Hero Device Slideshow
    // ────────────────────────────────────────────────
    const heroDeviceScreen = document.getElementById('heroDeviceScreen');
    if (heroDeviceScreen && !reducedMotion) {
        const slideImgs = heroDeviceScreen.querySelectorAll('.slide-img');
        if (slideImgs.length > 1) {
            let hIdx = 0;
            setInterval(() => {
                slideImgs[hIdx].classList.remove('active');
                hIdx = (hIdx + 1) % slideImgs.length;
                slideImgs[hIdx].classList.add('active');
            }, 3500);
        }
    }

    // ────────────────────────────────────────────────
    // TRILLION-DOLLAR — Command Palette
    // ────────────────────────────────────────────────
    const cmdPalette = document.getElementById('cmd-palette');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResultsEl = document.getElementById('cmd-results');
    const cmdOverlay = document.getElementById('cmdOverlay');

    const cmdItems = [
        { label: 'Home', sub: 'Back to top', icon: 'fa-home', href: '#' },
        { label: 'Features', sub: 'Advanced capabilities', icon: 'fa-layer-group', href: '#features' },
        { label: 'Why FlxOS?', sub: 'The difference vs. traditional stacks', icon: 'fa-balance-scale', href: '#why-flxos' },
        { label: 'Gallery', sub: 'System screenshots', icon: 'fa-images', href: '#screenshots' },
        { label: 'On Real Hardware', sub: 'Lilygo T-HMI device photos', icon: 'fa-microchip', href: '#hardware' },
        { label: 'Tech Stack', sub: 'ESP-IDF, LVGL, Python, CMake', icon: 'fa-code', href: '#tech-stack' },
        { label: 'Roadmap', sub: 'v1→v2: Embedded to Desktop', icon: 'fa-map', href: '#roadmap' },
        { label: 'Community', sub: 'GitHub, contributors, get involved', icon: 'fa-users', href: '#community' },
        { label: 'Community Love', sub: 'What people say about FlxOS', icon: 'fa-heart', href: '#testimonials' },
        { label: 'Get Started', sub: 'Clone, build, flash in 4 steps', icon: 'fa-terminal', href: '#get-started' },
        { label: 'Zero to Running', sub: 'Animated CLI build flow', icon: 'fa-laptop-code', href: '#build-story' },
        { label: 'Newsletter', sub: 'Stay in the loop', icon: 'fa-envelope', href: '#newsletter' },
        { label: 'Documentation', sub: 'Full API reference', icon: 'fa-book', href: '/docs' },
        { label: 'About FlxOS Labs', sub: 'Our story and mission', icon: 'fa-info-circle', href: '/about' },
        { label: 'GitHub Repository', sub: 'View source, star, contribute', icon: 'fa-github', href: 'https://github.com/flxos-labs/flxos', external: true },
    ];

    let cmdActiveIdx = -1;

    function openCmdPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.add('open');
        cmdPalette.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (cmdInput) { cmdInput.value = ''; setTimeout(() => cmdInput.focus(), 40); }
        renderCmdResults('');
        cmdActiveIdx = -1;
    }

    function closeCmdPalette() {
        if (!cmdPalette) return;
        cmdPalette.classList.remove('open');
        cmdPalette.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function renderCmdResults(query) {
        if (!cmdResultsEl) return;
        const q = query.trim().toLowerCase();
        const filtered = q
            ? cmdItems.filter(it => it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q))
            : cmdItems;
        cmdResultsEl.innerHTML = '';
        cmdActiveIdx = -1;
        filtered.forEach(item => {
            const el = document.createElement('a');
            el.className = 'cmd-result-item';
            el.setAttribute('role', 'option');
            el.href = item.href;
            if (item.external) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
            el.innerHTML = `<i class="fas ${item.icon}"></i><span class="cmd-result-label">${item.label}</span><span class="cmd-result-sub">${item.sub}</span>`;
            el.addEventListener('click', closeCmdPalette);
            cmdResultsEl.appendChild(el);
        });
    }

    function setCmdActive(idx) {
        const items = cmdResultsEl ? cmdResultsEl.querySelectorAll('.cmd-result-item') : [];
        items.forEach((el, i) => el.classList.toggle('cmd-active', i === idx));
        if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
        cmdActiveIdx = idx;
    }

    if (cmdPalette) {
        document.addEventListener('keydown', (e) => {
            const tag = document.activeElement?.tagName;
            const inInput = tag === 'INPUT' || tag === 'TEXTAREA';
            // Open with Ctrl+K / Cmd+K or plain K when not in input
            if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey || !inInput)) {
                if (e.metaKey || e.ctrlKey || !inInput) {
                    e.preventDefault();
                    cmdPalette.classList.contains('open') ? closeCmdPalette() : openCmdPalette();
                    return;
                }
            }
            if (!cmdPalette.classList.contains('open')) return;
            const items = cmdResultsEl ? cmdResultsEl.querySelectorAll('.cmd-result-item') : [];
            if (e.key === 'Escape') { closeCmdPalette(); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); setCmdActive(Math.min(cmdActiveIdx + 1, items.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setCmdActive(Math.max(cmdActiveIdx - 1, 0)); }
            else if (e.key === 'Enter' && cmdActiveIdx >= 0) { items[cmdActiveIdx]?.click(); }
        });
        if (cmdInput) cmdInput.addEventListener('input', () => renderCmdResults(cmdInput.value));
        if (cmdOverlay) cmdOverlay.addEventListener('click', closeCmdPalette);
    }

    // ────────────────────────────────────────────────
    // TRILLION-DOLLAR — Reveal observers for new sections
    // ────────────────────────────────────────────────
    if (revealObserver) {
        document.querySelectorAll(
            '.hw-photo-card, .testimonial-card, .why-statement, .compare-col, .founder-card, .build-story-shell'
        ).forEach(el => revealObserver.observe(el));
    }

});
