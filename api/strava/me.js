import { athleteFromSession } from '../../lib/session.js';
import { buildLocker, DEFAULT_LIFESPAN } from '../../lib/locker.js';

/** Connection state and locker for the landing page. Never returns tokens. */
export default async function handler(req, res) {
  try {
    const athlete = await athleteFromSession(req);
    if (!athlete) return res.status(200).json({ connected: false });

    const lifespan = Number(req.query?.lifespan) || DEFAULT_LIFESPAN;
    const { locker, milesThisYear } = await buildLocker(athlete.strava_athlete_id, lifespan);

    return res.status(200).json({
      connected: true,
      firstname: athlete.firstname,
      locker,
      milesThisYear,
    });
  } catch (err) {
    console.error('strava/me failed', err);
    return res.status(500).json({ connected: false, error: 'Could not load your locker.' });
  }
}
