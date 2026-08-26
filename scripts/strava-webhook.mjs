/**
 * Manage the Strava webhook subscription.
 *
 *   node scripts/strava-webhook.mjs list
 *   node scripts/strava-webhook.mjs create
 *   node scripts/strava-webhook.mjs delete <id>
 *
 * Reads credentials from .env.local and never prints them.
 * Strava allows exactly one subscription per application.
 */
import { readFileSync } from 'node:fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const VERIFY_TOKEN = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;
const CALLBACK = process.env.STRAVA_CALLBACK_URL
  ?? 'https://lugbud-landing.vercel.app/api/strava/webhook';

const missing = Object.entries({ CLIENT_ID, CLIENT_SECRET, VERIFY_TOKEN })
  .filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error('missing from .env.local:', missing.join(', '));
  process.exit(1);
}

const BASE = 'https://www.strava.com/api/v3/push_subscriptions';
const creds = `client_id=${CLIENT_ID}&client_secret=${encodeURIComponent(CLIENT_SECRET)}`;
const [command, arg] = process.argv.slice(2);

async function list() {
  const r = await fetch(`${BASE}?${creds}`);
  const body = await r.text();
  console.log(`GET ${r.status}`);
  console.log(body);
}

async function create() {
  console.log(`callback_url: ${CALLBACK}`);
  console.log('Strava will GET that URL now and expect the challenge echoed within 2s.\n');
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      callback_url: CALLBACK,
      verify_token: VERIFY_TOKEN,
    }),
  });
  const body = await r.text();
  console.log(`POST ${r.status}`);
  console.log(body);
  if (!r.ok) process.exitCode = 1;
}

async function remove(id) {
  if (!id) { console.error('usage: delete <id>'); process.exit(1); }
  const r = await fetch(`${BASE}/${id}?${creds}`, { method: 'DELETE' });
  console.log(`DELETE ${r.status}`, await r.text());
}

if (command === 'list') await list();
else if (command === 'create') await create();
else if (command === 'delete') await remove(arg);
else { console.error('usage: list | create | delete <id>'); process.exit(1); }
