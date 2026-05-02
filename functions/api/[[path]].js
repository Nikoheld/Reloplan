const KDF_ITER = 100000;
const SESSION_TTL_SECONDS = 60 * 60 * 2;
const CONTENT_KEY = 'content';
const AUTH_KEY = 'auth';
const CURRENT_CONTACT = {
  phone_display: '+41 44 777 29 29',
  phone_href: '+41447772929',
  address: 'Im Hanfland 7, 8902 Urdorf, Schweiz',
  map_src: 'https://maps.google.com/maps?q=Im%20Hanfland%207%2C%208902%20Urdorf%2C%20Schweiz&output=embed'
};

const DEFAULT_CONTENT = {
  "meta": {
    "title": "ReloPlan AG",
    "description": "Wir planen und steuern Ihren Umzug - von der Konzeption bis zur erfolgreichen Umsetzung!",
    "og_title": "",
    "og_description": "",
    "og_image": "",
    "canonical": "",
    "robots": ""
  },
  "design": {
    "primary_color": "#3b82f6",
    "accent_color": "#f59e0b",
    "font_display": "Inter",
    "border_radius": 8,
    "section_spacing": "normal",
    "preset": "modern",
    "hero_bg_style": "gradient",
    "hero_bg_image": "",
    "hero_overlay": 35,
    "hero_pattern": 3,
    "button_style": "pill",
    "button_fill": "light",
    "layout_width": "full",
    "heading_scale": 100,
    "body_scale": 100,
    "animations": "full",
    "hover_effects": "on"
  },
  "nav": {
    "links": [
      {
        "label": "Umzugsmanagement",
        "href": "#about"
      },
      {
        "label": "Prozess",
        "href": "#process"
      },
      {
        "label": "Team",
        "href": "#team"
      },
      {
        "label": "Kontakt",
        "href": "#contact"
      }
    ]
  },
  "footer": {
    "tagline": "Professionelles Umzugsmanagement",
    "copyright": "© 2026 Silvan Schmidt",
    "credit": "",
    "show_social": "true",
    "variant": "dark",
    "show_admin_link": "hidden",
    "imprint_label": "",
    "imprint_href": "",
    "privacy_label": "",
    "privacy_href": ""
  },
  "structure": [
    {
      "type": "hero",
      "active": true
    },
    {
      "type": "about",
      "active": true
    },
    {
      "type": "process",
      "active": true
    },
    {
      "type": "whoweare",
      "active": true
    },
    {
      "type": "team",
      "active": true
    },
    {
      "type": "contact",
      "active": true
    }
  ],
  "hero": {
    "badge": "Schweizer Umzugsspezialist",
    "title_line1": "Wir planen.",
    "title_line2": "Du bewegst.",
    "subtitle": "Wir planen und steuern Ihren Umzug - von der Konzeption bis zur erfolgreichen Umsetzung!",
    "btn_primary": "Jetzt kontaktieren",
    "btn_primary_href": "#contact",
    "btn_outline": "Unser Prozess",
    "btn_outline_href": "#process"
  },
  "about": {
    "label": "Umzugsmanagement",
    "title_plain": "Professionelles",
    "title_gradient": "Umzugsmanagement",
    "title_suffix": "",
    "paragraphs": [
      "Als dein Partner für professionelles Umzugsmanagement übernehmen wir die Regie von der strategischen Planung bis zur erfolgreichen Übergabe. Durch klare Kommunikation und die gezielte Koordination aller Beteiligten und Dienstleister stellen wir sicher, dass Mobiliar, Technik und Abläufe nahtlos ineinandergreifen.",
      "Unser Ziel ist deine Entlastung: Während wir die Schnittstellen managen und Termine überwachen, konzentrierst du dich voll auf dein Tagesgeschäft. Auch in komplexen Phasen behalten wir den Überblick und garantieren Prozesssicherheit, indem wir Termine, Abhängigkeiten und Abläufe optimal aufeinander abstimmen."
    ],
    "stats": [
      {
        "count": 30,
        "suffix": "+",
        "label": "Jahre Erfahrung"
      },
      {
        "count": 3,
        "suffix": "",
        "label": "Spezialisten"
      },
      {
        "count": 2026,
        "suffix": "",
        "label": "Firmengründung"
      }
    ]
  },
  "process": {
    "label": "Unser Prozess",
    "title_plain": "In 5 Schritten zu Ihrem",
    "title_gradient": "neuen Zuhause",
    "steps": [
      {
        "title": "Erstgespräch",
        "description": "Wir analysieren Ihre Bedürfnisse und klären alle Details für einen reibungslosen Start."
      },
      {
        "title": "Detailplanung",
        "description": "Wir erstellen einen präzisen Zeitplan mit Kostenrahmen und koordinieren alle Dienstleister."
      },
      {
        "title": "Koordination",
        "description": "Wir stimmen alle Beteiligten ab und behalten jederzeit den Überblick - Sie lehnen sich zurück."
      },
      {
        "title": "Umzugstag",
        "description": "Wir begleiten Sie persönlich am grossen Tag und sorgen für einen pünktlichen, sicheren Ablauf."
      },
      {
        "title": "Abschluss",
        "description": "Wir begleiten Sie bis alles sitzt und stehen auch nach dem Umzug für Fragen zur Verfügung."
      }
    ],
    "bar_title": "Kostenloses Erstgespräch",
    "bar_subtitle": "Jetzt unverbindlich anfragen - wir melden uns innerhalb von 24 Stunden."
  },
  "whoweare": {
    "image_src": "images/team.jpg",
    "image_alt": "ReloPlan Team",
    "title_plain": "Wer",
    "title_gradient": "wir sind",
    "paragraphs": [
      "ReloPlan ist ein motiviertes und kompetentes Team aus drei Spezialisten mit über 30 Jahren Erfahrung, das im Februar 2026 den Startschuss für die eigene Firma gegeben hat. Mit frischen Ideen und viel Leidenschaft vereinen wir Qualität und Verlässlichkeit, um auch komplexe Umzugsprojekte strukturiert und vorausschauend zu begleiten.",
      "Dieser Schritt ist für uns mehr als nur eine Firmengründung - es ist der Beginn einer Reise, auf der wir unsere Expertise bündeln, um dich professionell, zuverlässig und partnerschaftlich zu begleiten.",
      "Was uns auszeichnet, ist unser eingespieltes Miteinander: Wir arbeiten Hand in Hand, denken lösungsorientiert und steuern Prozesse effizient, präzise und mit Blick fürs Detail. Unsere Arbeit ist geprägt von Vertrauen, Offenheit und dem Fokus, für Unternehmen und Institutionen reibungslose Abläufe zu schaffen."
    ],
    "cta": "Lass uns gemeinsam starten."
  },
  "team": {
    "label": "Das Team",
    "title_plain": "Das",
    "title_gradient": "Team",
    "members": [
      {
        "name": "Roger Schwendener",
        "role": "Miteigentümer, Geschäftsführer",
        "description": "Roger verfügt über 15 Jahre Erfahrung im Bereich der Umzugsplanung und ist seit 2010 als Projektleiter tätig. Dank seiner langjährigen Praxis bringt er auch bei komplexen Projekten ein hohes Mass an Struktur, Ruhe und Verlässlichkeit ein. Zu seinen persönlichen Referenzen zählen unter anderem die Universität Bern, das Seespital Horgen, das Bundesamt für Bauten und Logistik sowie Stadtwerk Winterthur.",
        "email": "roger.schwendener@reloplan.ch",
        "image": "images/roger-schwendener.jpg",
        "image_alt": "Portrait von Roger Schwendener",
        "references": [
          "Universität Bern",
          "Seespital Horgen",
          "Bundesamt für Bauten und Logistik",
          "Stadtwerk Winterthur"
        ]
      },
      {
        "name": "Daniel Schmidt",
        "role": "Miteigentümer, Geschäftsführer",
        "description": "Daniel verfügt über zehn Jahre Erfahrung im Bereich der Umzugsplanung und ist seit 2018 als Projektleiter tätig. Besonders schätzt er anspruchsvolle Projekte und fühlt sich auch in hektischen Phasen wohl, in denen Übersicht, Struktur und Entscheidungsfreude gefragt sind. Zu seinen persönlichen Referenzen zählen unter anderem das Kinderspital Zürich, das Inselspital Bern, das Polizei- und Justizzentrum Zürich sowie die Universität Zürich.",
        "email": "daniel.schmidt@reloplan.ch",
        "image": "images/daniel-schmidt.jpg",
        "image_alt": "Portrait von Daniel Schmidt",
        "references": [
          "Kinderspital Zürich",
          "Inselspital Bern",
          "Polizei- und Justizzentrum Zürich",
          "Universität Zürich"
        ]
      },
      {
        "name": "Marco Buser",
        "role": "Projektleiter",
        "description": "Marco steuert mit fundierter Erfahrung in der Umzugsplanung Projekte strukturiert und mit hohem Qualitätsanspruch. Seit 2025 bringt er sich als Projektleiter proaktiv ein und schätzt es, Verantwortung zu übernehmen. Komplexen Herausforderungen begegnet er lösungsorientiert und überzeugt durch seine engagierte Arbeitsweise sowie die Motivation zur stetigen Weiterentwicklung. Zu seinen Referenzen zählen Roche und Endress & Hauser.",
        "email": "marco.buser@reloplan.ch",
        "image": "images/marco-buser.jpg",
        "image_alt": "Portrait von Marco Buser",
        "references": [
          "Roche",
          "Endress & Hauser"
        ]
      }
    ],
    "title_suffix": ""
  },
  "contact": {
    "title_plain": "Nehmen Sie",
    "title_gradient": "Kontakt auf",
    "intro": "",
    "email": "info@reloplan.ch",
    "phone_display": "+41 44 777 29 29",
    "phone_href": "+41447772929",
    "address": "Im Hanfland 7, 8902 Urdorf, Schweiz",
    "linkedin": "reloplan-ag",
    "map_src": "https://maps.google.com/maps?q=Im%20Hanfland%207%2C%208902%20Urdorf%2C%20Schweiz&output=embed"
  },
  "testimonials": {
    "label": "Rezensionen",
    "title_plain": "Was unsere Kunden",
    "title_gradient": "sagen",
    "items": []
  },
  "faq": {
    "label": "FAQ",
    "title_plain": "Noch Fragen?",
    "title_gradient": "wir haben Antworten",
    "items": []
  },
  "cta": {
    "title": "Bereit für Ihren Umzug?",
    "text": "Kontaktieren Sie uns für ein kostenloses Erstgespräch.",
    "btn_text": "Jetzt anfragen",
    "btn_href": "#contact"
  },
  "features": {
    "label": "Unsere Leistungen",
    "title_plain": "Was wir",
    "title_gradient": "bieten",
    "items": []
  },
  "_infoVersion": "reloplan-ch-2026-05-02"
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

function getKV(env) {
  return env.RELOPLAN_KV || env.KV || null;
}

function randomHex(bytes = 32) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return [...a].map((x) => x.toString(16).padStart(2, '0')).join('');
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt, iterations = KDF_ITER) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations, hash: 'SHA-256' }, key, 256);
  return [...new Uint8Array(bits)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.get('cookie') || '').split(';').map((p) => p.trim()).filter(Boolean).map((p) => {
    const i = p.indexOf('=');
    return [p.slice(0, i), decodeURIComponent(p.slice(i + 1))];
  }));
}

async function signSession(payload, secret) {
  const body = btoa(JSON.stringify(payload));
  return `${body}.${await sha256(`${body}.${secret}`)}`;
}

async function verifySession(request, env) {
  const token = parseCookies(request).rp_sid;
  if (!token || !env.SESSION_SECRET) return false;
  const [body, sig] = token.split('.');
  if (!body || !sig || await sha256(`${body}.${env.SESSION_SECRET}`) !== sig) return false;
  try {
    const payload = JSON.parse(atob(body));
    return payload.exp && payload.exp > Date.now();
  } catch {
    return false;
  }
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > 750000) throw new Error('Payload zu gross');
  return text ? JSON.parse(text) : {};
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function fillMissingContent(value, fallback) {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value) || (value.length === 0 && fallback.length > 0)) {
      return { value: clone(fallback), changed: true };
    }
    return { value, changed: false };
  }
  if (fallback && typeof fallback === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { value: clone(fallback), changed: true };
    }
    let changed = false;
    for (const key of Object.keys(fallback)) {
      const merged = fillMissingContent(value[key], fallback[key]);
      if (merged.changed) {
        value[key] = merged.value;
        changed = true;
      }
    }
    return { value, changed };
  }
  if (value === undefined || value === null || (value === '' && fallback !== '')) {
    return { value: fallback, changed: true };
  }
  return { value, changed: false };
}

function applyCurrentFactualContent(content) {
  if (content._infoVersion === DEFAULT_CONTENT._infoVersion) return false;

  content.meta = { ...(content.meta || {}), ...DEFAULT_CONTENT.meta };
  content.hero = { ...(content.hero || {}), subtitle: DEFAULT_CONTENT.hero.subtitle };
  content.about = clone(DEFAULT_CONTENT.about);
  content.whoweare = clone(DEFAULT_CONTENT.whoweare);
  content.team = clone(DEFAULT_CONTENT.team);
  content.contact = { ...(content.contact || {}), ...DEFAULT_CONTENT.contact };
  content.footer = { ...(content.footer || {}), copyright: DEFAULT_CONTENT.footer.copyright };

  if (content.nav && Array.isArray(content.nav.links)) {
    content.nav.links = content.nav.links.map((link) =>
      link && link.href === '#about' ? { ...link, label: 'Umzugsmanagement' } : link
    );
  }

  content._infoVersion = DEFAULT_CONTENT._infoVersion;
  return true;
}

function migrateContent(content) {
  let changed = false;
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    content = clone(DEFAULT_CONTENT);
    changed = true;
  }
  changed = applyCurrentFactualContent(content) || changed;
  const filled = fillMissingContent(content, DEFAULT_CONTENT);
  content = filled.value;
  changed = changed || filled.changed;
  content.contact = content.contact && typeof content.contact === 'object' ? content.contact : {};
  const oldAddress = ['Bahnhofstrasse 10, 8001 Zürich', 'Bahnhofstrasse 10, 8001 ZÃ¼rich', ''];
  const oldPhoneDisplay = ['+41 44 123 45 67', ''];
  const oldPhoneHref = ['+41441234567', ''];
  if (oldAddress.includes(content.contact.address || '') || /Bahnhofstrasse/i.test(content.contact.address || '')) {
    content.contact.address = CURRENT_CONTACT.address;
    changed = true;
  }
  if (oldPhoneDisplay.includes(content.contact.phone_display || '')) {
    content.contact.phone_display = CURRENT_CONTACT.phone_display;
    changed = true;
  }
  if (oldPhoneHref.includes(content.contact.phone_href || '')) {
    content.contact.phone_href = CURRENT_CONTACT.phone_href;
    changed = true;
  }
  if (!content.contact.map_src || /Bahnhofstrasse|8001|Z%C3%BCrich|Z%C3%83%C2%BCrich/i.test(content.contact.map_src)) {
    content.contact.map_src = CURRENT_CONTACT.map_src;
    changed = true;
  }
  if (changed) content._cmsSaved = true;
  return { content, changed };
}

async function handle(request, env, params) {
  const kv = getKV(env);
  const rawPath = params.path || [];
  const path = `/${Array.isArray(rawPath) ? rawPath.join('/') : rawPath}`;
  const method = request.method.toUpperCase();

  if (path === '/content' && method === 'GET') {
    const stored = kv ? await kv.get(CONTENT_KEY, 'json') : null;
    const migrated = migrateContent(stored || DEFAULT_CONTENT);
    if (kv && stored && migrated.changed) await kv.put(CONTENT_KEY, JSON.stringify(migrated.content));
    return json(migrated.content);
  }

  if (path === '/content' && method === 'PUT') {
    if (!kv) return json({ error: 'KV binding RELOPLAN_KV fehlt' }, 500);
    if (!await verifySession(request, env)) return json({ error: 'Nicht angemeldet' }, 401);
    const migrated = migrateContent(await readJson(request));
    const content = migrated.content;
    content._cmsSaved = true;
    await kv.put(CONTENT_KEY, JSON.stringify(content));
    return json({ success: true });
  }

  if (path === '/auth/status' && method === 'GET') {
    const auth = kv ? await kv.get(AUTH_KEY, 'json') : null;
    return json({ isSetup: !!auth, isAuthenticated: await verifySession(request, env) });
  }

  if (path === '/auth/setup' && method === 'POST') {
    if (!kv || !env.SESSION_SECRET) return json({ error: 'RELOPLAN_KV oder SESSION_SECRET fehlt' }, 500);
    if (await kv.get(AUTH_KEY)) return json({ error: 'Bereits eingerichtet' }, 400);
    const body = await readJson(request);
    if (!body.password || body.password.length < 12) return json({ error: 'Passwort zu kurz' }, 400);
    const salt = randomHex(16);
    await kv.put(AUTH_KEY, JSON.stringify({ salt, iterations: KDF_ITER, hash: await hashPassword(body.password, salt) }));
    const migrated = migrateContent(body.content && typeof body.content === 'object' ? body.content : DEFAULT_CONTENT);
    const initialContent = migrated.content;
    initialContent._cmsSaved = true;
    await kv.put(CONTENT_KEY, JSON.stringify(initialContent));
    const session = await signSession({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 }, env.SESSION_SECRET);
    return json({ success: true }, 200, { 'set-cookie': `rp_sid=${encodeURIComponent(session)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}` });
  }

  if (path === '/auth/login' && method === 'POST') {
    if (!kv || !env.SESSION_SECRET) return json({ error: 'RELOPLAN_KV oder SESSION_SECRET fehlt' }, 500);
    const auth = await kv.get(AUTH_KEY, 'json');
    if (!auth) return json({ error: 'Nicht eingerichtet' }, 400);
    const body = await readJson(request);
    if (await hashPassword(body.password || '', auth.salt, auth.iterations) !== auth.hash) return json({ error: 'Falsch' }, 401);
    const session = await signSession({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 }, env.SESSION_SECRET);
    return json({ success: true }, 200, { 'set-cookie': `rp_sid=${encodeURIComponent(session)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}` });
  }

  if (path === '/auth/logout' && method === 'POST') {
    return json({ success: true }, 200, { 'set-cookie': 'rp_sid=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0' });
  }

  if (path === '/auth/reset' && method === 'POST') {
    if (!kv) return json({ error: 'KV binding RELOPLAN_KV fehlt' }, 500);
    if (!await verifySession(request, env)) return json({ error: 'Nicht angemeldet' }, 401);
    await kv.delete(AUTH_KEY);
    return json({ success: true }, 200, { 'set-cookie': 'rp_sid=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0' });
  }

  return json({ error: 'Nicht gefunden' }, 404);
}

export async function onRequest({ request, env, params }) {
  try {
    return await handle(request, env, params);
  } catch (error) {
    return json({ error: error.message || 'Serverfehler' }, 500);
  }
}
