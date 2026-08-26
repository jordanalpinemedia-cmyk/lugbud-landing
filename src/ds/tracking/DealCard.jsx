import Badge from '../core/Badge.jsx';
import Button from '../core/Button.jsx';

export default function DealCard({
  shoe,
  retailer,
  price,
  listPrice,
  endsIn,
  imageLabel = 'shoe · side profile',
  onClick,
  style,
}) {
  const save = listPrice && price ? Math.round(listPrice - price) : null;

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        // Wraps the CTA onto its own line once the row gets too narrow for the
        // shoe name to breathe. Unchanged at the widths the design specifies.
        flexWrap: 'wrap',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-card)',
        padding: 16,
        alignItems: 'center',
        ...style,
      }}
    >
      <div className="lb-imageslot" style={{ width: 104, height: 84, flex: 'none', borderRadius: 'var(--radius-sm)', fontSize: 9 }}>
        {imageLabel}
      </div>

      <div style={{ flex: '1 1 200px', minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {save ? <Badge tone="deal">${save} off</Badge> : null}
          {endsIn ? (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              {endsIn}
            </span>
          ) : null}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: 'var(--ls-title)',
            color: 'var(--text-strong)',
            marginTop: 8,
          }}
        >
          {shoe}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-strong)' }}>${price}</span>
          {listPrice ? (
            <span style={{ fontSize: 13, color: 'var(--text-faint)', textDecoration: 'line-through' }}>${listPrice}</span>
          ) : null}
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>at {retailer}</span>
        </div>
      </div>

      <Button variant="secondary" size="sm" iconRight="external-link" onClick={onClick}>
        See the deal
      </Button>
    </div>
  );
}
