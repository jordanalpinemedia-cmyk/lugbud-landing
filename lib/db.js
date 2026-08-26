import { neon } from '@neondatabase/serverless';

/**
 * Lazy Neon client.
 *
 * `neon()` throws when DATABASE_URL is absent, so calling it at module scope
 * would break any build that runs before the env var is provisioned. A plain
 * function — not a Proxy — keeps the client object introspectable.
 */
let client = null;

export function sql(...args) {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    client = neon(url);
  }
  return client(...args);
}
