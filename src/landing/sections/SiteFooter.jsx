import { monoCaps } from '../typeStyles.js';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { href: '#how', label: 'How it works' },
      { href: '#deals', label: 'Deals' },
      { href: '#dashboard', label: 'Dashboard' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '#waitlist', label: 'Waitlist' },
      { href: '#', label: 'Journal' },
      { href: '#', label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Terms' },
      { href: '#', label: 'Affiliate disclosure' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: 'var(--surface-card)',
        borderTop: '1px solid var(--border-hairline)',
        padding: '52px 0 40px',
      }}
    >
      <div className="lb-wrap lb-footer-grid">
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: '-0.03em',
              color: 'var(--text-strong)',
            }}
          >
            LugBud
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10, maxWidth: 260 }}>
            Built by people who wore out too many shoes.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div style={monoCaps()}>{col.heading}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
              {col.links.map((l) => (
                <a key={l.label} className="lb-navlink" href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
