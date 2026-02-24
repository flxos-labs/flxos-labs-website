document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reset
    window.scrollTo(0, 0);

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .fade-in-up, .block-reveal, .blur-reveal');
    revealElements.forEach(el => observer.observe(el));

    // 3. Dynamic Glow Effect on Cards (Radial Gradient tracking mouse)
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for the pseudo-element to use
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 4. Navbar Blur on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 17, 23, 0.8)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(13, 17, 23, 0.4)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 5. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            const icon = navLinks.classList.contains('nav-open')
                ? '<path d="M18 6L6 18M6 6l12 12"></path>'
                : '<path d="M3 12h18M3 6h18M3 18h18"></path>';
            mobileToggle.querySelector('svg').innerHTML = icon;
        });

        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                mobileToggle.querySelector('svg').innerHTML = '<path d="M3 12h18M3 6h18M3 18h18"></path>';
            });
        });
    }
});
