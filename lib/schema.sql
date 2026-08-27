-- LugBud schema.
--
-- Retention model: disconnecting deletes everything that identifies an
-- athlete. Every table below cascades from `athletes` EXCEPT shoe_lifespans,
-- which deliberately carries no athlete reference and therefore survives.
--
-- Apply with: npm run db:migrate

create table if not exists athletes (
  strava_athlete_id  bigint       primary key,
  firstname          text,
  lastname           text,
  profile_url        text,
  -- Strava rotates the refresh token on every refresh; the newest one must
  -- overwrite the old or the connection dies silently six hours later.
  access_token       text        not null,
  refresh_token      text        not null,
  expires_at         timestamptz not null,
  scope              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists sessions (
  id                 text        primary key,
  strava_athlete_id  bigint      not null
                       references athletes(strava_athlete_id) on delete cascade,
  created_at         timestamptz not null default now(),
  expires_at         timestamptz not null
);

create index if not exists sessions_athlete_idx on sessions (strava_athlete_id);
create index if not exists sessions_expiry_idx  on sessions (expires_at);

create table if not exists shoes (
  strava_gear_id     text        primary key,
  strava_athlete_id  bigint      not null
                       references athletes(strava_athlete_id) on delete cascade,
  name               text,
  brand              text,
  model              text,
  distance_m         double precision not null default 0,
  retired            boolean     not null default false,
  synced_at          timestamptz not null default now()
);

create index if not exists shoes_athlete_idx on shoes (strava_athlete_id);

create table if not exists activities (
  strava_activity_id bigint      primary key,
  strava_athlete_id  bigint      not null
                       references athletes(strava_athlete_id) on delete cascade,
  name               text,
  distance_m         double precision,
  moving_time_s      integer,
  sport_type         text,
  gear_id            text,
  start_date         timestamptz
);

create index if not exists activities_athlete_idx on activities (strava_athlete_id);
create index if not exists activities_gear_idx    on activities (gear_id);

-- The one table that survives a disconnect.
--
-- No athlete id, no activity id, no gear id, no precise timestamp — nothing
-- that links a row back to a person. This is the lifespan dataset the product
-- is built on ("models with a known lifespan"), kept as a statistical fact
-- rather than a copy of anyone's records.
--
-- recorded_month is truncated to the first of the month on purpose: a precise
-- date plus a model name is a re-identification vector, a month is not.
create table if not exists shoe_lifespans (
  id                bigserial primary key,
  model             text    not null,
  retired_at_miles  integer not null check (retired_at_miles >= 0),
  surface           text,
  recorded_month    date    not null default date_trunc('month', now())
);

create index if not exists shoe_lifespans_model_idx on shoe_lifespans (model);

-- Hiding is a LugBud-side concern: Strava has no notion of it, and gear
-- cannot be deleted through the API. The sync upsert deliberately does not
-- touch this column, so a hidden shoe stays hidden across syncs.
alter table shoes add column if not exists hidden boolean not null default false;
