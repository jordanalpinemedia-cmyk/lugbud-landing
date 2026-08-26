import { useState } from 'react';
import Icon from './Icon.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PAD = { sm: '0 16px', md: '0 22px', lg: '0 28px' };
const FS = { sm: 14, md: 15, lg: 17 };

const LOOK = {
  primary: { background: 'var(--ink-1)', color: 'var(--text-on-inverse)', border: '1px solid var(--ink-1)' },
  accent: { background: 'var(--volt-3)', color: 'var(--text-on-accent)', border: '1px solid var(--volt-3)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-hairline)' },
  ghost: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid transparent' },
  danger: { background: 'var(--clay-3)', color: 'var(--stone-1)', border: '1px solid var(--clay-3)' },
};

const HOVER = {
  primary: { background: 'var(--ink-2)', borderColor: 'var(--ink-2)' },
  accent: { background: 'var(--volt-4)', borderColor: 'var(--volt-4)' },
  secondary: { borderColor: 'var(--stone-4)', boxShadow: 'var(--shadow-1)' },
  ghost: { background: 'var(--surface-sunken)' },
  danger: { background: 'var(--clay-4)', borderColor: 'var(--clay-4)' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  disabled,
  onClick,
  type = 'button',
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const look = LOOK[variant] || LOOK.primary;
  const glyphSize = size === 'sm' ? 16 : 20;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setDown(false);
      }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: H[size],
        padding: PAD[size],
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'var(--font-body)',
        fontSize: FS[size],
        fontWeight: 600,
        letterSpacing: '-0.005em',
        borderRadius: 'var(--radius-pill)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition:
          'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        transform: down && !disabled ? 'scale(var(--press-scale))' : 'none',
        ...look,
        ...(hover && !disabled ? HOVER[variant] : null),
        ...(disabled
          ? { background: 'var(--stone-3)', color: 'var(--text-faint)', borderColor: 'var(--stone-3)' }
          : null),
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={glyphSize} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={glyphSize} /> : null}
    </button>
  );
}
