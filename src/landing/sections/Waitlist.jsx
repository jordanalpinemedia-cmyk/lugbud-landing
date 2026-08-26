import Button from '../../ds/core/Button.jsx';
import Icon from '../../ds/core/Icon.jsx';
import Input from '../../ds/forms/Input.jsx';
import { monoCaps } from '../typeStyles.js';

export default function Waitlist({ waitlist }) {
  const { email, submitted, sending, error, onEmail, onSubmit } = waitlist;
  const confirmLine = email ? `You're on the list — ${email}` : "You're on the list.";

  return (
    <section id="waitlist" style={{ padding: 'var(--section-y) 0' }}>
      <div
        style={{
          maxWidth: 'var(--container-text)',
          margin: '0 auto',
          padding: '0 var(--gutter-page-lg)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'var(--type-display-1)',
            letterSpacing: 'var(--ls-hero)',
            lineHeight: 1,
            color: 'var(--text-strong)',
            margin: 0,
          }}
        >
          Never pay full price in an emergency
        </h2>

        <p style={{ fontSize: 'var(--type-subhead)', color: 'var(--text-muted)', margin: '18px auto 0', maxWidth: 460 }}>
          Join the waitlist and we&rsquo;ll open your locker first. Free while we&rsquo;re in beta.
        </p>

        {submitted ? (
          <div
            style={{
              marginTop: 28,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 24px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-hairline)',
              animation: 'lb-rise var(--dur-base) var(--ease-out)',
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'var(--wear-fresh)',
                color: 'var(--white)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Icon name="check" size={16} />
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>{confirmLine}</span>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: 28 }}
          >
            <Input
              type="email"
              icon="mail"
              placeholder="you@email.com"
              aria-label="Email address"
              value={email}
              onChange={onEmail}
              disabled={sending}
              fullWidth={false}
              style={{ flex: '0 1 280px' }}
            />
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={sending}
              iconRight={sending ? undefined : 'chevron-right'}
            >
              {sending ? 'Joining\u2026' : 'Join the waitlist'}
            </Button>
          </form>
        )}

        {error ? (
          <div style={{ marginTop: 14, fontSize: 13, color: 'var(--status-danger)' }}>{error}</div>
        ) : null}

        <div style={monoCaps(10, 'var(--text-faint)', { marginTop: 18 })}>
          read-only strava access · cancel any time · no ads
        </div>
      </div>
    </section>
  );
}
