const FS = {
  sm: 'var(--type-title)',
  md: 'var(--type-display-3)',
  lg: 'var(--type-display-2)',
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  size = 'md',
  action,
  style,
}) {
  const centered = align === 'center';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        textAlign: align,
        ...style,
      }}
    >
      <div style={{ flex: 1, ...(centered ? { margin: '0 auto', maxWidth: 'var(--container-text)' } : null) }}>
        {eyebrow ? (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 'var(--ls-caps)',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: FS[size],
            letterSpacing: 'var(--ls-display)',
            lineHeight: 'var(--lh-display)',
            color: 'var(--text-strong)',
            margin: 0,
          }}
        >
          {title}
        </h2>

        {subtitle ? (
          <p
            style={{
              marginTop: 12,
              fontSize: 16,
              color: 'var(--text-muted)',
              maxWidth: 560,
              ...(centered ? { marginLeft: 'auto', marginRight: 'auto' } : null),
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action && !centered ? <div style={{ flex: 'none', paddingBottom: 4 }}>{action}</div> : null}
    </div>
  );
}
