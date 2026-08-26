import { useState } from 'react';

const TONES = {
  card: {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-body)',
  },
  sunken: {
    background: 'var(--surface-sunken)',
    border: '1px solid transparent',
    color: 'var(--text-body)',
  },
  inverse: {
    background: 'var(--surface-inverse)',
    border: '1px solid var(--ink-1)',
    color: 'var(--text-on-inverse)',
  },
  accent: {
    background: 'var(--surface-accent)',
    border: '1px solid var(--volt-3)',
    color: 'var(--ink-1)',
  },
};

export default function Card({
  children,
  tone = 'card',
  padding = 20,
  interactive,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--radius-card)',
        padding,
        cursor: interactive ? 'pointer' : undefined,
        transition:
          'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        ...TONES[tone],
        ...(interactive && hover
          ? { transform: 'translateY(var(--hover-lift))', boxShadow: 'var(--shadow-2)' }
          : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
