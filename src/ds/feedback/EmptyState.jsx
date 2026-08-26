import Icon from '../core/Icon.jsx';

export default function EmptyState({ icon = 'footprints', title, body, action, style }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        border: '1px dashed var(--stone-4)',
        borderRadius: 'var(--radius-panel)',
        background: 'var(--surface-card)',
        ...style,
      }}
    >
      <div style={{ display: 'inline-flex', color: 'var(--text-faint)' }}>
        <Icon name={icon} size={32} />
      </div>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 'var(--ls-title)',
          color: 'var(--text-strong)',
          marginTop: 12,
        }}
      >
        {title}
      </div>

      {body ? (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>
          {body}
        </p>
      ) : null}

      {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
    </div>
  );
}
