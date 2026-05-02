/* ========================================
   ReloPlan AG – Main JavaScript
   Performance-optimized, a11y-aware
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.documentElement.getAttribute('data-animations') === 'off';
    const hoverEffectsEnabled = document.documentElement.getAttribute('data-hover-effects') !== 'off';
    const isMobile = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // --- Scroll Animations (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame to sync visual updates with browser painting cycle!
                // This is the absolute best practice to guarantee 0 lag!
                window.requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px 150px 0px'
    });

    // --- Animated Counter ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                const duration = prefersReducedMotion ? 0 : 1800;

                if (duration === 0) {
                    el.textContent = target + suffix;
                    counterObserver.unobserve(el);
                    return;
                }

                const start = performance.now();

                const step = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);

                    el.textContent = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                };

                requestAnimationFrame(step);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    // --- Re-usable animation hydration for CMS-rendered content ---
    const hydrateTilt = (root = document) => {
        if (prefersReducedMotion || isMobile || !hoverEffectsEnabled) return;
        const tiltTargets = root.querySelectorAll('.stat-card, .team-card, .map-card, .feature-card, .testimonial-card, .area-card, .package-card');
        tiltTargets.forEach((card) => {
            if (card.dataset.rpTiltInit === '1') return;
            card.dataset.rpTiltInit = '1';
            card.classList.add('interactive-tilt');
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    };

    const hydrateAnimations = (root = document) => {
        const animated = Array.from(root.querySelectorAll('.animate-in'));
        const seenBySection = new Map();

        animated.forEach((el) => {
            if (el.dataset.rpAnimInit === '1') return;
            el.dataset.rpAnimInit = '1';

            const section = el.closest('section') || document.body;
            const index = seenBySection.get(section) || 0;
            seenBySection.set(section, index + 1);
            el.style.setProperty('--reveal-index', Math.min(index, 8));

            if (prefersReducedMotion) {
                el.classList.add('visible');
            } else {
                observer.observe(el);
            }
        });

        root.querySelectorAll('[data-count]').forEach((el) => {
            if (el.dataset.rpCounterInit === '1') return;
            el.dataset.rpCounterInit = '1';
            if (prefersReducedMotion) {
                el.textContent = (parseInt(el.dataset.count, 10) || 0) + (el.dataset.suffix || '');
            } else {
                counterObserver.observe(el);
            }
        });

        hydrateTilt(root);
        document.dispatchEvent(new CustomEvent('reloplan:animations-ready'));
    };

    window.ReloPlanHydrateAnimations = hydrateAnimations;
    hydrateAnimations(document);


    // --- Single consolidated scroll handler with rAF ---
    const navbar = document.getElementById('navbar');
    let heroBg = document.querySelector('.hero-bg');
    let sections = document.querySelectorAll('section[id]');
    let navLinks = document.querySelectorAll('.nav-link');
    const scrollProgressBar = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');
    let timelineTrack = document.querySelector('.process-timeline');
    let processSteps = document.querySelectorAll('.timeline-step');

    const navMap = {
        'hero': null,
        'about': 'about',
        'process': 'process',
        'who-we-are': 'about',
        'team': 'team',
        'contact': 'contact'
    };

    let ticking = false;

    const refreshAnimatedRefs = () => {
        heroBg = document.querySelector('.hero-bg');
        sections = document.querySelectorAll('section[id]');
        navLinks = document.querySelectorAll('.nav-link');
        timelineTrack = document.querySelector('.process-timeline');
        processSteps = document.querySelectorAll('.timeline-step');
        onScroll();
    };

    const onScroll = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Navbar background
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Scroll progress bar (GPU-composited via scaleX)
            if (scrollProgressBar && docHeight > 0) {
                const progress = scrollY / docHeight;
                scrollProgressBar.style.transform = `scaleX(${progress})`;
            }

            // Back to top button
            if (backToTopBtn) {
                if (scrollY > 600) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            // Parallax hero (skip if reduced motion or mobile — causes jank on phones)
            if (heroBg && !prefersReducedMotion && window.innerWidth > 992 && scrollY < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
            }

            if (heroBg && !prefersReducedMotion && window.innerWidth > 992) {
                const driftX = Math.max(-18, Math.min(18, (window.innerWidth / 2 - (window.__rpMouseX || window.innerWidth / 2)) / 55));
                const driftY = Math.max(-14, Math.min(14, (window.innerHeight / 2 - (window.__rpMouseY || window.innerHeight / 2)) / 70));
                heroBg.style.setProperty('--hero-x', `${driftX}px`);
                heroBg.style.setProperty('--hero-y', `${driftY}px`);
            }

            // Timeline track fill animation
            if (timelineTrack && !prefersReducedMotion) {
                const section = timelineTrack.closest('section');
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const sectionVisible = Math.max(0, Math.min(1,
                        (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.3)
                    ));
                    timelineTrack.style.setProperty('--track-fill', Math.min(sectionVisible * 1.5, 1));

                    if (processSteps.length) {
                        const activeIndex = Math.min(processSteps.length - 1, Math.max(0, Math.floor(sectionVisible * processSteps.length)));
                        processSteps.forEach((step, index) => {
                            step.classList.toggle('is-current', index === activeIndex && rect.top < window.innerHeight * 0.72 && rect.bottom > window.innerHeight * 0.2);
                        });
                    }
                }
            }

            // Active nav link
            const checkY = scrollY + 120;
            let activeId = null;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (checkY >= top && checkY < top + height) {
                    activeId = navMap[id];
                }
            });

            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${activeId}`;
                link.classList.toggle('active', isActive);
            });

            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('reloplan:animations-ready', refreshAnimatedRefs);
    if (!prefersReducedMotion && !isMobile) {
        window.addEventListener('pointermove', (event) => {
            window.__rpMouseX = event.clientX;
            window.__rpMouseY = event.clientY;
        }, { passive: true });
    }
    onScroll();

    // --- Back to Top click ---
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        const toggleNav = () => {
            const isOpen = navLinksContainer.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
        };

        navToggle.addEventListener('click', toggleNav);

        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('open')) {
                    toggleNav();
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
                toggleNav();
                navToggle.focus();
            }
        });
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                setTimeout(() => {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }, 10);
            }
        });
    });
});
