import Icon from '../core/Icon.jsx';

export default function Checkbox({ label, hint, checked, onChange, disabled, style }) {
  return (
    <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 22,
          height: 22,
          flex: 'none',
          marginTop: 1,
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: checked ? 'var(--ink-1)' : disabled ? 'var(--stone-3)' : 'var(--surface-card)',
          border: `1px solid ${checked ? 'var(--ink-1)' : 'var(--border-hairline)'}`,
          color: 'var(--volt-3)',
          transition: 'all var(--dur-fast) var(--ease-out)',
        }}
      >
        {checked ? <Icon name="check" size={16} /> : null}
      </span>

      <span>
        <span style={{ display: 'block', fontSize: 15, color: disabled ? 'var(--text-faint)' : 'var(--text-body)', fontWeight: 500 }}>
          {label}
        </span>
        {hint ? (
          <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{hint}</span>
        ) : null}
      </span>
    </label>
  );
}
