import { sql } from './db.js';
import { refreshTokens } from './strava.js';

// Strava access tokens last 6 hours. Refresh with an hour to spare rather than
// waiting for expiry, so a sync that starts near the boundary cannot die
// halfway through.
const REFRESH_MARGIN_MS = 60 * 60 * 1000;

/**
 * A usable access token for an athlete, refreshing first if needed.
 *
 * Strava issues a NEW refresh token on every refresh and immediately
 * invalidates the old one. Failing to persist the new one silently bricks the
 * connection six hours later, which is why the write happens before the token
 * is handed back.
 *
 * Returns null if the athlete has revoked access — the caller should treat
 * that as a disconnect rather than retrying.
 */
export async function validAccessToken(athlete) {
  const expiresAt = new Date(athlete.expires_at).getTime();

  if (expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return athlete.access_token;
  }

  try {
    const fresh = await refreshTokens(athlete.refresh_token);

    await sql`
      update athletes set
        access_token  = ${fresh.access_token},
        refresh_token = ${fresh.refresh_token},
        expires_at    = to_timestamp(${fresh.expires_at}),
        updated_at    = now()
      where strava_athlete_id = ${athlete.strava_athlete_id}
    `;

    return fresh.access_token;
  } catch (err) {
    const revoked = /\b(400|401)\b/.test(String(err));
    console.error(
      `tokens: refresh failed for ${athlete.strava_athlete_id}` +
        (revoked ? ' — access appears revoked' : ''),
      err,
    );
    return revoked ? null : athlete.access_token;
  }
}
