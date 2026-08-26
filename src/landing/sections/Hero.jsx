import Button from '../../ds/core/Button.jsx';
import Icon from '../../ds/core/Icon.jsx';
import Input from '../../ds/forms/Input.jsx';
import Select from '../../ds/forms/Select.jsx';
import { BRANDS } from '../data.js';
import { monoCaps } from '../typeStyles.js';

export default function Hero({ askBrand, brand, onBrand, waitlist }) {
  const { email, submitted, sending, error, onEmail, onSubmit } = waitlist;

  const confirmLine = email
    ? `We'll email ${email} when the beta opens.`
    : "We'll email you when the beta opens.";

  return (
    <section>
      <div className="lb-wrap" style={{ padding: '96px var(--gutter-page-lg) 88px' }}>
        <div className="lb-hero-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ ...monoCaps(), display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--volt-4)' }} />
              <span>waitlist open · beta this fall</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(48px, 5.6vw, 82px)',
                letterSpacing: 'var(--ls-hero)',
                lineHeight: 'var(--lh-hero)',
                color: 'var(--text-strong)',
                margin: 0,
              }}
            >
              Your shoes
              <br />
              die quietly.
            </h1>

            <p style={{ fontSize: 'var(--type-subhead)', color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.45 }}>
              LugBud reads your Strava, counts every mile on every pair, and finds the sale before your midsole gives
              out.
            </p>

            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '18px 22px',
                  borderRadius: 'var(--radius-panel)',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-hairline)',
                  maxWidth: 470,
                  animation: 'lb-rise var(--dur-base) var(--ease-out)',
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    flex: 'none',
                    borderRadius: '50%',
                    background: 'var(--wear-fresh)',
                    color: 'var(--white)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Icon name="check" size={20} />
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 17,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-strong)',
                    }}
                  >
                    You&rsquo;re on the list.
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{confirmLine}</div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4, maxWidth: 470 }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Input
                    type="email"
                    icon="mail"
                    placeholder="you@email.com"
                    aria-label="Email address"
                    value={email}
                    onChange={onEmail}
                    disabled={sending}
                    error={error}
                    style={{ flex: '1 1 190px', minWidth: 0 }}
                  />

                  {askBrand ? (
                    <Select
                      options={BRANDS}
                      value={brand}
                      onChange={onBrand}
                      aria-label="Your main brand"
                      fullWidth={false}
                      style={{ flex: '0 0 auto' }}
                    />
                  ) : null}

                  <Button
                    variant="accent"
                    size="md"
                    type="submit"
                    disabled={sending}
                    iconRight={sending ? undefined : 'chevron-right'}
                  >
                    {sending ? 'Joining\u2026' : 'Join the waitlist'}
                  </Button>
                </div>

                <div style={monoCaps('var(--type-micro)', 'var(--text-faint)')}>
                  one email when the beta opens · nothing else
                </div>
              </form>
            )}
          </div>

          <div
            className="lb-imageslot"
            style={{
              position: 'relative',
              aspectRatio: '16 / 10',
              borderRadius: 'var(--radius-panel)',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-hairline)',
                boxShadow: 'var(--shadow-2)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--text-strong)',
              }}
            >
              <Icon name="play" size={22} />
            </span>

            <div style={{ ...monoCaps(), textAlign: 'center' }}>video placeholder</div>

            <div style={{ fontSize: 13, color: 'var(--text-faint)', textAlign: 'center', maxWidth: 260, lineHeight: 1.4, textTransform: 'none', letterSpacing: 'normal', fontFamily: 'var(--font-body)' }}>
              Product animation goes here — 16:10, autoplay, no sound.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
