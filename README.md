# Reloplan

Statische Website fuer Cloudflare Pages mit Cloudflare Pages Functions unter `/api/*`.

## Cloudflare Pages

- Build command: leer lassen
- Build output directory: `/`
- Framework preset: `None`
- Node/Express wird nicht gestartet. Die alte `server.js`-Logik laeuft auf Cloudflare als Pages Function in `functions/api/[[path]].js`.

## Bindings

Damit die serverseitigen API-Endpunkte Inhalte und Login-Daten speichern koennen:

- KV namespace binding: `RELOPLAN_KV`
- Environment variable: `SESSION_SECRET` mit einem langen zufaelligen Wert

Ohne KV laeuft die Website statisch weiter, aber serverseitiges Speichern ueber `/api/content` ist deaktiviert.
