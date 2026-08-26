import { athleteFromSession, clearSessionCookie, destroySession } from '../../lib/session.js';
import { forgetAthlete } from '../../lib/forget.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const athlete = await athleteFromSession(req);

    // Always clear the cookie and report success, even with no session — the
    // caller's intent is "I am disconnected", and that is now true either way.
    if (!athlete) {
      res.setHeader('Set-Cookie', [clearSessionCookie()]);
      return res.status(200).json({ ok: true, forgotten: false });
    }

    await destroySession(req);
    await forgetAthlete(athlete.strava_athlete_id, { accessToken: athlete.access_token });

    res.setHeader('Set-Cookie', [clearSessionCookie()]);
    return res.status(200).json({ ok: true, forgotten: true });
  } catch (err) {
    console.error('strava/disconnect failed', err);
    return res.status(500).json({ error: 'Could not disconnect just now.' });
  }
}
