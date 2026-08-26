/**
 * Strava OAuth and API helpers.
 *
 * Docs: https://developers.strava.com/docs/authentication/
 */

const AUTHORIZE = 'https://www.strava.com/oauth/authorize';
const TOKEN = 'https://www.strava.com/oauth/token';
const API = 'https://www.strava.com/api/v3';

// Read-only. `activity:read` excludes privacy-zone data, which is the correct
// default — LugBud needs distance and gear, never routes.
export const SCOPE = 'read,activity:read,profile:read_all';

/** Strava's athlete cap. New apps start at 1; self-upgrade reaches 10. */
export const ATHLETE_CAP = Number(process.env.STRAVA_ATHLETE_CAP ?? 10);

export function authorizeUrl({ redirectUri, state }) {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: SCOPE,
    state,
  });
  return `${AUTHORIZE}?${params}`;
}

async function tokenRequest(body) {
  const response = await fetch(TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      ...body,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`strava token ${response.status}: ${detail}`);
  }
  return response.json();
}

export const exchangeCode = (code) =>
  tokenRequest({ code, grant_type: 'authorization_code' });

export const refreshTokens = (refreshToken) =>
  tokenRequest({ refresh_token: refreshToken, grant_type: 'refresh_token' });

/** Revoke at Strava's end, so disconnecting here also disconnects there. */
export async function deauthorize(accessToken) {
  const response = await fetch('https://www.strava.com/oauth/deauthorize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.ok;
}

export async function apiGet(path, accessToken) {
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`strava GET ${path} -> ${response.status}`);
  }
  return response.json();
}
