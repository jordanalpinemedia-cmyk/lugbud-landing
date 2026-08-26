const normalize = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

export default function SegmentedControl({ options = [], value, onChange, fullWidth, size = 'md', style }) {
  const h = size === 'sm' ? 34 : 44;

  return (
    <div
      style={{
        display: 'inline-flex',
        padding: 3,
        gap: 2,
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-pill)',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
    >
      {options.map(normalize).map((opt) => {
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange && onChange(opt.value)}
            style={{
              flex: fullWidth ? 1 : 'none',
              height: h,
              padding: '0 18px',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-body)',
              fontSize: size === 'sm' ? 13 : 14,
              fontWeight: 600,
              background: on ? 'var(--ink-1)' : 'transparent',
              color: on ? 'var(--stone-1)' : 'var(--text-muted)',
              transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
