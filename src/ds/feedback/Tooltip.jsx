import { useState } from 'react';

export default function Tooltip({ label, children, placement = 'top', style }) {
  const [show, setShow] = useState(false);

  const pos =
    placement === 'bottom'
      ? { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
      : { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show ? (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            ...pos,
            zIndex: 40,
            whiteSpace: 'nowrap',
            background: 'var(--surface-inverse)',
            color: 'var(--text-on-inverse)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: 'var(--shadow-3)',
          }}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
