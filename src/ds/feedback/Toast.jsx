import Icon from '../core/Icon.jsx';

const TONE = {
  neutral: { icon: 'check', color: 'var(--volt-3)' },
  success: { icon: 'check', color: 'var(--volt-3)' },
  warning: { icon: 'alert-triangle', color: 'var(--amber-2)' },
  danger: { icon: 'alert-triangle', color: 'var(--clay-2)' },
};

export default function Toast({ message, tone = 'neutral', action, onAction, visible = true, style }) {
  if (!visible) return null;
  const t = TONE[tone] || TONE.neutral;

  return (
    <div
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px 12px 14px',
        background: 'var(--surface-inverse)',
        color: 'var(--text-on-inverse)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-3)',
        fontSize: 14,
        fontWeight: 500,
        animation: 'lb-rise var(--dur-base) var(--ease-out)',
        ...style,
      }}
    >
      <Icon name={t.icon} size={20} color={t.color} />
      <span>{message}</span>
      {action ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--volt-3)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0 4px',
          }}
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}
