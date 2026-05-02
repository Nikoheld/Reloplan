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
  meta: {
    title: 'ReloPlan AG - Professionelles Umzugsmanagement',
    description: 'ReloPlan AG - Wir planen und steuern deinen Umzug. Von der Konzeption bis zur erfolgreichen Umsetzung. 30+ Jahre Erfahrung, 3 Spezialisten, 100% Engagement.',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical: '',
    robots: ''
  },
  design: { primary_color: '#3b82f6', accent_color: '#f59e0b', font_display: 'Inter', border_radius: 8, section_spacing: 'normal', preset: 'modern', hero_bg_style: 'gradient', hero_bg_image: '', hero_overlay: 35, hero_pattern: 3, button_style: 'pill', button_fill: 'light', layout_width: 'full', heading_scale: 100, body_scale: 100, animations: 'full', hover_effects: 'on' },
  nav: { links: [{ label: '\u00dcber uns', href: '#about' }, { label: 'Prozess', href: '#process' }, { label: 'Team', href: '#team' }, { label: 'Kontakt', href: '#contact' }] },
  footer: { tagline: 'Professionelles Umzugsmanagement', copyright: '\u00a9 2026 ReloPlan AG', credit: '', show_social: 'true', variant: 'dark', show_admin_link: 'hidden', imprint_label: '', imprint_href: '', privacy_label: '', privacy_href: '' },
  structure: [{ type: 'hero', active: true }, { type: 'about', active: true }, { type: 'process', active: true }, { type: 'whoweare', active: true }, { type: 'team', active: true }, { type: 'contact', active: true }],
  hero: { badge: 'Schweizer Umzugsspezialist', title_line1: 'Wir planen.', title_line2: 'Du bewegst.', subtitle: 'ReloPlan AG begleitet Sie von der ersten Idee bis zum letzten Karton - professionell, pers\u00f6nlich, pr\u00e4zise.', btn_primary: 'Jetzt kontaktieren', btn_primary_href: '#contact', btn_outline: 'Unser Prozess', btn_outline_href: '#process' },
  about: {
    label: '\u00dcber uns',
    title_plain: 'Ihr Umzug',
    title_gradient: 'unsere Leidenschaft',
    title_suffix: '',
    paragraphs: [
      'ReloPlan AG ist Ihr zuverl\u00e4ssiger Partner f\u00fcr jeden Umzug in der Schweiz. Mit \u00fcber 30 Jahren Erfahrung kennen wir jede Herausforderung - und wissen, wie wir sie meistern.',
      'Wir \u00fcbernehmen die gesamte Planung und Koordination Ihres Umzugs: von der Bestandsaufnahme \u00fcber die Abstimmung mit Handwerkern und Transportunternehmen bis hin zur finalen \u00dcbergabe. Sie m\u00fcssen sich um nichts k\u00fcmmern.',
      'Unsere drei Spezialisten bringen nicht nur Fachkenntnis mit, sondern auch das n\u00f6tige Einf\u00fchlungsverm\u00f6gen. Denn ein Umzug ist mehr als Logistik - er ist ein neues Kapitel in Ihrem Leben.'
    ],
    stats: [{ count: 30, suffix: '+', label: 'Jahre Erfahrung' }, { count: 3, suffix: '', label: 'Spezialisten' }, { count: 100, suffix: '%', label: 'Engagement' }]
  },
  process: {
    label: 'Unser Prozess',
    title_plain: 'In 5 Schritten zu Ihrem',
    title_gradient: 'neuen Zuhause',
    steps: [
      { title: 'Erstgespr\u00e4ch', description: 'Wir analysieren Ihre Bed\u00fcrfnisse und kl\u00e4ren alle Details f\u00fcr einen reibungslosen Start.' },
      { title: 'Detailplanung', description: 'Wir erstellen einen pr\u00e4zisen Zeitplan mit Kostenrahmen und koordinieren alle Dienstleister.' },
      { title: 'Koordination', description: 'Wir stimmen alle Beteiligten ab und behalten jederzeit den \u00dcberblick - Sie lehnen sich zur\u00fcck.' },
      { title: 'Umzugstag', description: 'Wir begleiten Sie pers\u00f6nlich am grossen Tag und sorgen f\u00fcr einen p\u00fcnktlichen, sicheren Ablauf.' },
      { title: 'Abschluss', description: 'Wir begleiten Sie bis alles sitzt und stehen auch nach dem Umzug f\u00fcr Fragen zur Verf\u00fcgung.' }
    ],
    bar_title: 'Kostenloses Erstgespr\u00e4ch',
    bar_subtitle: 'Jetzt unverbindlich anfragen - wir melden uns innerhalb von 24 Stunden.'
  },
  whoweare: {
    image_src: 'images/team.jpg',
    image_alt: 'Das ReloPlan-Team bei der Arbeit',
    title_plain: 'Wer',
    title_gradient: 'wir sind',
    paragraphs: [
      'ReloPlan AG wurde gegr\u00fcndet, weil wir selbst erlebt haben, wie stressig ein Umzug sein kann - und wie viel einfacher er mit der richtigen Unterst\u00fctzung wird.',
      'Wir arbeiten nicht mit Standardl\u00f6sungen. Jeder Umzug ist einzigartig - und bekommt von uns die individuelle Aufmerksamkeit, die er verdient.'
    ],
    cta: 'Bereit f\u00fcr Ihren stressfreien Umzug?'
  },
  team: {
    label: 'Unser Team',
    title_plain: 'Die Menschen hinter',
    title_gradient: 'ReloPlan',
    members: [
      { name: 'Roger Schwendener', role: 'Gr\u00fcnder & CEO', description: 'Mit \u00fcber 30 Jahren Erfahrung in der Umzugsbranche steht Roger f\u00fcr Qualit\u00e4t und Zuverl\u00e4ssigkeit.', email: 'r.schwendener@reloplan.ch', image: 'images/roger-schwendener.jpg', image_alt: 'Portrait von Roger Schwendener', references: ['UBS', 'Swisscom', 'ABB'] },
      { name: 'Marco Buser', role: 'Umzugsexperte', description: 'Marco ist unser Spezialist f\u00fcr komplexe Umzugsprojekte. Sein logisches Denken garantiert, dass kein Karton am falschen Ort landet.', email: 'm.buser@reloplan.ch', image: 'images/marco-buser.jpg', image_alt: 'Portrait von Marco Buser', references: ['Nestle', 'Z\u00fchlke', 'SBB'] },
      { name: 'Daniel Schmidt', role: 'Logistikleiter', description: 'Daniel koordiniert alle logistischen Abl\u00e4ufe und sorgt daf\u00fcr, dass jeder Umzug im Zeit- und Kostenrahmen bleibt.', email: 'd.schmidt@reloplan.ch', image: 'images/daniel-schmidt.jpg', image_alt: 'Portrait von Daniel Schmidt', references: ['Migros', 'Coop', 'Post'] }
    ]
  },
  contact: { title_plain: 'Nehmen Sie', title_gradient: 'Kontakt auf', intro: 'Wir freuen uns auf Ihre Anfrage und melden uns innerhalb von 24 Stunden bei Ihnen.', email: 'info@reloplan.ch', phone_display: CURRENT_CONTACT.phone_display, phone_href: CURRENT_CONTACT.phone_href, address: CURRENT_CONTACT.address, linkedin: 'reloplan-ag', map_src: CURRENT_CONTACT.map_src },
  testimonials: { label: 'Rezensionen', title_plain: 'Was unsere Kunden', title_gradient: 'sagen', items: [] },
  faq: { label: 'FAQ', title_plain: 'Noch Fragen?', title_gradient: 'wir haben Antworten', items: [] },
  cta: { title: 'Bereit f\u00fcr Ihren Umzug?', text: 'Kontaktieren Sie uns f\u00fcr ein kostenloses Erstgespr\u00e4ch.', btn_text: 'Jetzt anfragen', btn_href: '#contact' },
  features: { label: 'Unsere Leistungen', title_plain: 'Was wir', title_gradient: 'bieten', items: [] }
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

function migrateContent(content) {
  let changed = false;
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    content = clone(DEFAULT_CONTENT);
    changed = true;
  }
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
