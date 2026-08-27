import { sql } from './db.js';
import { toMiles } from './sync.js';

/**
 * Rated lifespan, in miles, used until there is a real model->lifespan
 * dataset. This is what the `lifespanMiles` prop on <Landing> now feeds.
 */
export const DEFAULT_LIFESPAN = 500;

const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

/** Weeks of life left at the athlete's recent pace, or null if unknowable. */
function weeksLeft(remainingMiles, milesLast30) {
  if (remainingMiles <= 0) return 0;
  if (!milesLast30) return null; // not in rotation — any estimate would be invented
  const perWeek = milesLast30 / (30 / 7);
  return Math.round(remainingMiles / perWeek);
}

function describeLife(miles, lifespan, milesLast30) {
  const remaining = lifespan - miles;
  if (remaining <= 0) return 'replace now';

  const weeks = weeksLeft(remaining, milesLast30);
  if (weeks === null) return `${remaining} mi left`;
  if (weeks === 0) return 'replace now';
  if (weeks <= 8) return `about ${weeks} week${weeks === 1 ? '' : 's'} left`;
  if (miles / lifespan < 0.35) return 'barely broken in';
  return 'plenty left';
}

export async function buildLocker(athleteId, lifespan = DEFAULT_LIFESPAN, { includeHidden = false } = {}) {
  const shoes = includeHidden
    ? await sql`
        select strava_gear_id, name, distance_m, retired, hidden
          from shoes
         where strava_athlete_id = ${athleteId}
         order by hidden asc, retired asc, distance_m desc
      `
    : await sql`
        select strava_gear_id, name, distance_m, retired, hidden
          from shoes
         where strava_athlete_id = ${athleteId}
           and hidden = false
         order by retired asc, distance_m desc
      `;

  // Counted separately so the locker can offer a way back — a hide with no
  // visible undo is a trap.
  const [{ hidden_count: hiddenCount }] = await sql`
    select count(*)::int as hidden_count
      from shoes
     where strava_athlete_id = ${athleteId} and hidden = true
  `;

  const locker = [];

  for (const shoe of shoes) {
    const [stats] = await sql`
      select
        min(start_date)                                          as first_run,
        count(*) filter (where sport_type ilike '%trail%')::int   as trail_runs,
        count(*)::int                                            as total_runs,
        coalesce(sum(distance_m) filter
          (where start_date > now() - interval '30 days'), 0)    as metres_last_30
        from activities
       where strava_athlete_id = ${athleteId}
         and gear_id = ${shoe.strava_gear_id}
    `;

    const runs = await sql`
      select name, distance_m, moving_time_s, sport_type, start_date
        from activities
       where strava_athlete_id = ${athleteId}
         and gear_id = ${shoe.strava_gear_id}
       order by start_date desc
       limit 3
    `;

    const miles = toMiles(shoe.distance_m);
    const milesLast30 = toMiles(stats?.metres_last_30);
    const surface = stats?.trail_runs > (stats?.total_runs ?? 0) / 2 ? 'trail' : 'road';
    const since = stats?.first_run
      ? `since ${MONTHS[new Date(stats.first_run).getMonth()]}`
      : 'no runs yet';

    locker.push({
      id: shoe.strava_gear_id,
      name: shoe.name,
      meta: `${surface} · ${since}`,
      surface: `${surface} · ${since}`,
      miles,
      life: lifespan,
      left: describeLife(miles, lifespan, milesLast30),
      retired: shoe.retired,
      hidden: shoe.hidden,
      note: shoe.retired
        ? 'Retired on Strava. Kept here for the record.'
        : `${Math.max(0, lifespan - miles)} miles left of an estimated ${lifespan}.`,
      runs: runs.map((r) => ({
        d: new Date(r.start_date).toLocaleDateString('en-US', { weekday: 'short' }),
        t: r.name,
        mi: Number(((r.distance_m ?? 0) / 1609.34).toFixed(1)),
        surface: /trail/i.test(r.sport_type ?? '') ? 'Trail' : 'Road',
        pace: paceFor(r.distance_m, r.moving_time_s),
      })),
    });
  }

  const [totals] = await sql`
    select coalesce(sum(distance_m), 0) as metres
      from activities
     where strava_athlete_id = ${athleteId}
       and start_date >= date_trunc('year', now())
  `;

  return { locker, hiddenCount, milesThisYear: toMiles(totals?.metres) };
}

function paceFor(distanceM, seconds) {
  if (!distanceM || !seconds) return null;
  const secondsPerMile = seconds / (distanceM / 1609.34);
  const min = Math.floor(secondsPerMile / 60);
  const sec = Math.round(secondsPerMile % 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}
