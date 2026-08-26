import SectionHeader from '../../ds/core/SectionHeader.jsx';
import StatTile from '../../ds/core/StatTile.jsx';
import DealCard from '../../ds/tracking/DealCard.jsx';
import { DEALS, STATS } from '../data.js';

export default function Deals({ showStatsStrip }) {
  return (
    <section id="deals" style={{ padding: 'var(--section-y) 0 var(--section-y-sm)' }}>
      <div className="lb-wrap">
        <SectionHeader
          eyebrow="found this week"
          title="We're already finding them"
          subtitle="Live prices from 30 retailers, matched to the pairs people actually run in. You get the ones that fit your locker."
          size="lg"
        />

        <div style={{ display: 'grid', gap: 12, marginTop: 36 }}>
          {DEALS.map((d) => (
            <DealCard
              key={d.shoe}
              shoe={d.shoe}
              retailer={d.retailer}
              price={d.price}
              listPrice={d.list}
              endsIn={d.ends}
              imageLabel={d.img}
            />
          ))}
        </div>

        {showStatsStrip ? (
          <div className="lb-autofit-sm" style={{ marginTop: 28 }}>
            {STATS.map((s) => (
              <StatTile key={s.l} label={s.l} value={s.v} icon={s.i} tone={s.tone} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
