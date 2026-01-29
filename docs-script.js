// Documentation Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Copy functionality for all code blocks
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            let codeElement;

            if (targetId) {
                codeElement = document.getElementById(targetId);
            } else {
                // Find the code element in the same block
                const codeBlock = btn.closest('.code-block-wrapper');
                codeElement = codeBlock.querySelector('code');
            }

            if (codeElement) {
                try {
                    await navigator.clipboard.writeText(codeElement.innerText);

                    // Visual feedback
                    const originalIcon = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.style.color = '#4ade80';

                    setTimeout(() => {
                        btn.innerHTML = originalIcon;
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            }
        });
    });

    // Sidebar scroll spy (highlight active section)
    const sections = document.querySelectorAll('.doc-section');
    const sidebarLinks = document.querySelectorAll('.docs-sidebar a');

    function highlightActiveSection() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Only add scroll listener if sidebar exists
    if (sidebarLinks.length > 0) {
        window.addEventListener('scroll', highlightActiveSection);
        highlightActiveSection(); // Run once on load
    }

    // Smooth scroll for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
