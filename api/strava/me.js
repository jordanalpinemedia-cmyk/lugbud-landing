import { athleteFromSession } from '../../lib/session.js';
import { sql } from '../../lib/db.js';

/** Connection state for the landing page. Never returns tokens. */
export default async function handler(req, res) {
  try {
    const athlete = await athleteFromSession(req);
    if (!athlete) return res.status(200).json({ connected: false });

    const shoes = await sql`
      select name, distance_m, retired
        from shoes
       where strava_athlete_id = ${athlete.strava_athlete_id}
       order by distance_m desc
    `;

    return res.status(200).json({
      connected: true,
      firstname: athlete.firstname,
      shoes: shoes.map((s) => ({
        name: s.name,
        miles: Math.round((s.distance_m ?? 0) / 1609.34),
        retired: s.retired,
      })),
    });
  } catch (err) {
    console.error('strava/me failed', err);
    return res.status(500).json({ connected: false });
  }
}
