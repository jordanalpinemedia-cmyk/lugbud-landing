import crypto from 'node:crypto';
import { sql } from './db.js';

const SESSION_COOKIE = 'lb_session';
const STATE_COOKIE = 'lb_oauth_state';
const SESSION_DAYS = 30;

export const randomToken = () => crypto.randomBytes(32).toString('base64url');

function serialize(name, value, { maxAge, expire = false } = {}) {
  const parts = [
    `${name}=${expire ? '' : value}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    // Lax, not Strict: the browser arrives here via a redirect from Strava,
    // and Strict would withhold the cookie on that navigation.
    'SameSite=Lax',
  ];
  parts.push(expire ? 'Max-Age=0' : `Max-Age=${maxAge}`);
  return parts.join('; ');
}

export function readCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

/* --- oauth state (CSRF) -------------------------------------------------- */
// Double-submit: the state travels to Strava in the URL and stays here in a
// cookie. Only a request carrying both, matching, is genuine. No shared
// secret needed.

export const setStateCookie = (state) =>
  serialize(STATE_COOKIE, state, { maxAge: 600 });

export const clearStateCookie = () => serialize(STATE_COOKIE, '', { expire: true });

export const readState = (req) => readCookie(req, STATE_COOKIE);

/** Constant-time compare, so a mismatch leaks nothing through timing. */
export function statesMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/* --- sessions ------------------------------------------------------------ */

export async function createSession(athleteId) {
  const id = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await sql`
    insert into sessions (id, strava_athlete_id, expires_at)
    values (${id}, ${athleteId}, ${expiresAt.toISOString()})
  `;
  return { id, cookie: serialize(SESSION_COOKIE, id, { maxAge: SESSION_DAYS * 86400 }) };
}

export const clearSessionCookie = () => serialize(SESSION_COOKIE, '', { expire: true });

export async function athleteFromSession(req) {
  const id = readCookie(req, SESSION_COOKIE);
  if (!id) return null;

  const rows = await sql`
    select a.*
      from sessions s
      join athletes a on a.strava_athlete_id = s.strava_athlete_id
     where s.id = ${id}
       and s.expires_at > now()
     limit 1
  `;
  return rows[0] ?? null;
}

export async function destroySession(req) {
  const id = readCookie(req, SESSION_COOKIE);
  if (id) await sql`delete from sessions where id = ${id}`;
}
