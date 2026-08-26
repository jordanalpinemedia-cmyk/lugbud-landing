import Button from '../../ds/core/Button.jsx';
import Icon from '../../ds/core/Icon.jsx';
import { STRAVA_ROWS } from '../data.js';
import { monoCaps } from '../typeStyles.js';

export default function Strava() {
  return (
    <section style={{ background: 'var(--surface-inverse)', padding: 'var(--section-y) 0' }}>
      <div className="lb-wrap lb-split-grid">
        <div>
          <div style={monoCaps('var(--type-micro)', 'var(--volt-3)')}>strava, in one tap</div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'var(--type-display-2)',
              letterSpacing: 'var(--ls-display)',
              lineHeight: 'var(--lh-display)',
              color: 'var(--stone-1)',
              margin: '14px 0 0',
            }}
          >
            You never log a mile by hand
          </h2>

          <p style={{ fontSize: 'var(--type-subhead)', color: 'var(--stone-4)', marginTop: 16, maxWidth: 420, lineHeight: 1.45 }}>
            Authorize once. Every run you upload gets matched to the pair you wore, automatically. No app to open, no
            streak to protect.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 28 }}>
            <Button variant="accent" size="lg" icon="activity">
              Connect with Strava
            </Button>
            <span style={monoCaps(10, 'var(--stone-5)')}>takes about 8 seconds</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            background: 'var(--ink-3)',
            border: '1px solid var(--ink-3)',
            borderRadius: 'var(--radius-panel)',
            overflow: 'hidden',
          }}
        >
          {STRAVA_ROWS.map((row) => (
            <div key={row.t} style={{ background: 'var(--ink-1)', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--volt-3)', display: 'flex' }}>
                <Icon name={row.icon} size={20} />
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--stone-1)' }}>{row.t}</div>
                <div style={{ fontSize: 13, color: 'var(--stone-5)', marginTop: 3 }}>{row.b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
