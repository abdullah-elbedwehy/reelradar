import { useRef } from 'react'

const GITHUB_URL = 'https://github.com/abdullah-elbedwehy/reelradar'
const DOWNLOAD_URL = 'https://github.com/abdullah-elbedwehy/reelradar/releases/latest/download/reelradar-extension-v9.53.zip'

export default function CallToAction() {
  const ref = useRef(null)

  return (
    <section
      ref={ref}
      style={{
        background: '#050a0c',
        borderTop: '1px solid #1a2e36',
        padding: '6rem 0 7rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow — centered */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} aria-hidden="true" />

      <div
        className="max-w-5xl mx-auto px-6"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Main content — asymmetric: big left, tight right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '3rem',
          alignItems: 'center',
        }} className="max-lg:grid-cols-1">

          {/* Left: the pitch */}
          <div>
            {/* Label */}
            <p style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7a9aa3',
              margin: '0 0 1rem',
            }}>
              Free forever · MIT License
            </p>

            <h2 style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#e8f8fc',
              margin: '0 0 1.25rem',
              maxWidth: '18ch',
            }}>
              You've read enough.<br />
              Go find what <span style={{ color: '#22d3ee' }}>performs.</span>
            </h2>

            <p style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.9375rem',
              color: '#7a9aa3',
              lineHeight: 1.65,
              maxWidth: '46ch',
              margin: '0 0 2rem',
            }}>
              Clone it, load it in Chrome, and navigate to the first profile you want to analyse. Four steps, no account, no subscription, no build step. The code is on GitHub — read it, fork it, ship it.
            </p>

            {/* Inline stats */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
            }}>
              {[
                { value: '2',    label: 'platforms supported' },
                { value: '6',    label: 'sort metrics' },
                { value: '0',    label: 'servers, accounts, or fees' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '2rem',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    color: '#22d3ee',
                    marginBottom: '0.2rem',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.8rem',
                    color: '#7a9aa3',
                    letterSpacing: '0.01em',
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: action cluster */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            minWidth: 220,
          }}>
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#22d3ee',
                color: '#021014',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(34,211,238,0.18)',
                transition: 'filter 0.15s ease, transform 0.08s ease',
                fontFamily: 'Barlow, sans-serif',
                letterSpacing: '0.01em',
                textAlign: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <DownloadIcon />
              Download v9.53
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'transparent',
                color: '#7a9aa3',
                padding: '0.8rem 1.5rem',
                borderRadius: '10px',
                border: '1px solid #1a2e36',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                fontFamily: 'Barlow, sans-serif',
                textAlign: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(34,211,238,0.07)'
                e.currentTarget.style.borderColor = '#22d3ee'
                e.currentTarget.style.color = '#e8f8fc'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#1a2e36'
                e.currentTarget.style.color = '#7a9aa3'
              }}
            >
              <GitHubIcon />
              View on GitHub
            </a>

            {/* Reassurance line */}
            <p style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.75rem',
              color: '#7a9aa3',
              textAlign: 'center',
              margin: '0.25rem 0 0',
              opacity: 0.65,
              lineHeight: 1.5,
            }}>
              No credit card. No account.<br />
              Chrome 120+ · MIT License
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
