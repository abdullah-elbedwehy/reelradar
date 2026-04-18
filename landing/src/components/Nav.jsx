const GITHUB_URL = 'https://github.com/your-org/reelradar'

export default function Nav() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #1a2e36',
      }}
    >
      <nav
        className="max-w-5xl mx-auto px-6"
        style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Wordmark */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: '1.05rem',
            letterSpacing: '-0.02em',
            color: '#e8f8fc',
          }}>
            Reel<span style={{ color: '#22d3ee' }}>Radar</span>
          </span>
        </a>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {[
            { label: 'Features',  href: '#features' },
            { label: 'Platforms', href: '#platforms' },
            { label: 'Install',   href: '#install' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                color: '#7a9aa3',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e8f8fc' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#7a9aa3' }}
              className="hidden sm:block"
            >
              {link.label}
            </a>
          ))}

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              color: '#e8f8fc',
              background: 'transparent',
              border: '1px solid #1a2e36',
              borderRadius: '7px',
              padding: '0.3rem 0.75rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#22d3ee'
              e.currentTarget.style.background = 'rgba(34,211,238,0.07)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1a2e36'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </nav>
    </header>
  )
}

function LogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="1.8" fill="#22d3ee" />
      <path d="M 6 14 A 5.7 5.7 0 0 1 14 6" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 3 17 A 9.9 9.9 0 0 1 17 3" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
