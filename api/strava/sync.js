import { athleteFromSession, clearSessionCookie, destroySession } from '../../lib/session.js';
import { syncAthlete } from '../../lib/sync.js';
import { forgetAthlete } from '../../lib/forget.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const athlete = await athleteFromSession(req);
    if (!athlete) return res.status(401).json({ error: 'Not connected' });

    const result = await syncAthlete(athlete);

    // A revoked athlete has already said no. Honour it here rather than
    // waiting for a webhook that may never have arrived.
    if (result.revoked) {
      await destroySession(req);
      await forgetAthlete(athlete.strava_athlete_id);
      res.setHeader('Set-Cookie', [clearSessionCookie()]);
      return res.status(401).json({ error: 'Strava access was revoked', forgotten: true });
    }

    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error('strava/sync failed', err);
    return res.status(502).json({ error: 'Could not reach Strava just now.' });
  }
}
