/* ReloPlan AG – Content Override & Module Renderer
   - If content has a `structure` array → rebuilds <main> from templates
   - Otherwise → patches existing static HTML (backward compat)
   - Always applies design tokens and reveals the page */
(function () {
    'use strict';

    var KEY = 'rp_site_content';

    /* ── Helpers ─────────────────────────────────────────── */
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    function safeUrl(url, fallback) {
        url = String(url || '').trim();
        fallback = fallback || '#';
        if (!url) return fallback;
        if (/^#[A-Za-z0-9_-]+$/.test(url)) return url;
        if (/^(\/(?!\/)|\.{0,2}\/)?[A-Za-z0-9._~!$&'()*+,;=:@/%#?-]+$/.test(url) && !/^\s*(javascript|data|vbscript):/i.test(url)) return url;
        try {
            var u = new URL(url, window.location.origin);
            if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
        } catch (e) {}
        return fallback;
    }
    function safeImage(url, fallback) {
        url = String(url || '').trim();
        fallback = fallback || '';
        if (/^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/i.test(url)) return url;
        return safeUrl(url, fallback);
    }
    function safeEmail(email) {
        email = String(email || '').trim();
        return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : '';
    }
    function safePhone(phone) {
        phone = String(phone || '').trim();
        return /^[+0-9() .-]{3,30}$/.test(phone) ? phone : '';
    }
    function safeLinkedIn(slug) {
        slug = String(slug || '').trim();
        return /^[A-Za-z0-9_-]{1,100}$/.test(slug) ? slug : '';
    }
    function safeMap(url) {
        url = String(url || '').trim();
        try {
            var u = new URL(url);
            if ((u.hostname === 'www.google.com' || u.hostname === 'maps.google.com') &&
                (u.pathname.indexOf('/maps/embed') === 0 || (u.pathname === '/maps' && u.searchParams.get('output') === 'embed'))) return u.href;
        } catch (e) {}
        return '';
    }
    function setText(sel, val) {
        if (val == null) return;
        var el = document.querySelector(sel);
        if (el) el.textContent = String(val);
    }
    function setHTML(sel, html) {
        if (!html) return;
        var el = document.querySelector(sel);
        if (el) el.innerHTML = html;
    }
    function setMeta(name, val) {
        if (!val) return;
        var el = document.querySelector('meta[name="' + name + '"]') ||
            document.querySelector('meta[property="' + name + '"]');
        if (!el) {
            el = document.createElement('meta');
            if (name.indexOf('og:') === 0) el.setAttribute('property', name);
            else el.setAttribute('name', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', val);
    }
    function setLink(rel, href) {
        if (!href) return;
        var el = document.querySelector('link[rel="' + rel + '"]');
        if (!el) {
            el = document.createElement('link');
            el.setAttribute('rel', rel);
            document.head.appendChild(el);
        }
        el.setAttribute('href', safeUrl(href, window.location.href));
    }
    function buildTitle(plain, gradient, suffix) {
        var h = '';
        if (plain) h += esc(plain) + ' ';
        if (gradient) h += '<span class="gradient-text">' + esc(gradient) + '</span>';
        if (suffix) h += ' ' + esc(suffix);
        return h;
    }
    function stars(n) {
        var s = '';
        for (var i = 0; i < 5; i++) s += i < n ? '★' : '☆';
        return s;
    }

    /* ── Design tokens ───────────────────────────────────── */
    function hexAdjust(hex, pct) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        var n = parseInt(hex, 16);
        var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
        var target = pct > 0 ? 255 : 0, blend = Math.abs(pct);
        r = Math.round(r + (target - r) * blend);
        g = Math.round(g + (target - g) * blend);
        b = Math.round(b + (target - b) * blend);
        return '#' + ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
    }

    function applyDesign(d) {
        var root = document.documentElement;
        d = d || {};
        root.setAttribute('data-button-style', d.button_style || 'pill');
        root.setAttribute('data-button-fill', d.button_fill || 'light');
        root.setAttribute('data-animations', d.animations || 'full');
        root.setAttribute('data-hover-effects', d.hover_effects || 'on');
        if (d.primary_color) {
            var p = d.primary_color;
            root.style.setProperty('--primary', p);
            root.style.setProperty('--primary-dark', hexAdjust(p, -0.35));
            root.style.setProperty('--primary-light', hexAdjust(p, 0.25));
            root.style.setProperty('--gradient',
                'linear-gradient(135deg,' + hexAdjust(p,-0.2) + ' 0%,' + p + ' 50%,' + hexAdjust(p,0.2) + ' 100%)');
            root.style.setProperty('--gradient-text',
                'linear-gradient(135deg,' + hexAdjust(p,0.1) + ' 0%,' + hexAdjust(p,0.35) + ' 100%)');
        }
        if (d.accent_color) {
            root.style.setProperty('--accent', d.accent_color);
            root.style.setProperty('--accent-light', hexAdjust(d.accent_color, 0.25));
        }
        if (d.font_display) {
            root.style.setProperty('--font-display', "'" + d.font_display + "', Georgia, serif");
        }
        if (d.border_radius != null) {
            var r = parseInt(d.border_radius, 10) || 0;
            root.style.setProperty('--radius-sm', Math.max(4, r - 4) + 'px');
            root.style.setProperty('--radius', r + 'px');
            root.style.setProperty('--radius-lg', Math.round(r * 1.6) + 'px');
            root.style.setProperty('--radius-xl', Math.round(r * 2.3) + 'px');
        }
        if (d.section_spacing) {
            var sp = d.section_spacing === 'kompakt' ? '5vw' : d.section_spacing === 'grosszügig' ? '11vw' : '8vw';
            root.style.setProperty('--section-padding', 'clamp(3rem,' + sp + ',8rem)');
        }
        var widths = { narrow:'1120px', standard:'1280px', wide:'1480px', full:'none' };
        root.style.setProperty('--container-max', widths[d.layout_width || 'full'] || 'none');
        root.style.setProperty('--heading-scale', ((parseInt(d.heading_scale,10)||100)/100));
        root.style.setProperty('--body-scale', ((parseInt(d.body_scale,10)||100)/100));
        root.style.setProperty('--hero-overlay-opacity', ((parseInt(d.hero_overlay,10)||0)/100));
        root.style.setProperty('--hero-pattern-opacity', ((parseInt(d.hero_pattern,10)||0)/100));
        var buttonRadius = d.button_style === 'sharp' ? '6px' : d.button_style === 'rounded' ? '14px' : '999px';
        root.style.setProperty('--button-radius', buttonRadius);
        if (d.button_fill === 'brand') {
            root.style.setProperty('--primary-button-bg', 'var(--accent)');
            root.style.setProperty('--primary-button-color', '#fff');
        } else if (d.button_fill === 'glass') {
            root.style.setProperty('--primary-button-bg', 'rgba(255,255,255,0.14)');
            root.style.setProperty('--primary-button-color', '#fff');
        } else {
            root.style.setProperty('--primary-button-bg', '#fff');
            root.style.setProperty('--primary-button-color', 'var(--primary)');
        }
        var bg = 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 45%, var(--primary-light) 100%)';
        if (d.hero_bg_style === 'mesh') {
            bg = 'radial-gradient(circle at 18% 24%, var(--accent-light), transparent 32%), radial-gradient(circle at 82% 18%, var(--primary-light), transparent 28%), linear-gradient(135deg, var(--primary-dark), var(--primary))';
        } else if (d.hero_bg_style === 'solid') {
            bg = 'linear-gradient(135deg, var(--primary-dark), var(--primary-dark))';
        } else if (d.hero_bg_style === 'image' && d.hero_bg_image) {
            bg = 'linear-gradient(rgba(0,0,0,var(--hero-overlay-opacity)),rgba(0,0,0,var(--hero-overlay-opacity))), url("' + safeImage(d.hero_bg_image, '') + '") center/cover no-repeat';
        }
        root.style.setProperty('--hero-background', bg);
    }

    /* ── Feature icons ───────────────────────────────────── */
    var ICONS = {
        shield:  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        clock:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        users:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        check:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        star:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        truck:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
        map:     '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
        home:    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        phone:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6z"/></svg>',
        heart:   '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    };

    /* ── Module HTML templates ───────────────────────────── */
    var T = {};

    T.hero = function (d) {
        return '<section id="hero" aria-label="Willkommen">' +
            '<div class="hero-bg" aria-hidden="true"></div>' +
            '<div class="hero-content">' +
            '<span class="hero-badge animate-in anim-blur">' + esc(d.badge || '') + '</span>' +
            '<h1 class="hero-title animate-in anim-blur">' + esc(d.title_line1 || 'Wir planen.') + '<br><span class="gradient-text">' + esc(d.title_line2 || 'Du bewegst.') + '</span></h1>' +
            '<p class="hero-subtitle animate-in">' + esc(d.subtitle || '') + '</p>' +
            '<div class="hero-actions animate-in">' +
            '<a href="' + esc(safeUrl(d.btn_primary_href, '#contact')) + '" class="btn btn-primary">' + esc(d.btn_primary || 'Kontakt') + '</a>' +
            '<a href="' + esc(safeUrl(d.btn_outline_href, '#process')) + '" class="btn btn-outline">' + esc(d.btn_outline || 'Mehr erfahren') + '</a>' +
            '</div></div>' +
            '<div class="hero-scroll-indicator" aria-hidden="true"><div class="scroll-line"></div></div>' +
            '</section>';
    };

    T.about = function (d) {
        var stats = (d.stats || []).map(function (s) {
            return '<div class="stat-card animate-in anim-scale">' +
                '<div class="stat-number" data-count="' + esc(String(s.count)) + '" data-suffix="' + esc(s.suffix || '') + '">' + esc(String(s.count)) + esc(s.suffix || '') + '</div>' +
                '<div class="stat-label">' + esc(s.label) + '</div></div>';
        }).join('');
        var paras = (d.paragraphs || []).map(function (p, i) {
            return '<p' + (i === 0 ? ' class="lead"' : '') + '>' + esc(p) + '</p>';
        }).join('');
        return '<section id="about" aria-labelledby="about-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="about-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="about-grid">' +
            '<div class="about-text animate-in">' + paras + '</div>' +
            '<div class="about-stats animate-in anim-scale">' + stats + '</div>' +
            '</div></div></section>';
    };

    T.process = function (d) {
        var steps = (d.steps || []).map(function (s, i) {
            return '<li class="timeline-step animate-in">' +
                '<div class="step-marker" aria-hidden="true"><span class="step-number">' + (i + 1) + '</span></div>' +
                '<div class="step-content">' +
                '<div class="step-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>' +
                '<h3>' + esc(s.title) + '</h3><p>' + esc(s.description) + '</p>' +
                '</div></li>';
        }).join('');
        return '<section id="process" aria-labelledby="process-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="process-title">' + buildTitle(d.title_plain, d.title_gradient, null) + '</h2></div>' +
            '<ol class="process-timeline">' + steps + '</ol>' +
            '<div class="process-bar animate-in"><div class="process-bar-inner">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
            '<div><strong>' + esc(d.bar_title || '') + '</strong><span>' + esc(d.bar_subtitle || '') + '</span></div>' +
            '</div></div></div></section>';
    };

    T.whoweare = function (d) {
        var paras = (d.paragraphs || []).map(function (p) {
            return '<p>' + esc(p) + '</p>';
        }).join('');
        return '<section id="who-we-are" aria-labelledby="who-title">' +
            '<div class="container"><div class="who-grid">' +
            '<div class="who-image animate-in"><img src="' + esc(safeImage(d.image_src, 'images/team.jpg')) + '" alt="' + esc(d.image_alt || '') + '" width="800" height="600" loading="lazy"><div class="image-accent" aria-hidden="true"></div></div>' +
            '<div class="who-text animate-in">' +
            '<h2 class="section-title" id="who-title">' + buildTitle(d.title_plain, d.title_gradient, null) + '</h2>' +
            paras +
            '<p class="who-cta"><strong>' + esc(d.cta || '') + '</strong></p>' +
            '</div></div></div></section>';
    };

    T.team = function (d) {
        var emailSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
        var cards = (d.members || []).map(function (m) {
            var refs = (m.references || []).map(function (r) { return '<span class="ref-tag">' + esc(r) + '</span>'; }).join('');
            return '<div class="animate-in anim-scale team-anim-wrapper"><article class="team-card">' +
                '<div class="team-card-image"><img src="' + esc(safeImage(m.image || '')) + '" alt="' + esc(m.image_alt || 'Portrait von ' + (m.name || '')) + '" width="450" height="450" loading="lazy" decoding="async"></div>' +
                '<div class="team-card-body">' +
                '<h3 class="team-name">' + esc(m.name || '') + '</h3>' +
                '<span class="team-role">' + esc(m.role || '') + '</span>' +
                '<p class="team-description">' + esc(m.description || '') + '</p>' +
                '<div class="team-references"><span class="ref-label">Referenzen:</span><span class="ref-tags">' + refs + '</span></div>' +
                '<a class="team-email" href="mailto:' + esc(safeEmail(m.email)) + '" aria-label="E-Mail an ' + esc(m.name || '') + ' senden">' + emailSvg + esc(safeEmail(m.email)) + '</a>' +
                '</div></article></div>';
        }).join('');
        return '<section id="team" aria-labelledby="team-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="team-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="team-grid">' + cards + '</div>' +
            '</div></section>';
    };

    T.testimonials = function (d) {
        var cards = (d.items || []).map(function (t) {
            var rating = parseInt(t.rating, 10) || 5;
            return '<div class="testimonial-card animate-in anim-scale">' +
                '<div class="testimonial-stars">' + stars(rating) + '</div>' +
                '<p class="testimonial-text">&ldquo;' + esc(t.text || '') + '&rdquo;</p>' +
                '<div class="testimonial-author"><strong>' + esc(t.author || '') + '</strong>' +
                (t.company ? '<span>' + esc(t.company) + '</span>' : '') +
                '</div></div>';
        }).join('');
        return '<section id="testimonials" aria-labelledby="testi-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="testi-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="testimonials-grid">' + cards + '</div>' +
            '</div></section>';
    };

    T.faq = function (d) {
        var chevron = '<svg class="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
        var items = (d.items || []).map(function (f, i) {
            return '<div class="faq-item">' +
                '<button class="faq-question" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
                '<span>' + esc(f.question || '') + '</span>' + chevron +
                '</button>' +
                '<div class="faq-answer" id="faq-a-' + i + '" role="region">' +
                '<div class="faq-answer-inner">' + esc(f.answer || '') + '</div>' +
                '</div></div>';
        }).join('');
        return '<section id="faq" aria-labelledby="faq-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="faq-title">' + buildTitle(d.title_plain, d.title_gradient, null) + '</h2></div>' +
            '<div class="faq-list animate-in">' + items + '</div>' +
            '</div></section>';
    };

    T.cta = function (d) {
        return '<section class="cta-section" aria-label="Call to Action">' +
            '<div class="container cta-inner animate-in">' +
            '<h2 class="cta-title">' + esc(d.title || '') + '</h2>' +
            '<p class="cta-text">' + esc(d.text || '') + '</p>' +
            '<a href="' + esc(safeUrl(d.btn_href, '#contact')) + '" class="cta-btn">' + esc(d.btn_text || 'Jetzt anfragen') + '</a>' +
            '</div></section>';
    };

    T.features = function (d) {
        var cards = (d.items || []).map(function (f) {
            var icon = ICONS[f.icon] || ICONS.star;
            return '<div class="feature-card animate-in anim-scale">' +
                '<div class="feature-icon" aria-hidden="true">' + icon + '</div>' +
                '<h3 class="feature-title">' + esc(f.title || '') + '</h3>' +
                '<p class="feature-text">' + esc(f.text || '') + '</p>' +
                '</div>';
        }).join('');
        return '<section id="features" aria-labelledby="features-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="features-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="features-grid">' + cards + '</div>' +
            '</div></section>';
    };

    T.areas = function (d) {
        var cards = (d.items || []).map(function (a) {
            return '<div class="area-card animate-in anim-scale">' +
                '<div class="area-icon" aria-hidden="true">' + ICONS.map + '</div>' +
                '<h3>' + esc(a.title || '') + '</h3>' +
                '<p>' + esc(a.text || '') + '</p>' +
                '</div>';
        }).join('');
        return '<section id="areas" aria-labelledby="areas-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="areas-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="areas-grid">' + cards + '</div>' +
            '</div></section>';
    };

    T.checklist = function (d) {
        var items = (d.items || []).map(function (c) {
            return '<li class="checklist-item animate-in">' +
                '<span class="checklist-icon" aria-hidden="true">' + ICONS.check + '</span>' +
                '<div><h3>' + esc(c.title || '') + '</h3><p>' + esc(c.text || '') + '</p></div>' +
                '</li>';
        }).join('');
        return '<section id="checklist" aria-labelledby="checklist-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="checklist-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<ul class="checklist-list">' + items + '</ul>' +
            '</div></section>';
    };

    T.gallery = function (d) {
        var items = (d.items || []).map(function (g) {
            return '<figure class="gallery-card animate-in anim-scale">' +
                '<img src="' + esc(safeImage(g.image || '')) + '" alt="' + esc(g.title || '') + '" loading="lazy" decoding="async">' +
                '<figcaption><strong>' + esc(g.title || '') + '</strong><span>' + esc(g.text || '') + '</span></figcaption>' +
                '</figure>';
        }).join('');
        return '<section id="gallery" aria-labelledby="gallery-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="gallery-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="gallery-grid">' + items + '</div>' +
            '</div></section>';
    };

    T.packages = function (d) {
        var cards = (d.items || []).map(function (p) {
            var fs = String(p.features || '').split(',').map(function (f) { return f.trim(); }).filter(Boolean).map(function (f) {
                return '<li>' + esc(f) + '</li>';
            }).join('');
            return '<article class="package-card animate-in anim-scale">' +
                '<h3>' + esc(p.title || '') + '</h3>' +
                '<div class="package-price">' + esc(p.price || '') + '</div>' +
                '<p>' + esc(p.text || '') + '</p>' +
                '<ul>' + fs + '</ul>' +
                '</article>';
        }).join('');
        return '<section id="packages" aria-labelledby="packages-title">' +
            '<div class="container">' +
            '<div class="section-header animate-in"><span class="section-label">' + esc(d.label || '') + '</span>' +
            '<h2 class="section-title" id="packages-title">' + buildTitle(d.title_plain, d.title_gradient, d.title_suffix) + '</h2></div>' +
            '<div class="packages-grid">' + cards + '</div>' +
            '</div></section>';
    };

    T.contact = function (d) {
        var mkIcon = function (path) {
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
        };
        return '<section id="contact" aria-labelledby="contact-title">' +
            '<div class="container"><div class="contact-wrapper">' +
            '<div class="contact-info animate-in">' +
            '<h2 class="section-title" id="contact-title">' + buildTitle(d.title_plain, d.title_gradient, null) + '</h2>' +
            '<p class="contact-intro">' + esc(d.intro || '') + '</p>' +
            '<div class="contact-items">' +
            '<a href="mailto:' + esc(safeEmail(d.email)) + '" class="contact-item"><div class="contact-icon">' + mkIcon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>') + '</div><div><span class="contact-label">E-Mail</span><span class="contact-value">' + esc(safeEmail(d.email)) + '</span></div></a>' +
            '<a href="tel:' + esc(safePhone(d.phone_href)) + '" class="contact-item"><div class="contact-icon">' + mkIcon('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>') + '</div><div><span class="contact-label">Telefon</span><span class="contact-value">' + esc(d.phone_display || '') + '</span></div></a>' +
            '<div class="contact-item"><div class="contact-icon">' + mkIcon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>') + '</div><div><span class="contact-label">Adresse</span><span class="contact-value">' + esc(d.address || '') + '</span></div></div>' +
            (safeLinkedIn(d.linkedin) ? '<a href="https://linkedin.com/company/' + esc(safeLinkedIn(d.linkedin)) + '" target="_blank" rel="noopener noreferrer" class="contact-item"><div class="contact-icon">' + mkIcon('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>') + '</div><div><span class="contact-label">LinkedIn</span><span class="contact-value">' + esc(safeLinkedIn(d.linkedin)) + '</span></div></a>' : '') +
            '</div></div>' +
            '<div class="contact-map animate-in anim-scale"><div class="map-card">' +
            '<iframe src="' + esc(safeMap(d.map_src)) + '" title="ReloPlan AG Standort" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
            '</div></div>' +
            '</div></div></section>';
    };

    /* ── FAQ toggle (runs after rebuild) ─────────────────── */
    function setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.closest('.faq-item');
                var open = item.classList.toggle('open');
                btn.setAttribute('aria-expanded', String(open));
            });
        });
    }

    /* ── Apply meta / nav / footer helpers ───────────────── */
    function applyMeta(meta) {
        if (!meta) return;
        if (meta.title) document.title = meta.title;
        setMeta('description', meta.description);
        setMeta('og:title', meta.og_title || meta.title);
        setMeta('og:description', meta.og_description || meta.description);
        setMeta('og:image', meta.og_image);
        setMeta('robots', meta.robots);
        setLink('canonical', meta.canonical);
    }

    function applyNav(nav) {
        if (!nav || !nav.links || !nav.links.length) return;
        var navEl = document.getElementById('navLinks');
        var footerEl = document.querySelector('footer .footer-links');
        if (navEl) {
            navEl.innerHTML = nav.links.map(function (l) {
                return '<a href="' + esc(safeUrl(l.href || '#')) + '" class="nav-link">' + esc(l.label || '') + '</a>';
            }).join('');
        }
        if (footerEl) {
            footerEl.innerHTML = nav.links.map(function (l) {
                return '<a href="' + esc(safeUrl(l.href || '#')) + '">' + esc(l.label || '') + '</a>';
            }).join('');
        }
    }

    function applyFooter(footer) {
        if (!footer) return;
        setText('.footer-tagline', footer.tagline);
        setText('.footer-credit', footer.credit);
        var f = document.querySelector('footer');
        if (f) f.setAttribute('data-footer-variant', footer.variant || 'dark');
        var social = document.querySelector('.footer-social');
        if (social) social.style.display = String(footer.show_social) === 'false' ? 'none' : '';
        var admin = document.querySelector('a[href="admin/"]');
        if (admin) {
            if (footer.show_admin_link === 'visible') {
                admin.removeAttribute('aria-hidden');
                admin.removeAttribute('tabindex');
                admin.style.cssText = '';
            } else {
                admin.setAttribute('aria-hidden','true');
                admin.setAttribute('tabindex','-1');
                admin.style.cssText = 'color:transparent;font-size:1px;position:absolute;left:-9999px';
            }
        }
        var links = document.querySelector('footer .footer-links');
        if (links) {
            Array.prototype.slice.call(links.querySelectorAll('[data-extra-footer]')).forEach(function(a){ a.remove(); });
            [
                [footer.imprint_label, footer.imprint_href],
                [footer.privacy_label, footer.privacy_href]
            ].forEach(function (l) {
                if (l[0] && l[1]) {
                    var a = document.createElement('a');
                    a.setAttribute('data-extra-footer','1');
                    a.href = safeUrl(l[1], '#');
                    a.textContent = l[0];
                    links.appendChild(a);
                }
            });
        }
        if (footer.copyright) {
            var el = document.querySelector('.footer-bottom span:first-child');
            if (el) el.textContent = footer.copyright;
        }
    }

    /* ── Full page rebuild from structure ────────────────── */
    function rebuildPage(content) {
        var main = document.getElementById('main-content');
        if (!main) return;
        var html = '';
        content.structure.forEach(function (m) {
            if (m.active === false) return;
            var tpl = T[m.type];
            var data = content[m.type];
            if (tpl && data) html += tpl(data);
        });
        main.innerHTML = html;
        setupFAQ();
    }

    /* ── Legacy DOM patching (no structure field) ─────────── */
    function applyPatches(content) {
        var hero = content.hero, about = content.about, proc = content.process,
            who = content.whoweare, team = content.team,
            contact = content.contact, footer = content.footer;

        if (hero) {
            setText('.hero-badge', hero.badge);
            if (hero.title_line1 !== undefined || hero.title_line2 !== undefined) {
                setHTML('.hero-title', esc(hero.title_line1 != null ? hero.title_line1 : 'Wir planen.') + '<br><span class="gradient-text">' + esc(hero.title_line2 != null ? hero.title_line2 : 'Du bewegst.') + '</span>');
            }
            setText('.hero-subtitle', hero.subtitle);
            setText('.hero-actions .btn-primary', hero.btn_primary);
            setText('.hero-actions .btn-outline', hero.btn_outline);
            var bp = document.querySelector('.hero-actions .btn-primary');
            if (bp && hero.btn_primary_href) bp.href = safeUrl(hero.btn_primary_href, '#contact');
            var bo = document.querySelector('.hero-actions .btn-outline');
            if (bo && hero.btn_outline_href) bo.href = safeUrl(hero.btn_outline_href, '#process');
        }
        if (about) {
            setText('#about .section-label', about.label);
            if (about.title_plain !== undefined || about.title_gradient !== undefined)
                setHTML('#about .section-title', buildTitle(about.title_plain, about.title_gradient, about.title_suffix));
            if (about.paragraphs) {
                var textEl = document.querySelector('#about .about-text');
                if (textEl) textEl.innerHTML = about.paragraphs.map(function (p, i) { return '<p' + (i === 0 ? ' class="lead"' : '') + '>' + esc(p) + '</p>'; }).join('');
            }
            if (about.stats) {
                document.querySelectorAll('.stat-card').forEach(function (card, i) {
                    var s = about.stats[i]; if (!s) return;
                    var num = card.querySelector('.stat-number'), lbl = card.querySelector('.stat-label');
                    if (num) { num.dataset.count = s.count; num.dataset.suffix = s.suffix || ''; num.textContent = '0'; }
                    if (lbl) lbl.textContent = s.label;
                });
            }
        }
        if (proc) {
            setText('#process .section-label', proc.label);
            if (proc.title_plain !== undefined || proc.title_gradient !== undefined)
                setHTML('#process .section-title', buildTitle(proc.title_plain, proc.title_gradient, null));
            if (proc.steps) {
                var timeline = document.querySelector('.process-timeline');
                if (timeline) {
                    var icons = Array.from(timeline.querySelectorAll('.timeline-step')).map(function (s) { var sv = s.querySelector('.step-icon svg'); return sv ? sv.outerHTML : ''; });
                    var fb = icons[0] || '';
                    timeline.innerHTML = proc.steps.map(function (s, i) {
                        return '<li class="timeline-step animate-in"><div class="step-marker" aria-hidden="true"><span class="step-number">' + (i+1) + '</span></div><div class="step-content"><div class="step-icon" aria-hidden="true">' + (icons[i] || fb) + '</div><h3>' + esc(s.title) + '</h3><p>' + esc(s.description) + '</p></div></li>';
                    }).join('');
                }
            }
            setText('.process-bar-inner strong', proc.bar_title);
            setText('.process-bar-inner span', proc.bar_subtitle);
        }
        if (who) {
            var whoImg = document.querySelector('#who-we-are .who-image img');
            if (whoImg) { if (who.image_src) whoImg.src = safeImage(who.image_src, 'images/team.jpg'); if (who.image_alt) whoImg.alt = who.image_alt; }
            if (who.title_plain !== undefined || who.title_gradient !== undefined)
                setHTML('#who-we-are .section-title', buildTitle(who.title_plain, who.title_gradient, null));
            if (who.paragraphs) {
                var wt = document.querySelector('.who-text');
                if (wt) { var ps = wt.querySelectorAll('p:not(.who-cta)'); who.paragraphs.forEach(function (p, i) { if (ps[i]) ps[i].textContent = p; }); }
            }
            if (who.cta !== undefined) { var cs = document.querySelector('.who-cta strong'); if (cs) cs.textContent = who.cta; }
        }
        if (team) {
            setText('#team .section-label', team.label);
            if (team.title_plain !== undefined || team.title_gradient !== undefined)
                setHTML('#team .section-title', buildTitle(team.title_plain, team.title_gradient, team.title_suffix));
            if (team.members) {
                var grid = document.querySelector('.team-grid');
                if (grid) grid.innerHTML = T.team(team).match(/<div class="team-grid">([\s\S]*)<\/div><\/div><\/section>/)?.[1] || grid.innerHTML;
            }
        }
        if (contact) {
            if (contact.title_plain !== undefined || contact.title_gradient !== undefined)
                setHTML('#contact .section-title', buildTitle(contact.title_plain, contact.title_gradient, null));
            setText('.contact-intro', contact.intro);
            var eLink = document.querySelector('#contact .contact-items a[href^="mailto:"]');
            if (eLink && contact.email) { eLink.href = 'mailto:' + safeEmail(contact.email); var ev = eLink.querySelector('.contact-value'); if (ev) ev.textContent = safeEmail(contact.email); }
            var pLink = document.querySelector('#contact .contact-items a[href^="tel:"]');
            if (pLink) { if (contact.phone_href) pLink.href = 'tel:' + safePhone(contact.phone_href); var pv = pLink.querySelector('.contact-value'); if (pv && contact.phone_display) pv.textContent = contact.phone_display; }
            var addr = document.querySelector('#contact .contact-items .contact-item:not(a) .contact-value');
            if (addr && contact.address) addr.textContent = contact.address;
            var liLink = document.querySelector('#contact .contact-items a[href*="linkedin"]');
            if (liLink && contact.linkedin) { liLink.href = 'https://linkedin.com/company/' + safeLinkedIn(contact.linkedin); var lv = liLink.querySelector('.contact-value'); if (lv) lv.textContent = safeLinkedIn(contact.linkedin); }
            if (contact.map_src) { var iframe = document.querySelector('.map-card iframe'); if (iframe) iframe.src = safeMap(contact.map_src); }
        }
        applyNav(content.nav);
        applyFooter(footer);
        setupFAQ();
    }

    /* ── Main entry point ────────────────────────────────── */
    function applyContent(content) {
        if (content.design) applyDesign(content.design);
        applyMeta(content.meta);
        if (content.structure && content.structure.length) {
            rebuildPage(content);
            applyNav(content.nav);
            applyFooter(content.footer);
        } else {
            applyPatches(content);
        }
    }

    function hasRenderableContent(content) {
        if (!content || !content.structure || !content.structure.length) return false;
        return content._cmsSaved === true;
    }

    document.addEventListener('DOMContentLoaded', async function () {
        var applied = false;
        try {
            var resp = await fetch('/api/content', { cache: 'no-store', credentials: 'same-origin' });
            if (resp.ok) {
                var remote = await resp.json();
                if (hasRenderableContent(remote)) {
                    applyContent(remote);
                    applied = true;
                }
            }
        } catch (e) { /* static fallback */ }
        try {
            var stored = localStorage.getItem(KEY);
            if (!applied && stored) applyContent(JSON.parse(stored));
        } catch (e) { /* ignore invalid local content */ }
        document.body.classList.add('rp-ready');
    });
})();
