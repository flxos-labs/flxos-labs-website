// Documentation Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Documentation Search
    const searchInput = document.getElementById('docSearch');
    const clearBtn = document.getElementById('clearSearch');
    const docSections = document.querySelectorAll('.doc-section');

    if (searchInput) {
        // Debounce function for search performance
        let debounceTimeout;
        function debounce(func, delay) {
            return function (...args) {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => func.apply(this, args), delay);
            };
        }

        // Focus search with '/' key
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.blur();
                clearSearch();
            }
        });

        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query) {
                clearBtn.style.display = 'block';
                filterSections(query);
            } else {
                clearBtn.style.display = 'none';
                clearSearch();
            }
        }, 150)); // 150ms debounce delay

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearBtn.style.display = 'none';
                clearSearch();
                searchInput.focus();
            });
        }
    }

    function filterSections(query) {
        let hasResults = false;

        docSections.forEach(section => {
            const heading = section.querySelector('h2');
            const content = section.textContent.toLowerCase();

            if (content.includes(query)) {
                section.style.display = 'block';
                section.classList.add('search-highlight');
                hasResults = true;
            } else {
                section.style.display = 'none';
                section.classList.remove('search-highlight');
            }
        });

        // Show "no results" message if needed
        showNoResults(!hasResults);
    }

    function clearSearch() {
        docSections.forEach(section => {
            section.style.display = 'block';
            section.classList.remove('search-highlight');
        });
        showNoResults(false);
    }

    function showNoResults(show) {
        let noResultsMsg = document.getElementById('noResults');

        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResults';
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = '<i class="fas fa-search"></i><p>No results found. Try a different search term.</p>';
            document.querySelector('.docs-content').prepend(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

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

    // Only add scroll listener if sidebar exists with passive option
    if (sidebarLinks.length > 0) {
        window.addEventListener('scroll', highlightActiveSection, { passive: true });
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
