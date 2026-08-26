import { sql } from './db.js';
import { apiGet } from './strava.js';
import { validAccessToken } from './tokens.js';

const METRES_PER_MILE = 1609.34;
export const toMiles = (m) => Math.round((m ?? 0) / METRES_PER_MILE);

// 200 requests per 15 minutes on a default app. A 90-day backfill is one or
// two pages for most runners, so this cap is generous while still bounding a
// pathological account.
const PAGE_SIZE = 200;
const MAX_PAGES = 5;
const BACKFILL_DAYS = 90;

/** Gear is authoritative for mileage — Strava totals it server-side. */
async function syncShoes(athleteId, token) {
  const detail = await apiGet('/athlete', token);
  const shoes = detail.shoes ?? [];

  for (const shoe of shoes) {
    await sql`
      insert into shoes (strava_gear_id, strava_athlete_id, name, distance_m, retired)
      values (${shoe.id}, ${athleteId}, ${shoe.name ?? null},
              ${shoe.distance ?? 0}, ${shoe.retired ?? false})
      on conflict (strava_gear_id) do update set
        name       = excluded.name,
        distance_m = excluded.distance_m,
        retired    = excluded.retired,
        synced_at  = now()
    `;
  }
  return shoes.length;
}

/**
 * Activities since the newest one already stored, falling back to a 90-day
 * backfill on a first sync. Incremental by default, so a repeat sync costs one
 * request rather than replaying history.
 */
async function syncActivities(athleteId, token) {
  const [latest] = await sql`
    select extract(epoch from max(start_date))::bigint as newest
      from activities where strava_athlete_id = ${athleteId}
  `;

  const after = latest?.newest
    ? Number(latest.newest)
    : Math.floor((Date.now() - BACKFILL_DAYS * 864e5) / 1000);

  let stored = 0;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await apiGet(
      `/athlete/activities?after=${after}&page=${page}&per_page=${PAGE_SIZE}`,
      token,
    );
    if (!batch.length) break;

    for (const a of batch) {
      await sql`
        insert into activities (
          strava_activity_id, strava_athlete_id, name, distance_m,
          moving_time_s, sport_type, gear_id, start_date
        ) values (
          ${a.id}, ${athleteId}, ${a.name ?? null}, ${a.distance ?? null},
          ${a.moving_time ?? null}, ${a.sport_type ?? a.type ?? null},
          ${a.gear_id ?? null}, ${a.start_date ?? null}
        )
        on conflict (strava_activity_id) do update set
          name          = excluded.name,
          distance_m    = excluded.distance_m,
          moving_time_s = excluded.moving_time_s,
          gear_id       = excluded.gear_id
      `;
      stored += 1;
    }

    if (batch.length < PAGE_SIZE) break;

    if (page === MAX_PAGES) {
      // Say so rather than letting a truncated history look complete.
      console.warn(`sync: hit MAX_PAGES for ${athleteId}; history may be partial`);
    }
  }

  return stored;
}

export async function syncAthlete(athlete) {
  const token = await validAccessToken(athlete);
  if (!token) return { revoked: true };

  const shoes = await syncShoes(athlete.strava_athlete_id, token);
  const activities = await syncActivities(athlete.strava_athlete_id, token);

  console.info(`sync: ${athlete.strava_athlete_id} -> ${shoes} shoes, ${activities} activities`);
  return { revoked: false, shoes, activities };
}
