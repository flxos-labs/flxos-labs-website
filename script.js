document.addEventListener('DOMContentLoaded', () => {
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

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');

            // Update ARIA attributes
            mobileMenuBtn.setAttribute('aria-expanded', isActive);

            // Focus first link when menu opens
            if (isActive) {
                const firstLink = navLinks.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        });
    }

    // GitHub Stats and Release info
    fetchGitHubStats();
    fetchLatestRelease();

    async function fetchLatestRelease() {
        try {
            const response = await fetch('https://api.github.com/repos/flxos-labs/flxos/releases/latest');
            if (response.ok) {
                const data = await response.json();
                const releaseEl = document.getElementById('latest-release');
                if (releaseEl && data.tag_name) {
                    releaseEl.textContent = `Latest: ${data.tag_name}`;
                    releaseEl.style.display = 'inline-block';
                }
            }
        } catch (error) {
            console.warn('Failed to fetch latest release:', error);
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
        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
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

    // ────────────────────────────────────────────────
    // Terminal Typing Animation
    // ────────────────────────────────────────────────
    const terminalEl = document.querySelector('.window-content');
    if (terminalEl) {
        initTerminalTyping(terminalEl);
    }

    function initTerminalTyping(container) {
        const lines = [
            { type: 'command', text: '$ git clone --recurse-submodules https://github.com/flxos-labs/flxos.git' },
            { type: 'command', text: '$ cd flxos' },
            { type: 'command', text: '$ python flxos.py select esp32s3-ili9341' },
            { type: 'command', text: '$ python flxos.py build' },
            { type: 'output', text: "Selecting profile 'esp32s3-ili9341'..." },
            { type: 'output', text: 'Generating hardware initialization code...' },
            { type: 'success', text: 'Build completed successfully.' },
            { type: 'highlight', text: 'FlxOS ready for flashing!' }
        ];

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
                // Simulate network latency (1.5s)
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    throw new Error('Subscription failed');
                }

                // Final UI state
                newsletterForm.style.display = 'none';
                newsletterMessage.style.display = 'flex';
                newsletterMessage.classList.add('animate-in');

                console.log('Successfully subscribed');
            } catch (error) {
                console.error('Subscription failed:', error);
                button.disabled = false;
                button.innerHTML = originalButtonText;
                input.disabled = false;
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
});
