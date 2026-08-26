import { useState } from 'react';
import Badge from '../core/Badge.jsx';
import Icon from '../core/Icon.jsx';
import WearMeter, { wearStateFor } from './WearMeter.jsx';

export default function ShoeCard({
  name,
  nickname,
  miles = 0,
  lifespan = 500,
  surface,
  imageLabel = 'shoe · 3/4 view',
  selected,
  onClick,
  style,
}) {
  const [hover, setHover] = useState(false);
  const state = wearStateFor(miles, lifespan);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-card)',
        padding: 16,
        border: `1px solid ${selected ? 'var(--volt-3)' : 'var(--border-hairline)'}`,
        boxShadow: selected ? '0 0 0 1px var(--volt-3)' : hover ? 'var(--shadow-2)' : 'none',
        transform: hover && onClick ? 'translateY(var(--hover-lift))' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div className="lb-imageslot" style={{ height: 116, borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
        {imageLabel}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: 'var(--ls-title)',
              color: 'var(--text-strong)',
              lineHeight: 1.15,
            }}
          >
            {name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>
            {nickname ? <span>{nickname}</span> : null}
            {nickname && surface ? <span>·</span> : null}
            {surface ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon name="route" size={16} />
                {surface}
              </span>
            ) : null}
          </div>
        </div>

        <Badge tone={state}>{state}</Badge>
      </div>

      <WearMeter miles={miles} lifespan={lifespan} size="sm" showTicks={false} showValue={false} style={{ marginTop: 14 }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{Math.round(miles)} mi</span>
        <span>{Math.max(0, lifespan - Math.round(miles))} mi left</span>
      </div>
    </div>
  );
}
