export default function Switch({ label, hint, checked, onChange, disabled, style }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        justifyContent: 'space-between',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {label ? (
        <span>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 500, color: disabled ? 'var(--text-faint)' : 'var(--text-body)' }}>
            {label}
          </span>
          {hint ? (
            <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{hint}</span>
          ) : null}
        </span>
      ) : null}

      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 48,
          height: 28,
          flex: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: 3,
          background: disabled ? 'var(--stone-3)' : checked ? 'var(--volt-3)' : 'var(--stone-4)',
          transition: 'background var(--dur-base) var(--ease-out)',
          display: 'flex',
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'var(--white)',
            boxShadow: 'var(--shadow-1)',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform var(--dur-base) var(--ease-spring)',
          }}
        />
      </span>
    </label>
  );
}
