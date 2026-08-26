import { sql } from '../../lib/db.js';
import { ATHLETE_CAP, authorizeUrl } from '../../lib/strava.js';
import { athleteFromSession, randomToken, setStateCookie } from '../../lib/session.js';

const origin = (req) => {
  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  return `${proto}://${req.headers.host}`;
};

const seeOther = (res, location, cookies) => {
  if (cookies) res.setHeader('Set-Cookie', cookies);
  res.setHeader('Location', location);
  return res.status(302).end();
};

export default async function handler(req, res) {
  const base = origin(req);

  try {
    // Someone already connected is re-authorising, not taking a new slot, so
    // the cap must not lock them out of their own account.
    const existing = await athleteFromSession(req).catch(() => null);

    if (!existing) {
      const [{ count }] = await sql`select count(*)::int as count from athletes`;

      // Strava caps how many athletes may connect to an app — 1 until you
      // self-upgrade to 10, more only after review. Past the cap Strava shows
      // its own error page, which is a dead end. Stop here instead and hand
      // the visitor back to the waitlist.
      if (count >= ATHLETE_CAP) {
        console.warn(`strava: athlete cap reached (${count}/${ATHLETE_CAP})`);
        return seeOther(res, `${base}/?strava=full`);
      }
    }

    const state = randomToken();
    return seeOther(
      res,
      authorizeUrl({ redirectUri: `${base}/api/strava/callback`, state }),
      [setStateCookie(state)],
    );
  } catch (err) {
    console.error('strava/start failed', err);
    return seeOther(res, `${base}/?strava=error`);
  }
}
