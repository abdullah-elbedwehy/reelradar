const GITHUB_URL = 'https://github.com/abdullah-elbedwehy/reelradar'
const RELEASE_URL = 'https://github.com/abdullah-elbedwehy/reelradar/releases/latest'
const DOWNLOAD_URL = 'https://github.com/abdullah-elbedwehy/reelradar/releases/latest/download/reelradar-extension-v9.53.zip'

const STEPS = [
  {
    n: '01',
    label: 'Download the latest release',
    cmd: DOWNLOAD_URL,
    lang: 'url',
    note: 'Click the link above to download the ZIP directly, or visit the Releases page on GitHub and download the reelradar-extension-*.zip asset.',
  },
  {
    n: '02',
    label: 'Unzip and open Chrome Extensions',
    cmd: 'chrome://extensions',
    lang: 'url',
    note: "Unzip the downloaded file — you'll get an extension/ folder. Then paste chrome://extensions into Chrome's address bar.",
  },
  {
    n: '03',
    label: 'Enable Developer mode',
    cmd: '→  Toggle "Developer mode" in the top-right corner',
    lang: 'action',
    note: 'Chrome hides the "Load unpacked" button until Developer mode is on. Toggle it once — it stays on.',
  },
  {
    n: '04',
    label: 'Load the extension folder',
    cmd: '→  Click "Load unpacked"  →  select the extension/ folder',
    lang: 'action',
    note: 'Select the extension/ folder from the unzipped download — the one with manifest.json directly inside it. Chrome installs it immediately.',
  },
  {
    n: '05',
    label: 'Pin it to your toolbar',
    cmd: '→  Click the puzzle piece icon  →  pin ReelRadar',
    lang: 'action',
    note: "The puzzle piece (🧩) sits in Chrome's top-right toolbar. Click it, find ReelRadar, and click the pin icon. It'll stay visible in your toolbar.",
  },
  {
    n: '06',
    label: 'Navigate to a profile and open ReelRadar',
    cmd: 'instagram.com/[username]  or  tiktok.com/@[username]',
    lang: 'url',
    note: 'Go to any public profile. Let the posts load, then click the ReelRadar icon in your toolbar, choose a metric, and hit Sort.',
  },
]

const UPDATE_STEPS = [
  { cmd: 'cd reelradar && git pull', note: 'Pull the latest changes from GitHub' },
  { cmd: 'chrome://extensions', note: 'Open the Chrome extensions page' },
  { cmd: '→  Find ReelRadar  →  click the Reload button (↺)', note: 'Chrome picks up the new files instantly — no re-install needed' },
]

const TROUBLESHOOTING = [
  {
    q: '"Load unpacked" button is missing',
    a: 'Developer mode is off. Go to chrome://extensions and toggle the Developer mode switch in the top-right corner to ON.',
  },
  {
    q: 'Extension installed but icon not visible',
    a: "Click the puzzle piece (🧩) in Chrome's toolbar → find ReelRadar → click the pin icon. Pinned extensions always show in the toolbar.",
  },
  {
    q: 'Clicking Sort does nothing on Instagram',
    a: "Make sure you're on a profile page (instagram.com/username), not the home feed or Explore. Scroll down until posts are visible on screen, then try again.",
  },
  {
    q: "TikTok posts aren't all loading",
    a: 'TikTok loads posts in batches as you scroll. Scroll down the profile page slowly until you see the content you want to sort, then open ReelRadar.',
  },
  {
    q: 'View counts show 0 on Instagram Posts',
    a: "Instagram only exposes view counts on Reels, not static photos or carousels. Switch to the Reels tab on the profile for view-based sorting.",
  },
  {
    q: 'The extension broke after an Instagram/TikTok update',
    a: 'Both platforms change their DOM structure and API shapes without notice. Check the GitHub issues page — someone usually reports it and a fix gets pushed within a few days.',
  },
]

export default function Install() {
  return (
    <section id="install" className="rr-section" style={{ padding: '6rem 0 7rem' }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#22d3ee',
            margin: '0 0 0.75rem',
          }}>
            Installation
          </p>
          <h2 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#e8f8fc',
            margin: '0 0 1rem',
          }}>
            Up and running<br />
            <span style={{ color: '#7a9aa3' }}>in six steps. No build step. No Node.js.</span>
          </h2>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.9375rem',
            color: '#7a9aa3',
            lineHeight: 1.65,
            maxWidth: '48ch',
            margin: 0,
          }}>
            ReelRadar is a plain-JavaScript Chrome extension. You load it directly from a folder — no compiler, no package manager, no terminal after the first git clone.
          </p>
        </div>

        {/* Main layout */}
        <div
          className="max-lg:block max-lg:space-y-8 rr-install-grid"
          style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '4rem',
          alignItems: 'start',
        }}
        >

          {/* Steps */}
          <div>
            {STEPS.map((step, i) => (
              <InstallStep key={step.n} step={step} last={i === STEPS.length - 1} />
            ))}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Requirements */}
            <SideCard title="Requirements">
              {[
                'Google Chrome 120 or newer',
                'Git — or a ZIP download from GitHub',
                'No Node.js · No npm · No bundler',
                'No account · No subscription',
              ].map(r => (
                <SideRow key={r} icon="check" text={r} />
              ))}
            </SideCard>

            {/* Permissions explained */}
            <SideCard title="Permissions Chrome will ask about">
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.8rem',
                color: '#7a9aa3',
                lineHeight: 1.55,
                margin: '0 0 0.85rem',
              }}>
                Chrome shows a permissions dialog when you install. Here's what each one does and why it's needed:
              </p>
              {[
                { p: 'activeTab',             why: "Read the URL of your current tab to detect which platform you're on" },
                { p: 'tabs',                  why: 'Send messages between the popup and the content script running in the tab' },
                { p: 'storage',               why: 'Save your last-used sort metric so it persists between sessions' },
                { p: 'webNavigation',         why: 'Detect when you navigate to a new page on Instagram or TikTok (they are SPAs)' },
                { p: 'declarativeNetRequest', why: "Intercept TikTok's post list API response to capture metric data before it's discarded" },
              ].map(({ p, why }) => (
                <div key={p} style={{ marginBottom: '0.65rem' }}>
                  <code style={{
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    fontSize: '0.64rem',
                    color: '#22d3ee',
                    background: 'rgba(34,211,238,0.07)',
                    borderRadius: '4px',
                    padding: '0.1rem 0.4rem',
                    display: 'inline-block',
                    marginBottom: '0.25rem',
                  }}>
                    {p}
                  </code>
                  <p style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.775rem',
                    color: '#7a9aa3',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    {why}
                  </p>
                </div>
              ))}
            </SideCard>

            {/* GitHub CTA */}
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
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(34,211,238,0.18)',
                transition: 'filter 0.15s ease',
                fontFamily: 'Barlow, sans-serif',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
            >
              <DownloadZipIcon />
              Download v9.53 (.zip)
            </a>
            <a
              href={RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'transparent',
                color: '#7a9aa3',
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                border: '1px solid #1a2e36',
                transition: 'border-color 0.15s ease, color 0.15s ease, background 0.15s ease',
                fontFamily: 'Barlow, sans-serif',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#22d3ee'
                e.currentTarget.style.color = '#e8f8fc'
                e.currentTarget.style.background = 'rgba(34,211,238,0.07)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1a2e36'
                e.currentTarget.style.color = '#7a9aa3'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <GitHubIcon />
              All releases
            </a>

          </div>
        </div>

        {/* ── Keeping it updated ── */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '4rem',
          borderTop: '1px solid #1a2e36',
        }}>
          <h3 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#e8f8fc',
            margin: '0 0 0.5rem',
          }}>
            Keeping ReelRadar updated
          </h3>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.9rem',
            color: '#7a9aa3',
            lineHeight: 1.65,
            maxWidth: '52ch',
            margin: '0 0 1.75rem',
          }}>
            When Instagram or TikTok updates their DOM, the extension may stop working. Pull the fix from GitHub and reload in Chrome — takes under a minute.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: 580,
          }}>
            {UPDATE_STEPS.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr',
                  gap: '0 1rem',
                  alignItems: 'center',
                }}
              >
                <span style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#22d3ee',
                  textAlign: 'right',
                }}>
                  {i + 1}
                </span>
                <div
                  className="rr-update-step"
                  style={{
                  background: '#0c1418',
                  border: '1px solid #1a2e36',
                  borderRadius: '7px',
                  padding: '0.5rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
                >
                  <code style={{
                    fontFamily: '"SF Mono", "JetBrains Mono", monospace',
                    fontSize: '0.68rem',
                    color: s.cmd.startsWith('→') ? '#7a9aa3' : s.cmd.startsWith('chrome') ? '#67e8f9' : '#e8f8fc',
                    flex: 1,
                  }}>
                    {!s.cmd.startsWith('→') && !s.cmd.startsWith('chrome') && (
                      <span style={{ color: '#22d3ee', marginRight: '0.4rem' }}>$</span>
                    )}
                    {s.cmd}
                  </code>
                  <span style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.72rem',
                    color: '#7a9aa3',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {s.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Troubleshooting ── */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '4rem',
          borderTop: '1px solid #1a2e36',
        }}>
          <h3 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#e8f8fc',
            margin: '0 0 0.5rem',
          }}>
            Troubleshooting
          </h3>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.9rem',
            color: '#7a9aa3',
            lineHeight: 1.65,
            maxWidth: '52ch',
            margin: '0 0 1.75rem',
          }}>
            Common issues and exactly what to do about them.
          </p>

          <div
            className="max-lg:grid-cols-1 rr-troubleshoot-grid"
            style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            background: '#1a2e36',
            border: '1px solid #1a2e36',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
          >
            {TROUBLESHOOTING.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#050a0c',
                  padding: '1.25rem 1.4rem',
                }}
              >
                <p style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#e8f8fc',
                  margin: '0 0 0.5rem',
                  lineHeight: 1.4,
                  letterSpacing: '-0.01em',
                }}>
                  {item.q}
                </p>
                <p style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.825rem',
                  color: '#7a9aa3',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── Sub-components ── */

function InstallStep({ step, last }) {
  return (
    <div
      className="rr-install-step"
      style={{
      display: 'grid',
      gridTemplateColumns: '2.5rem 1fr',
      gap: '0 1.5rem',
      paddingBottom: last ? 0 : '2.25rem',
      position: 'relative',
    }}
    >
      {!last && (
        <div
          className="rr-install-step-line"
          style={{
          position: 'absolute',
          left: '1.2rem',
          top: '2.5rem',
          bottom: 0,
          width: '1px',
          background: 'linear-gradient(to bottom, #1a2e36, transparent)',
        }}
          aria-hidden="true"
        />
      )}

      {/* Step bubble */}
      <div style={{
        width: '2.4rem',
        height: '2.4rem',
        borderRadius: '50%',
        background: '#050a0c',
        border: '1px solid #1a2e36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#22d3ee',
          letterSpacing: '0.03em',
        }}>
          {step.n}
        </span>
      </div>

      {/* Content */}
      <div style={{ paddingTop: '0.3rem' }}>
        <p style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#e8f8fc',
          margin: '0 0 0.5rem',
        }}>
          {step.label}
        </p>
        <div style={{
          background: '#0c1418',
          border: '1px solid #1a2e36',
          borderRadius: '7px',
          padding: '0.5rem 0.9rem',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
        }}>
          {step.lang === 'shell' && (
            <span style={{ fontFamily: '"SF Mono","JetBrains Mono",monospace', fontSize: '0.65rem', color: '#22d3ee', flexShrink: 0 }}>$</span>
          )}
          <code style={{
            fontFamily: '"SF Mono","JetBrains Mono","Fira Code",monospace',
            fontSize: '0.68rem',
            color: step.lang === 'url' ? '#67e8f9' : step.lang === 'action' ? '#7a9aa3' : '#e8f8fc',
            wordBreak: 'break-all',
          }}>
            {step.cmd}
          </code>
        </div>
        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.825rem',
          color: '#7a9aa3',
          margin: 0,
          lineHeight: 1.6,
        }}>
          {step.note}
        </p>
      </div>
    </div>
  )
}

function SideCard({ title, children }) {
  return (
    <div style={{
      background: '#050a0c',
      border: '1px solid #1a2e36',
      borderRadius: '12px',
      padding: '1.35rem',
    }}>
      <p style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontSize: '0.62rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#7a9aa3',
        margin: '0 0 0.9rem',
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function SideRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.15rem' }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: '0.85rem', color: '#7a9aa3', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

function DownloadZipIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
