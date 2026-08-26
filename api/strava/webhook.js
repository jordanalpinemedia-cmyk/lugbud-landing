import { forgetAthlete } from '../../lib/forget.js';

/**
 * Strava webhook endpoint.
 *
 * Its real job is deauthorization: someone can revoke access from Strava's own
 * settings and never come back here, and without this we would keep their data
 * indefinitely while promising the opposite.
 *
 * Strava requires HTTP 200 within two seconds and retries at most three times.
 * The delete below is a single indexed cascade over a small table, so it fits
 * the budget comfortably; anything heavier would need to move off this path.
 *
 * Docs: https://developers.strava.com/docs/webhooks/
 */
export default async function handler(req, res) {
  /* --- subscription validation handshake --------------------------------- */
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const expected = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;

    if (!expected) {
      console.error('strava/webhook: STRAVA_WEBHOOK_VERIFY_TOKEN is not set');
      return res.status(500).json({ error: 'not configured' });
    }
    if (mode !== 'subscribe' || token !== expected) {
      console.warn('strava/webhook: validation rejected (mode or token mismatch)');
      return res.status(403).json({ error: 'forbidden' });
    }
    return res.status(200).json({ 'hub.challenge': challenge });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body ?? {};

  try {
    const revoked =
      event.object_type === 'athlete' &&
      event.aspect_type === 'update' &&
      // Strava documents a boolean; tolerate the string form too rather than
      // silently ignoring a revocation over a type mismatch.
      (event.updates?.authorized === false || event.updates?.authorized === 'false');

    if (revoked && event.owner_id) {
      // No deauthorize call back to Strava — they already revoked; that is why
      // this arrived.
      await forgetAthlete(event.owner_id);
    }
  } catch (err) {
    // Still 200. A non-200 buys three retries and then Strava gives up anyway,
    // so a persistent failure needs a human, not a retry loop. Log loudly.
    console.error('strava/webhook: FAILED TO PROCESS EVENT — data may be retained', {
      owner_id: event.owner_id,
      aspect_type: event.aspect_type,
      error: String(err),
    });
  }

  return res.status(200).json({ ok: true });
}
