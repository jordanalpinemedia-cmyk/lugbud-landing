export const WEAR_STOPS = [
  { key: 'fresh', label: 'Fresh', max: 150 },
  { key: 'good', label: 'Good', max: 300 },
  { key: 'worn', label: 'Worn', max: 450 },
  { key: 'retire', label: 'Retire', max: Infinity },
];

/** Wear bucket for a pair, as a fraction of its rated lifespan. */
export function wearStateFor(miles, lifespan = 500) {
  const p = miles / lifespan;
  if (p < 0.3) return 'fresh';
  if (p < 0.6) return 'good';
  if (p < 0.9) return 'worn';
  return 'retire';
}

export const WEAR_COLOR = {
  fresh: 'var(--wear-fresh)',
  good: 'var(--wear-good)',
  worn: 'var(--wear-worn)',
  retire: 'var(--wear-retire)',
};

const BG = {
  fresh: 'var(--wear-fresh-bg)',
  good: 'var(--wear-good-bg)',
  worn: 'var(--wear-worn-bg)',
  retire: 'var(--wear-retire-bg)',
};

export const WEAR_LABEL = { fresh: 'Fresh', good: 'Good', worn: 'Worn', retire: 'Retire' };

export default function WearMeter({
  miles = 0,
  lifespan = 500,
  size = 'md',
  showTicks = true,
  showValue = true,
  style,
}) {
  const state = wearStateFor(miles, lifespan);
  const pct = Math.max(0, Math.min(100, (miles / lifespan) * 100));
  const h = size === 'sm' ? 6 : size === 'lg' ? 14 : 10;

  return (
    <div style={{ ...style }}>
      {showValue ? (
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: size === 'lg' ? 40 : 26,
                lineHeight: 1,
                letterSpacing: 'var(--ls-display)',
                color: 'var(--text-strong)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(miles)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--ls-caps)',
              }}
            >
              mi
            </span>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 'var(--ls-caps)',
              textTransform: 'uppercase',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              background: BG[state],
              color: WEAR_COLOR[state],
            }}
          >
            {WEAR_LABEL[state]}
          </span>
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${Math.round(miles)} of ${lifespan} miles`}
        style={{
          position: 'relative',
          height: h,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-sunken)',
          boxShadow: 'var(--shadow-press)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${pct}%`,
            borderRadius: 'var(--radius-pill)',
            background: WEAR_COLOR[state],
            transition: 'width var(--dur-slow) var(--ease-spring), background var(--dur-base) var(--ease-out)',
          }}
        />
      </div>

      {showTicks ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 'var(--ls-caps)',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          <span>fresh</span>
          <span>good</span>
          <span>worn</span>
          <span>retire {lifespan}</span>
        </div>
      ) : null}
    </div>
  );
}
