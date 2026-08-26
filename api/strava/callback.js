import { sql } from '../../lib/db.js';
import { ATHLETE_CAP, apiGet, exchangeCode } from '../../lib/strava.js';
import {
  clearStateCookie,
  createSession,
  readState,
  statesMatch,
} from '../../lib/session.js';

const origin = (req) => {
  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  return `${proto}://${req.headers.host}`;
};

function seeOther(res, location, cookies) {
  res.setHeader('Set-Cookie', cookies);
  res.setHeader('Location', location);
  return res.status(302).end();
}

export default async function handler(req, res) {
  const base = origin(req);
  const bail = (reason) => seeOther(res, `${base}/?strava=${reason}`, [clearStateCookie()]);

  const { code, state, error } = req.query ?? {};

  // The visitor pressed "Cancel" on Strava's consent screen. Not a failure.
  if (error) {
    return bail(error === 'access_denied' ? 'denied' : 'error');
  }

  if (!code || !statesMatch(state, readState(req))) {
    console.warn('strava/callback: missing code or state mismatch');
    return bail('error');
  }

  try {
    const token = await exchangeCode(code);
    const athlete = token.athlete ?? {};

    if (!athlete.id) throw new Error('token response carried no athlete');

    // Re-check the cap here too: two people can pass the gate in /start
    // concurrently and both arrive holding a valid code.
    const [{ count }] = await sql`
      select count(*)::int as count from athletes
       where strava_athlete_id <> ${athlete.id}
    `;
    if (count >= ATHLETE_CAP) {
      console.warn(`strava/callback: cap reached (${count}/${ATHLETE_CAP}), refusing`);
      return bail('full');
    }

    await sql`
      insert into athletes (
        strava_athlete_id, firstname, lastname, profile_url,
        access_token, refresh_token, expires_at, scope
      ) values (
        ${athlete.id}, ${athlete.firstname ?? null}, ${athlete.lastname ?? null},
        ${athlete.profile ?? null}, ${token.access_token}, ${token.refresh_token},
        to_timestamp(${token.expires_at}), ${token.scope ?? null}
      )
      on conflict (strava_athlete_id) do update set
        firstname     = excluded.firstname,
        lastname      = excluded.lastname,
        profile_url   = excluded.profile_url,
        access_token  = excluded.access_token,
        refresh_token = excluded.refresh_token,
        expires_at    = excluded.expires_at,
        scope         = excluded.scope,
        updated_at    = now()
    `;

    // Pull the shoe rack straight away, so a fresh connection has something
    // real behind it rather than an empty locker.
    try {
      const detail = await apiGet('/athlete', token.access_token);
      for (const shoe of detail.shoes ?? []) {
        await sql`
          insert into shoes (strava_gear_id, strava_athlete_id, name, distance_m, retired)
          values (${shoe.id}, ${athlete.id}, ${shoe.name ?? null},
                  ${shoe.distance ?? 0}, ${shoe.retired ?? false})
          on conflict (strava_gear_id) do update set
            name       = excluded.name,
            distance_m = excluded.distance_m,
            retired    = excluded.retired,
            synced_at  = now()
        `;
      }
    } catch (err) {
      // A failed gear sync must not undo a successful connection.
      console.error('strava/callback: gear sync failed', err);
    }

    const session = await createSession(athlete.id);
    return seeOther(res, `${base}/?strava=connected`, [clearStateCookie(), session.cookie]);
  } catch (err) {
    console.error('strava/callback failed', err);
    return bail('error');
  }
}
