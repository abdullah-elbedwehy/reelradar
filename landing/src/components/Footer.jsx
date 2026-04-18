const GITHUB_URL = 'https://github.com/abdullah-elbedwehy/reelradar'

export default function Footer() {
  return (
    <footer style={{ background: '#050a0c', borderTop: '1px solid #1a2e36' }}>
      <div className="max-w-5xl mx-auto px-6" style={{ padding: '2.5rem 1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>

          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="1.8" fill="#22d3ee" />
                <path d="M 6 14 A 5.7 5.7 0 0 1 14 6" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 3 17 A 9.9 9.9 0 0 1 17 3" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
              </svg>
              <span style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '-0.02em',
                color: '#e8f8fc',
              }}>
                Reel<span style={{ color: '#22d3ee' }}>Radar</span>
              </span>
            </div>
            <span style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.75rem',
              color: '#7a9aa3',
              letterSpacing: '0.01em',
            }}>
              © {new Date().getFullYear()} ReelRadar Contributors · MIT License
            </span>
          </div>

          {/* Right: links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub',      href: GITHUB_URL },
              { label: 'Issues',      href: `${GITHUB_URL}/issues` },
              { label: 'Extension',   href: `${GITHUB_URL}/tree/main/extension` },
              { label: 'License',     href: `${GITHUB_URL}/blob/main/LICENSE` },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#7a9aa3',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e8f8fc' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#7a9aa3' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  )
}
