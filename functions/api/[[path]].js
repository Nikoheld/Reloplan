const KDF_ITER = 310000;
const SESSION_TTL_SECONDS = 60 * 60 * 2;
const CONTENT_KEY = 'content';
const AUTH_KEY = 'auth';

const DEFAULT_CONTENT = {
  meta: {
    title: 'ReloPlan AG - Professionelles Umzugsmanagement',
    description: 'ReloPlan AG - Wir planen und steuern deinen Umzug. Von der Konzeption bis zur erfolgreichen Umsetzung.'
  },
  design: { primary_color: '#3b82f6', accent_color: '#f59e0b', font_display: 'Inter', border_radius: 8, section_spacing: 'normal' },
  nav: { links: [{ label: 'Uber uns', href: '#about' }, { label: 'Prozess', href: '#process' }, { label: 'Team', href: '#team' }, { label: 'Kontakt', href: '#contact' }] },
  footer: { tagline: 'Professionelles Umzugsmanagement', copyright: '(c) 2026 ReloPlan AG', credit: '' },
  structure: [{ type: 'hero', active: true }, { type: 'about', active: true }, { type: 'process', active: true }, { type: 'whoweare', active: true }, { type: 'team', active: true }, { type: 'contact', active: true }],
  hero: { badge: 'Schweizer Umzugsspezialist', title_line1: 'Wir planen.', title_line2: 'Du bewegst.', subtitle: 'ReloPlan AG begleitet Sie von der ersten Idee bis zum letzten Karton.', btn_primary: 'Jetzt kontaktieren', btn_primary_href: '#contact', btn_outline: 'Unser Prozess', btn_outline_href: '#process' },
  about: { label: 'Uber uns', title_plain: 'Ihr Umzug', title_gradient: 'unsere Leidenschaft', title_suffix: '', paragraphs: [], stats: [] },
  process: { label: 'Unser Prozess', title_plain: 'In 5 Schritten zu Ihrem', title_gradient: 'neuen Zuhause', steps: [], bar_title: '', bar_subtitle: '' },
  whoweare: { image_src: 'images/team.jpg', image_alt: 'ReloPlan Team', title_plain: 'Wer', title_gradient: 'wir sind', paragraphs: [], cta: '' },
  team: { label: 'Unser Team', title_plain: 'Die Menschen hinter', title_gradient: 'ReloPlan', members: [] },
  contact: { title_plain: 'Nehmen Sie', title_gradient: 'Kontakt auf', intro: '', email: 'info@reloplan.ch', phone_display: '', phone_href: '', address: '', linkedin: 'reloplan-ag', map_src: '' },
  testimonials: { label: 'Rezensionen', title_plain: 'Was unsere Kunden', title_gradient: 'sagen', items: [] },
  faq: { label: 'FAQ', title_plain: 'Noch Fragen?', title_gradient: 'wir haben Antworten', items: [] },
  cta: { title: 'Bereit fur Ihren Umzug?', text: 'Kontaktieren Sie uns fur ein kostenloses Erstgesprach.', btn_text: 'Jetzt anfragen', btn_href: '#contact' },
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

async function handle(request, env, params) {
  const kv = getKV(env);
  const path = `/${(params.path || []).join('/')}`;
  const method = request.method.toUpperCase();

  if (path === '/content' && method === 'GET') {
    const stored = kv ? await kv.get(CONTENT_KEY, 'json') : null;
    return json(stored || DEFAULT_CONTENT);
  }

  if (path === '/content' && method === 'PUT') {
    if (!kv) return json({ error: 'KV binding RELOPLAN_KV fehlt' }, 500);
    if (!await verifySession(request, env)) return json({ error: 'Nicht angemeldet' }, 401);
    const content = await readJson(request);
    await kv.put(CONTENT_KEY, JSON.stringify(content));
    return json({ success: true });
  }

  if (path === '/auth/status' && method === 'GET') {
    const auth = kv ? await kv.get(AUTH_KEY, 'json') : null;
    return json({ isSetup: !!auth, isAuthenticated: await verifySession(request, env) });
  }

  if (path === '/auth/setup' && method === 'POST') {
    if (!kv) return json({ error: 'KV binding RELOPLAN_KV fehlt' }, 500);
    if (await kv.get(AUTH_KEY)) return json({ error: 'Bereits eingerichtet' }, 400);
    const body = await readJson(request);
    if (!body.password || body.password.length < 12) return json({ error: 'Passwort zu kurz' }, 400);
    const salt = randomHex(16);
    await kv.put(AUTH_KEY, JSON.stringify({ salt, iterations: KDF_ITER, hash: await hashPassword(body.password, salt) }));
    await kv.put(CONTENT_KEY, JSON.stringify(DEFAULT_CONTENT));
    const session = await signSession({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 }, env.SESSION_SECRET || randomHex(32));
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

  return json({ error: 'Nicht gefunden' }, 404);
}

export async function onRequest({ request, env, params }) {
  try {
    return await handle(request, env, params);
  } catch (error) {
    return json({ error: error.message || 'Serverfehler' }, 500);
  }
}
