import { useState } from 'react';
import Icon from '../core/Icon.jsx';

export default function MileageRow({ date, distance, unit = 'mi', shoe, surface, pace, onClick, style }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 4px',
        borderBottom: '1px solid var(--border-quiet)',
        cursor: onClick ? 'pointer' : 'default',
        background: hover && onClick ? 'var(--surface-sunken)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          flex: 'none',
          borderRadius: '50%',
          background: 'var(--surface-sunken)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <Icon name={surface === 'Trail' ? 'route' : 'activity'} size={16} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
          {distance} {unit}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>
          {shoe}
          {surface ? ` · ${surface}` : ''}
        </div>
      </div>

      <div
        style={{
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <div>{date}</div>
        {pace ? (
          <div style={{ marginTop: 2, color: 'var(--text-faint)' }}>
            {pace}/{unit}
          </div>
        ) : null}
      </div>
    </div>
  );
}
