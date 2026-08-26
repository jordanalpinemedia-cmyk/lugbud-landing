import Button from '../../ds/core/Button.jsx';

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#deals', label: 'Deals' },
  { href: '#dashboard', label: 'Dashboard' },
];

export default function SiteHeader({ onJoin }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(247,245,241,.86)',
        backdropFilter: 'var(--blur-glass)',
        WebkitBackdropFilter: 'var(--blur-glass)',
        borderBottom: '1px solid var(--border-hairline)',
      }}
    >
      <div
        className="lb-wrap"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '-0.03em',
            color: 'var(--text-strong)',
          }}
        >
          LugBud
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {LINKS.map((l) => (
            <a key={l.href} className="lb-navlink lb-navlink--desktop" href={l.href}>
              {l.label}
            </a>
          ))}
          <Button variant="primary" size="sm" onClick={onJoin}>
            Join the waitlist
          </Button>
        </nav>
      </div>
    </header>
  );
}
