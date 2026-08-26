import { useState } from 'react';
import Icon from '../core/Icon.jsx';

export default function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
  fullWidth = true,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);

  return (
    <label style={{ display: 'block', width: fullWidth ? '100%' : undefined, ...style }}>
      {label ? (
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 'var(--ls-caps)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}
        >
          {label}
        </span>
      ) : null}

      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 'var(--control-h-md)',
          padding: '0 18px',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: `1px solid ${
            error ? 'var(--status-danger)' : focus ? 'var(--ink-1)' : 'var(--border-hairline)'
          }`,
          borderRadius: 'var(--radius-pill)',
          boxShadow: focus ? '0 0 0 3px var(--focus-halo)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        }}
      >
        {icon ? <Icon name={icon} size={16} color="var(--text-faint)" /> : null}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--text-strong)',
            letterSpacing: '-0.005em',
            fontVariantNumeric: 'tabular-nums',
          }}
          {...rest}
        />

        {suffix ? (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-faint)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--ls-caps)',
            }}
          >
            {suffix}
          </span>
        ) : null}
      </span>

      {error ? (
        <span style={{ display: 'block', marginTop: 6, fontSize: 13, color: 'var(--status-danger)' }}>{error}</span>
      ) : hint ? (
        <span style={{ display: 'block', marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </label>
  );
}
