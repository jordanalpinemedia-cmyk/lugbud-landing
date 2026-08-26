import { useState } from 'react';
import Icon from './Icon.jsx';

export default function Tag({ children, selected, onClick, onRemove, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const interactive = !!(onClick || onRemove);

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 14px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        fontWeight: 500,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all var(--dur-fast) var(--ease-out)',
        background: selected ? 'var(--ink-1)' : 'var(--surface-card)',
        color: selected ? 'var(--stone-1)' : 'var(--text-body)',
        border: `1px solid ${selected ? 'var(--ink-1)' : hover ? 'var(--stone-4)' : 'var(--border-hairline)'}`,
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove ? (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{ display: 'inline-flex', opacity: 0.6 }}
        >
          <Icon name="x" size={16} />
        </span>
      ) : null}
    </span>
  );
}
