/**
 * Apply lib/schema.sql to DATABASE_URL.
 *
 * Statements are idempotent (`create table if not exists`), so re-running is
 * safe. Reads .env.local, which Node does not load on its own.
 */
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, '');
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set — run `vercel env pull .env.local --yes`');
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync('lib/schema.sql', 'utf8');

// Split on semicolons at end of line, ignoring those inside comments.
const statements = schema
  .split('\n')
  .filter((l) => !l.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  const label = statement.slice(0, 60).replace(/\s+/g, ' ');
  await sql.query(statement);
  console.log('✓', label);
}
console.log(`\napplied ${statements.length} statements`);
