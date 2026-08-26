import { useState } from 'react';
import Icon from '../core/Icon.jsx';

const normalize = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

export default function Select({
  label,
  value,
  onChange,
  options = [],
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
          height: 'var(--control-h-md)',
          padding: '0 8px 0 18px',
          position: 'relative',
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: `1px solid ${focus ? 'var(--ink-1)' : 'var(--border-hairline)'}`,
          borderRadius: 'var(--radius-pill)',
          transition: 'border-color var(--dur-fast) var(--ease-out)',
        }}
      >
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none',
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--text-strong)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            paddingRight: 28,
          }}
          {...rest}
        >
          {options.map(normalize).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span style={{ position: 'absolute', right: 14, display: 'flex', pointerEvents: 'none', color: 'var(--text-muted)' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      </span>
    </label>
  );
}
