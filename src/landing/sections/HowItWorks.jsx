import Card from '../../ds/core/Card.jsx';
import Icon from '../../ds/core/Icon.jsx';
import SectionHeader from '../../ds/core/SectionHeader.jsx';
import { STEPS } from '../data.js';
import { monoCaps } from '../typeStyles.js';

export default function HowItWorks() {
  return (
    <section
      id="how"
      style={{
        padding: 'var(--section-y) 0',
        background: 'var(--surface-card)',
        borderTop: '1px solid var(--border-hairline)',
        borderBottom: '1px solid var(--border-hairline)',
      }}
    >
      <div className="lb-wrap">
        <SectionHeader
          eyebrow="how it works"
          title="Three steps, then nothing"
          subtitle="You set it up once. After that it's an email that shows up at exactly the right time."
          align="center"
          size="lg"
        />

        <div className="lb-autofit" style={{ marginTop: 52 }}>
          {STEPS.map((st) => (
            <Card key={st.n} tone="sunken" padding={26}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-strong)' }}>
                <Icon name={st.icon} size={24} />
                <span style={monoCaps(11, 'var(--text-faint)', { fontWeight: 600 })}>{st.n}</span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'var(--type-heading)',
                  letterSpacing: 'var(--ls-title)',
                  lineHeight: 'var(--lh-title)',
                  color: 'var(--text-strong)',
                  marginTop: 20,
                }}
              >
                {st.t}
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 10 }}>{st.b}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
