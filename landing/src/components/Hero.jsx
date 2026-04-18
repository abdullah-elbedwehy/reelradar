import { useState, useEffect } from 'react'

const GITHUB_URL = 'https://github.com/abdullah-elbedwehy/reelradar'
const DOWNLOAD_URL = 'https://github.com/abdullah-elbedwehy/reelradar/releases/latest/download/reelradar-extension-v9.54.zip'

/* ─────────────────────────────────────────────────────────────
   Animated extension mock
   Shows 5 posts in a shuffled order, then sorts them by views.
   Uses CSS transitions on `top` (absolute positioning) so
   cards smoothly animate to their ranked positions.
───────────────────────────────────────────────────────────── */

const POSTS = [
  { id: 'a', views: '44.2M', label: 'ocean-sunrise-timelapse' },
  { id: 'b', views: '12.8M', label: 'great-migration-kenya'   },
  { id: 'c', views:  '8.1M', label: 'deep-sea-creatures'      },
  { id: 'd', views:  '3.4M', label: 'milkyway-sahara'         },
  { id: 'e', views:   '847K', label: 'arctic-fox-den'         },
]

// Slot = visual position (0 = top). Shuffled initial order.
const INIT   = { a: 2, b: 4, c: 0, d: 3, e: 1 }
const SORTED = { a: 0, b: 1, c: 2, d: 3, e: 4 }

const CARD_H  = 46
const CARD_GAP = 7
const SLOT_H  = CARD_H + CARD_GAP

// Stable thumbnail colors — teal-tinted darks
const THUMB_COLORS = {
  a: ['#0d2535', '#0f3040'],
  b: ['#102030', '#142a3a'],
  c: ['#0c1e2e', '#112535'],
  d: ['#0e2232', '#132d3d'],
  e: ['#091c2a', '#0f2535'],
}

function ExtensionMock() {
  const [slots, setSlots]   = useState(INIT)
  const [phase, setPhase]   = useState('idle')
  // phase: idle | clicking | sorting | sorted | exporting | fading

  useEffect(() => {
    const timers = []
    const run = () => {
      timers.push(setTimeout(() => setPhase('clicking'),  1000))
      timers.push(setTimeout(() => { setPhase('sorting'); setSlots(SORTED) }, 1400))
      timers.push(setTimeout(() => setPhase('sorted'),    2200))
      timers.push(setTimeout(() => setPhase('exporting'), 3600))
      timers.push(setTimeout(() => setPhase('fading'),    5000))
      timers.push(setTimeout(() => {
        setPhase('idle')
        setSlots(INIT)
      }, 5400))
    }
    run()
    const interval = setInterval(run, 6200)
    return () => { timers.forEach(clearTimeout); clearInterval(interval) }
  }, [])

  const isSorted    = phase === 'sorted' || phase === 'exporting' || phase === 'fading'
  const isExporting = phase === 'exporting'
  const isFading    = phase === 'fading'

  return (
    <div
      style={{
        width: 300,
        background: '#050a0c',
        border: '1px solid #1a2e36',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.72), 0 0 0 1px #1a2e36',
        transition: 'opacity 0.4s ease',
        opacity: isFading ? 0 : 1,
        animation: 'popIn 0.35s ease-out both',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      {/* ── Header ── */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid #1a2e36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#050a0c',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MockRadarIcon />
          <span style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#e8f8fc',
            letterSpacing: '-0.02em',
          }}>
            Reel<span style={{ color: '#22d3ee' }}>Radar</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <PillTab label="IG" active />
          <PillTab label="TT" />
        </div>
      </div>

      {/* ── Sort toolbar ── */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #1a2e36',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        background: '#050a0c',
      }}>
        <div style={{
          flex: 1,
          background: '#0c1418',
          border: '1px solid #1a2e36',
          borderRadius: '6px',
          padding: '5px 9px',
          fontSize: '0.72rem',
          color: '#e8f8fc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Barlow, sans-serif',
          fontWeight: 500,
        }}>
          <span>Sort by: <span style={{ color: '#22d3ee' }}>Views</span></span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="#7a9aa3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <button style={{
          background: phase === 'clicking' || phase === 'sorting' ? '#22d3ee' : '#0c1418',
          border: '1px solid',
          borderColor: (phase === 'clicking' || phase === 'sorting') ? '#22d3ee' : '#1a2e36',
          borderRadius: '6px',
          padding: '5px 11px',
          fontSize: '0.72rem',
          fontWeight: 600,
          fontFamily: 'Barlow, sans-serif',
          color: (phase === 'clicking' || phase === 'sorting') ? '#021014' : '#7a9aa3',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}>
          ↓ Sort
        </button>
      </div>

      {/* ── Post cards ── */}
      <div style={{
        padding: '10px 12px',
        position: 'relative',
        height: POSTS.length * SLOT_H - CARD_GAP,
      }}>
        {POSTS.map((post) => {
          const top = slots[post.id] * SLOT_H
          const rank = SORTED[post.id] + 1
          const [c1, c2] = THUMB_COLORS[post.id]

          return (
            <div
              key={post.id}
              style={{
                position: 'absolute',
                top,
                left: 12,
                right: 12,
                height: CARD_H,
                transition: 'top 0.65s cubic-bezier(0.34, 1.04, 0.64, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
              }}
            >
              {/* Rank number */}
              <span style={{
                width: 18,
                flexShrink: 0,
                textAlign: 'right',
                fontSize: '0.6rem',
                fontWeight: 700,
                fontFamily: '"Barlow Condensed", sans-serif',
                color: isSorted ? '#22d3ee' : 'transparent',
                transition: 'color 0.3s ease 0.35s',
                letterSpacing: '0.02em',
              }}>
                #{rank}
              </span>

              {/* Thumbnail */}
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '4px',
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                border: '1px solid rgba(26,46,54,0.8)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* tiny grid lines on thumbnail */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                }} />
              </div>

              {/* Caption mock */}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <div style={{
                  height: 6,
                  borderRadius: 2,
                  background: '#1a2e36',
                  marginBottom: 5,
                  width: '72%',
                  maxWidth: 110,
                }} />
                <div style={{
                  fontSize: '0.6rem',
                  fontFamily: 'Barlow, sans-serif',
                  color: '#7a9aa3',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  opacity: 0.7,
                }}>
                  {post.label}
                </div>
              </div>

              {/* View count */}
              <span style={{
                flexShrink: 0,
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: '"Barlow Condensed", sans-serif',
                letterSpacing: '0.01em',
                color: isSorted ? '#22d3ee' : '#7a9aa3',
                transition: 'color 0.3s ease 0.35s',
              }}>
                {post.views}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Export footer ── */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #1a2e36',
        display: 'flex',
        gap: 6,
        background: '#050a0c',
      }}>
        {['Export CSV', 'Export XLSX'].map((label, i) => (
          <button
            key={label}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid',
              borderColor: isExporting && i === 0 ? '#22d3ee' : '#1a2e36',
              borderRadius: '6px',
              padding: '5px 0',
              fontSize: '0.65rem',
              fontWeight: 600,
              fontFamily: 'Barlow, sans-serif',
              letterSpacing: '0.02em',
              color: isExporting && i === 0 ? '#22d3ee' : '#7a9aa3',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
              animation: isExporting && i === 0 ? 'glow-pulse 1.2s ease infinite' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function MockRadarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="1.4" fill="#22d3ee" />
      <path d="M4 10 A4.2 4.2 0 0 1 10 4" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
      <path d="M2 12 A7.1 7.1 0 0 1 12 2" stroke="#22d3ee" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

function PillTab({ label, active }) {
  return (
    <span style={{
      fontSize: '0.6rem',
      fontWeight: 600,
      fontFamily: '"Barlow Condensed", sans-serif',
      letterSpacing: '0.04em',
      padding: '2px 7px',
      borderRadius: '4px',
      background: active ? 'rgba(34,211,238,0.12)' : 'transparent',
      color: active ? '#22d3ee' : '#7a9aa3',
      border: `1px solid ${active ? 'rgba(34,211,238,0.3)' : '#1a2e36'}`,
    }}>
      {label}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Hero section
───────────────────────────────────────────────────────────── */

export default function Hero() {
  return (
    <section
      className="relative dot-grid scanline"
      style={{ minHeight: 'calc(100vh - 56px)', overflow: 'hidden' }}
    >
      {/* Edge fade on grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #000 100%)',
      }} aria-hidden="true" />

      {/* Ambient cyan glow behind mock */}
      <div style={{
        position: 'absolute',
        right: '10%', top: '45%',
        transform: 'translateY(-50%)',
        width: 380, height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} aria-hidden="true" />

      <div
        className="max-w-5xl mx-auto px-6 rr-hero-grid"
        style={{
          minHeight: 'calc(100vh - 56px)',
          display: 'flex',
          alignItems: 'center',
          gap: '4rem',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── Left: copy ── */}
        <div style={{ flex: '1 1 0', minWidth: 0, animation: 'fadeUp 0.55s ease-out both' }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '0.2rem 0.75rem',
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.2)',
              borderRadius: '9999px',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#22d3ee',
              fontFamily: '"Barlow Condensed", sans-serif',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'glow-pulse 2s ease infinite' }} />
              Free · Open Source · MIT
            </span>
          </div>

          {/* Headline */}
          <h1
            className="rr-hero-headline"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(2.8rem, 5vw, 3.9rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: '#e8f8fc',
              margin: '0 0 1.5rem',
              maxWidth: '13ch',
            }}
          >
            Sort any profile.<br />
            Find what <span style={{ color: '#22d3ee' }}>performs.</span>
          </h1>

          {/* Body */}
          <p style={{
            fontSize: '1rem',
            color: '#7a9aa3',
            lineHeight: 1.65,
            maxWidth: '42ch',
            margin: '0 0 2.25rem',
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 400,
          }}>
            Navigate to any Instagram or TikTok profile. Click sort. Every post reorders by views, likes, comments, shares, or saves — instantly. Export the full list to CSV or XLSX. No account, no backend, no subscription.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={primaryBtn}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <ArrowDownIcon />
              Download Free
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={ghostBtn}
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
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <GitHubIcon />
              View Source
            </a>
          </div>

          {/* Platforms */}
          <p style={{
            fontSize: '0.8rem',
            color: '#7a9aa3',
            fontFamily: 'Barlow, sans-serif',
            margin: 0,
            opacity: 0.75,
            letterSpacing: '0.01em',
          }}>
            Works on Instagram Reels, Posts &amp; TikTok videos · Chrome 120+
          </p>
        </div>

        {/* ── Right: animated extension mock ── */}
        <div
          className="hidden lg:flex items-center justify-center flex-shrink-0 rr-hero-mock-wrapper"
          style={{ animation: 'fadeUp 0.55s ease-out 0.18s both' }}
        >
          {/* Chrome window chrome (pun intended) */}
          <div style={{ position: 'relative' }}>
            {/* Window bar */}
            <div
              className="rr-hero-mock-chrome"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#050a0c',
                border: '1px solid #1a2e36',
                borderBottom: 'none',
                borderRadius: '10px 10px 0 0',
                padding: '8px 12px',
              }}
            >
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.6 }} />
              ))}
              <span style={{
                flex: 1,
                background: '#0c1418',
                borderRadius: '4px',
                padding: '3px 10px',
                fontSize: '0.62rem',
                color: '#7a9aa3',
                fontFamily: '"Barlow Condensed", sans-serif',
                letterSpacing: '0.02em',
                marginLeft: 4,
              }}>
                instagram.com/natgeo
              </span>
            </div>

            {/* Extension popup */}
            <div
              className="rr-hero-mock-popup"
              style={{
                border: '1px solid #1a2e36',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                overflow: 'hidden',
              }}
            >
              <ExtensionMock />
            </div>

            {/* Label */}
            <p style={{
              textAlign: 'center',
              marginTop: '0.85rem',
              fontSize: '0.72rem',
              color: '#7a9aa3',
              fontFamily: 'Barlow, sans-serif',
              letterSpacing: '0.01em',
              opacity: 0.65,
            }}>
              Posts sort in real-time — no page refresh
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 80,
        background: 'linear-gradient(to bottom, transparent, #000)',
        pointerEvents: 'none',
      }} aria-hidden="true" />
    </section>
  )
}

const primaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  background: '#22d3ee',
  color: '#021014',
  padding: '0.65rem 1.35rem',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 700,
  fontSize: '0.9375rem',
  textDecoration: 'none',
  boxShadow: '0 2px 12px rgba(34,211,238,0.18)',
  transition: 'filter 0.15s ease, transform 0.08s ease',
  fontFamily: 'Barlow, sans-serif',
  letterSpacing: '0.01em',
  cursor: 'pointer',
}

const ghostBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  background: 'transparent',
  color: '#7a9aa3',
  padding: '0.65rem 1.35rem',
  borderRadius: '10px',
  border: '1px solid #1a2e36',
  fontWeight: 600,
  fontSize: '0.9375rem',
  textDecoration: 'none',
  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.08s ease',
  fontFamily: 'Barlow, sans-serif',
  cursor: 'pointer',
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
