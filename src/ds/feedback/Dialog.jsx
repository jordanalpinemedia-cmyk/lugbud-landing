import IconButton from '../core/IconButton.jsx';

export default function Dialog({ open, title, eyebrow, children, footer, onClose, width = 460 }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--overlay-scrim)' }} />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative',
          width,
          maxWidth: '100%',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-panel)',
          boxShadow: 'var(--shadow-4)',
          padding: 28,
          animation: 'lb-rise var(--dur-slow) var(--ease-out)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            {eyebrow ? (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 'var(--ls-caps)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                }}
              >
                {eyebrow}
              </div>
            ) : null}
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 'var(--ls-title)',
                lineHeight: 1.1,
                color: 'var(--text-strong)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>

          {onClose ? <IconButton icon="x" label="Close" onClick={onClose} size="sm" /> : null}
        </div>

        <div style={{ marginTop: 14, fontSize: 15, color: 'var(--text-body)' }}>{children}</div>

        {footer ? (
          <div style={{ marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
