import Button from '../../ds/core/Button.jsx';
import Icon from '../../ds/core/Icon.jsx';
import IconButton from '../../ds/core/IconButton.jsx';
import SectionHeader from '../../ds/core/SectionHeader.jsx';
import MileageRow from '../../ds/tracking/MileageRow.jsx';
import WearMeter, { WEAR_COLOR, WEAR_LABEL, wearStateFor } from '../../ds/tracking/WearMeter.jsx';
import { FEATURED_DEAL, LOCKER, MILES_THIS_YEAR } from '../data.js';
import { monoCaps } from '../typeStyles.js';

export default function Dashboard({ selected, onSelect, defaultLifespan, strava }) {
  const isLive = Boolean(strava?.connected);
  const locker = isLive ? strava.locker : LOCKER;
  const milesThisYear = isLive
    ? Number(strava.milesThisYear ?? 0).toLocaleString()
    : MILES_THIS_YEAR;

  // A connected athlete with no shoes on Strava is a real state, not a reason
  // to quietly fall back to sample data.
  const empty = isLive && locker.length === 0;
  const sel = empty ? null : locker[Math.min(selected, locker.length - 1)];

  return (
    <section id="dashboard" style={{ padding: 'var(--section-y) 0' }}>
      <div className="lb-wrap">
        <SectionHeader
          eyebrow="your dashboard"
          title="Every pair, one number"
          subtitle="Your runs land from Strava and get assigned to shoes. Tap a pair to see how much life is left and what the replacement costs today."
          size="lg"
        />

        <div className="lb-dash-grid" style={{ marginTop: 36 }}>
          {/* --- the locker ------------------------------------------- */}
          <div
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-panel)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 22px',
                borderBottom: '1px solid var(--border-hairline)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-strong)' }}>
                <Icon name="footprints" size={20} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>
                  The locker
                </span>
              </div>

              {isLive ? (
                <div style={{ ...monoCaps(10, 'var(--moss-3)'), display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--moss-3)' }} />
                  {strava.syncing ? 'syncing…' : 'strava synced'}
                </div>
              ) : (
                <div style={{ ...monoCaps(10, 'var(--text-faint)'), display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--stone-4)' }} />
                  sample data
                </div>
              )}
            </div>

            {locker.map((s, i) => {
              const life = s.life ?? defaultLifespan;
              const state = wearStateFor(s.miles, life);
              const isSelected = i === selected;

              return (
                <div
                  key={s.id ?? s.name}
                  className={`lb-locker-row${isLive ? ' lb-locker-row--live' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(i);
                    }
                  }}
                  style={{
                    padding: '16px 22px',
                    borderBottom: '1px solid var(--border-quiet)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--surface-sunken)' : 'transparent',
                    transition: 'background var(--dur-fast) var(--ease-out)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 15,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-strong)',
                      }}
                    >
                      {s.name}
                    </div>
                    <div style={monoCaps(10, 'var(--text-faint)', { marginTop: 5 })}>{s.meta}</div>
                  </div>

                  <div>
                    <WearMeter miles={s.miles} lifespan={life} size="sm" showValue={false} showTicks={false} />
                    <div style={monoCaps(10, 'var(--text-muted)', { marginTop: 7 })}>{s.left}</div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 6,
                    }}
                  >
                    <span style={monoCaps(10, WEAR_COLOR[state], { fontWeight: 600 })}>
                      {WEAR_LABEL[state]}
                    </span>
                    {isLive ? (
                      <IconButton
                        icon={s.hidden ? 'plus' : 'x'}
                        label={s.hidden ? `Restore ${s.name} to the locker` : `Hide ${s.name} from the locker`}
                        size="sm"
                        onClick={(e) => {
                          // The row itself selects a pair; hiding must not.
                          e.stopPropagation();
                          strava.setShoeHidden(s.id, !s.hidden);
                        }}
                        style={{ flex: 'none', color: 'var(--text-faint)' }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <span style={monoCaps(10, 'var(--text-faint)')}>{milesThisYear} mi logged this year</span>
                {isLive && (strava.hiddenCount > 0 || strava.showHidden) ? (
                  <button
                    type="button"
                    onClick={strava.toggleShowHidden}
                    style={{
                      ...monoCaps(10, 'var(--text-muted)'),
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                    }}
                  >
                    {strava.showHidden
                      ? 'hide put-away pairs'
                      : `${strava.hiddenCount} put away · show`}
                  </button>
                ) : null}
              </div>
              {isLive ? (
                <Button
                  variant="ghost"
                  size="sm"
                  icon="activity"
                  onClick={strava.sync}
                  disabled={strava.syncing}
                >
                  {strava.syncing ? 'Syncing…' : 'Sync now'}
                </Button>
              ) : (
                <Button variant="ghost" size="sm" icon="plus">
                  Add a pair
                </Button>
              )}
            </div>
          </div>

          {/* --- selected pair + its deal ------------------------------ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {empty ? (
              <div
                style={{
                  background: 'var(--surface-card)',
                  border: '1px dashed var(--stone-4)',
                  borderRadius: 'var(--radius-panel)',
                  padding: 32,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-strong)' }}>
                  No shoes on Strava yet
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.45 }}>
                  Add a pair of shoes to your gear in Strava, then hit Sync now. Your
                  mileage follows automatically from there.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-panel)',
                  padding: 24,
                }}
              >
                <div style={monoCaps(10)}>{sel.surface}</div>

                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 'var(--type-heading)',
                    letterSpacing: 'var(--ls-title)',
                    color: 'var(--text-strong)',
                    marginTop: 8,
                  }}
                >
                  {sel.name}
                </div>

                <div style={{ marginTop: 20 }}>
                  <WearMeter miles={sel.miles} lifespan={sel.life ?? defaultLifespan} size="lg" />
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.45 }}>{sel.note}</p>

                <div style={{ height: 1, background: 'var(--border-quiet)', margin: '20px 0 14px' }} />

                <div style={monoCaps(10)}>from strava</div>

                {sel.runs.map((r) => (
                  <MileageRow
                    key={`${r.d}-${r.t}`}
                    date={r.d}
                    distance={r.mi}
                    shoe={r.t}
                    surface={r.surface}
                    pace={r.pace}
                  />
                ))}
              </div>
            )}

            <div style={{ background: 'var(--surface-inverse)', borderRadius: 'var(--radius-panel)', padding: 22 }}>
              <div style={{ ...monoCaps(10, 'var(--volt-3)'), display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="tag" size={16} />
                <span>deal found for you</span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: '-0.02em',
                  color: 'var(--stone-1)',
                  marginTop: 12,
                  lineHeight: 1.2,
                }}
              >
                {FEATURED_DEAL.shoe} — ${FEATURED_DEAL.price} at {FEATURED_DEAL.retailer}
              </div>

              <p style={{ fontSize: 13, color: 'var(--stone-4)', marginTop: 8 }}>{FEATURED_DEAL.blurb}</p>

              <div style={{ marginTop: 16 }}>
                <Button variant="accent" size="md" iconRight="external-link">
                  See the deal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
