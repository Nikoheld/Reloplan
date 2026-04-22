/* ========================================
   ReloPlan AG – Main JavaScript
   Performance-optimized, a11y-aware
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

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

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));



    // --- Single consolidated scroll handler with rAF ---
    const navbar = document.getElementById('navbar');
    const heroBg = document.querySelector('.hero-bg');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgressBar = document.getElementById('scrollProgress');
    const backToTopBtn = document.getElementById('backToTop');
    const timelineTrack = document.querySelector('.process-timeline');

    const navMap = {
        'hero': null,
        'about': 'about',
        'process': 'process',
        'who-we-are': 'about',
        'team': 'team',
        'contact': 'contact'
    };

    let ticking = false;

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

            // Timeline track fill animation
            if (timelineTrack && !prefersReducedMotion) {
                const section = timelineTrack.closest('section');
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const sectionVisible = Math.max(0, Math.min(1,
                        (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.3)
                    ));
                    timelineTrack.style.setProperty('--track-fill', Math.min(sectionVisible * 1.5, 1));
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
