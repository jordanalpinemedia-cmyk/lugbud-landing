import { sql } from './db.js';
import { deauthorize } from './strava.js';

/**
 * Forget an athlete completely.
 *
 * The page promises "one tap in settings and we forget the data", so this is a
 * hard delete, not a soft flag. sessions, shoes and activities cascade from
 * the athletes row. shoe_lifespans deliberately carries no athlete reference
 * and is left alone — it holds de-identified model statistics, not records.
 *
 * Returns the number of athlete rows removed (0 if there was nothing to do).
 */
export async function forgetAthlete(athleteId, { accessToken } = {}) {
  // Revoke at Strava first, so disconnecting here also disconnects there and
  // no live credential outlives the row. A failure must not block the delete —
  // keeping data because a remote call failed is the wrong way round.
  if (accessToken) {
    try {
      await deauthorize(accessToken);
    } catch (err) {
      console.error(`forget: strava deauthorize failed for ${athleteId}`, err);
    }
  }

  const rows = await sql`
    delete from athletes where strava_athlete_id = ${athleteId} returning strava_athlete_id
  `;

  console.info(`forget: removed ${rows.length} athlete row(s) for ${athleteId}`);
  return rows.length;
}
