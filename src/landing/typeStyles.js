/**
 * The uppercase monospace label is the page's most repeated text treatment —
 * eyebrows, meta lines, fine print. One helper keeps them consistent.
 */
export const monoCaps = (fontSize = 'var(--type-micro)', color = 'var(--text-muted)', extra) => ({
  fontFamily: 'var(--font-mono)',
  fontSize,
  letterSpacing: 'var(--ls-caps)',
  textTransform: 'uppercase',
  color,
  ...extra,
});
