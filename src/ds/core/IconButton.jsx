import { useState } from 'react';
import Icon from './Icon.jsx';

const S = { sm: 34, md: 40, lg: 48 };

export default function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  disabled,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);

  const base =
    variant === 'solid'
      ? { background: 'var(--ink-1)', color: 'var(--stone-1)', border: '1px solid var(--ink-1)' }
      : variant === 'outline'
        ? { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-hairline)' }
        : { background: 'transparent', color: 'var(--text-strong)', border: '1px solid transparent' };

  const hov =
    variant === 'solid'
      ? { background: 'var(--ink-2)' }
      : variant === 'outline'
        ? { borderColor: 'var(--stone-4)' }
        : { background: 'var(--surface-sunken)' };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: S[size],
        height: S[size],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        ...base,
        ...(hover && !disabled ? hov : null),
        ...(disabled ? { color: 'var(--text-faint)' } : null),
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  );
}
