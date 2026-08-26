import Icon from './Icon.jsx';

const TONES = {
  card: {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-hairline)',
    label: 'var(--text-muted)',
    value: 'var(--text-strong)',
  },
  inverse: {
    background: 'var(--surface-inverse)',
    border: '1px solid var(--ink-1)',
    label: 'var(--volt-3)',
    value: 'var(--stone-1)',
  },
  sunken: {
    background: 'var(--surface-sunken)',
    border: '1px solid transparent',
    label: 'var(--text-muted)',
    value: 'var(--text-strong)',
  },
};

const DELTA_COLOR = {
  up: 'var(--status-success)',
  down: 'var(--status-danger)',
  neutral: 'var(--text-muted)',
};

export default function StatTile({
  label,
  value,
  unit,
  delta,
  deltaTone = 'neutral',
  icon,
  tone = 'card',
  style,
}) {
  const t = TONES[tone];

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        padding: 18,
        background: t.background,
        border: t.border,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 'var(--ls-caps)',
          textTransform: 'uppercase',
          color: t.label,
        }}
      >
        {icon ? <Icon name={icon} size={16} /> : null}
        {label}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: 'var(--ls-display)',
            lineHeight: 1,
            color: t.value,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {unit ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: t.label }}>
            {unit}
          </span>
        ) : null}
      </div>

      {delta ? (
        <div style={{ marginTop: 8, fontSize: 13, color: DELTA_COLOR[deltaTone], fontVariantNumeric: 'tabular-nums' }}>
          {delta}
        </div>
      ) : null}
    </div>
  );
}
