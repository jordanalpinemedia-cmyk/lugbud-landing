import { sql } from '../../lib/db.js';
import { athleteFromSession } from '../../lib/session.js';

/**
 * Hide or restore a shoe in the LugBud locker.
 *
 * Strava is untouched: gear cannot be deleted through the API, and the shoe's
 * mileage still counts toward yearly totals. This only controls whether the
 * pair appears in the locker.
 *
 * POST { gearId: string, hidden: boolean }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const athlete = await athleteFromSession(req);
    if (!athlete) return res.status(401).json({ error: 'Not connected' });

    const { gearId, hidden } = req.body ?? {};
    if (typeof gearId !== 'string' || !gearId || typeof hidden !== 'boolean') {
      return res.status(400).json({ error: 'gearId and hidden are required' });
    }

    // Scoped to the session's athlete, so a guessed gear id cannot reach
    // someone else's locker.
    const rows = await sql`
      update shoes set hidden = ${hidden}
       where strava_gear_id = ${gearId}
         and strava_athlete_id = ${athlete.strava_athlete_id}
      returning strava_gear_id
    `;

    if (!rows.length) return res.status(404).json({ error: 'No such shoe in your locker' });

    return res.status(200).json({ ok: true, gearId, hidden });
  } catch (err) {
    console.error('strava/shoe failed', err);
    return res.status(500).json({ error: 'Could not update that just now.' });
  }
}
