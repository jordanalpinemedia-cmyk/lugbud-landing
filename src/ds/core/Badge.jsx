const TONE = {
  neutral: { background: 'var(--surface-sunken)', color: 'var(--text-muted)' },
  ink: { background: 'var(--ink-1)', color: 'var(--stone-1)' },
  volt: { background: 'var(--volt-3)', color: 'var(--ink-1)' },
  fresh: { background: 'var(--wear-fresh-bg)', color: 'var(--wear-fresh)' },
  good: { background: 'var(--wear-good-bg)', color: 'var(--volt-5)' },
  worn: { background: 'var(--wear-worn-bg)', color: 'var(--amber-3)' },
  retire: { background: 'var(--wear-retire-bg)', color: 'var(--wear-retire)' },
  deal: { background: 'var(--clay-3)', color: 'var(--stone-1)' },
};

export default function Badge({ children, tone = 'neutral', style, ...rest }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 'var(--ls-caps)',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...(TONE[tone] || TONE.neutral),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
