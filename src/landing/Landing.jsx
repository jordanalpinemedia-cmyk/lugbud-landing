import { useState } from 'react';
import { BRANDS } from './data.js';
import { useWaitlist } from './useWaitlist.js';
import Dashboard from './sections/Dashboard.jsx';
import Deals from './sections/Deals.jsx';
import Hero from './sections/Hero.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import SiteFooter from './sections/SiteFooter.jsx';
import SiteHeader from './sections/SiteHeader.jsx';
import Strava from './sections/Strava.jsx';
import Waitlist from './sections/Waitlist.jsx';

const HEADER_H = 64;

/**
 * The three props below were the design canvas's editor knobs, kept as real
 * props so the page stays configurable:
 *
 *   lifespanMiles  — fallback rated lifespan for a pair that has none of its
 *                    own. Every pair in the demo locker specifies one, so this
 *                    only takes effect for data that omits it.
 *   askBrand       — show the brand picker next to the hero email field.
 *   showStatsStrip — show the stat tiles under the deals list.
 */
export default function Landing({ lifespanMiles = 500, askBrand = true, showStatsStrip = true }) {
  const [selected, setSelected] = useState(0);
  const [brand, setBrand] = useState(BRANDS[0]);

  // The hero form also captures the brand picker; the footer form is email only.
  const heroWaitlist = useWaitlist({ getPayload: () => ({ brand }) });
  const footerWaitlist = useWaitlist();

  const goWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - HEADER_H,
      behavior: 'smooth',
    });
  };

  return (
    <div
      style={{
        background: 'var(--surface-page)',
        color: 'var(--text-body)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
      }}
    >
      <SiteHeader onJoin={goWaitlist} />

      <Hero
        askBrand={askBrand}
        brand={brand}
        onBrand={(e) => setBrand(e.target.value)}
        waitlist={heroWaitlist}
      />

      <Deals showStatsStrip={showStatsStrip} />

      <HowItWorks />

      <Dashboard selected={selected} onSelect={setSelected} defaultLifespan={lifespanMiles} />

      <Strava />

      <Waitlist waitlist={footerWaitlist} />

      <SiteFooter />
    </div>
  );
}
