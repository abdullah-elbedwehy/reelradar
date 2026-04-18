import { useRef, useState, useEffect } from 'react'

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return inView
}

const FEATURES = [
  {
    n: '01',
    title: 'Sort 800 posts in under a second',
    tag: 'Sort',
    body: "Navigate to any profile — your competitor's, a brand in your niche, an influencer you're studying. Choose a metric: views, likes, comments, shares, saves, or oldest-first. Every post reorders instantly. The top performer is now post #1. You didn't scroll through 800 thumbnails. You didn't open a spreadsheet. You just found the answer.",
    metric: '847 posts · 0.8s',
  },
  {
    n: '02',
    title: 'One export. Every number you need.',
    tag: 'Export',
    body: "Hit Export CSV. You get a spreadsheet with one row per post: the URL, full caption text, views, likes, comments, shares, saves, and post date. All of it. Drop it into Google Sheets, build a pivot table, filter by date range, chart the engagement curve. ReelRadar does the collection — you do the thinking.",
    metric: 'URL · Caption · Views · Likes · Comments · Shares · Saves · Date',
  },
  {
    n: '03',
    title: 'Action buttons, right on the post',
    tag: 'In-Page',
    body: "Hover any thumbnail and ReelRadar places a small action bar directly on it — download the video, copy the link, or inspect the post. No right-click menus, no new tabs, no manual URL digging. It's on the page because that's where you already are.",
    metric: 'Download · Copy link',
  },
  {
    n: '04',
    title: 'Your data never leaves your browser',
    tag: 'Privacy',
    body: "ReelRadar makes zero outbound network requests. Your sort history and preferences are stored in chrome.storage — a sandboxed local store only your browser can read. There is no server to audit, no database to breach, no privacy policy written by lawyers. The entire codebase is public. Read every line if you want to.",
    metric: 'No server · No account · No telemetry',
  },
  {
    n: '05',
    title: 'Load unpacked. Close the terminal.',
    tag: 'No Build Step',
    body: "Clone the repo. Open chrome://extensions. Toggle developer mode. Click Load unpacked. Select the extension/ folder. Done. There is no npm install, no webpack config, no environment variables, no .env file to set up. It runs as plain JavaScript in your browser the same way it has run since Chrome extensions existed.",
    metric: 'git clone → Load unpacked (extension/ folder)',
  },
  {
    n: '06',
    title: 'MIT. Do whatever you want with it.',
    tag: 'License',
    body: "Fork it, sell it, vendor it to a client, add YouTube Shorts support, strip out TikTok entirely. The only requirement is that you keep the license notice. The extension source lives in the extension/ folder — load it unpacked in Chrome to run any fork instantly.",
    metric: 'MIT License',
  },
]

export default function Features() {
  return (
    <section
      id="features"
      style={{ borderTop: '1px solid #1a2e36', paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Section header */}
        <div style={{ marginBottom: '4rem' }}>
          <p style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#22d3ee',
            margin: '0 0 0.75rem',
          }}>
            What it does
          </p>
          <h2 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#e8f8fc',
            margin: 0,
            maxWidth: '20ch',
          }}>
            Built to answer one question:<br />
            <span style={{ color: '#7a9aa3' }}>what content actually works?</span>
          </h2>
        </div>

        {/* Feature rows */}
        <div>
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.n} feature={f} last={i === FEATURES.length - 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ feature, last, index }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '2.5rem 1fr',
        gap: '0 2rem',
        padding: '2rem 0',
        borderBottom: last ? 'none' : '1px solid #1a2e36',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(14px)',
        transition: inView
          ? `opacity 0.45s ease ${index * 0.07}s, transform 0.45s ease ${index * 0.07}s`
          : 'none',
      }}
    >
      {/* Number */}
      <span style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: '#1a2e36',
        letterSpacing: '0.04em',
        paddingTop: '0.25rem',
        lineHeight: 1,
      }}>
        {feature.n}
      </span>

      {/* Content */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
          <h3 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#e8f8fc',
            margin: 0,
          }}>
            {feature.title}
          </h3>
          <span style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            background: 'rgba(34,211,238,0.08)',
            color: '#7a9aa3',
            border: '1px solid #1a2e36',
            borderRadius: '4px',
            padding: '0.15rem 0.5rem',
          }}>
            {feature.tag}
          </span>
        </div>

        <p style={{
          fontFamily: 'Barlow, sans-serif',
          fontSize: '0.9375rem',
          color: '#7a9aa3',
          lineHeight: 1.7,
          margin: '0 0 0.85rem',
          maxWidth: '62ch',
        }}>
          {feature.body}
        </p>

        {/* Metric pill */}
        <code style={{
          display: 'inline-block',
          fontFamily: '"SF Mono", "JetBrains Mono", "Fira Code", monospace',
          fontSize: '0.68rem',
          color: '#22d3ee',
          background: 'rgba(34,211,238,0.06)',
          border: '1px solid rgba(34,211,238,0.15)',
          borderRadius: '4px',
          padding: '0.2rem 0.6rem',
          letterSpacing: '0.02em',
        }}>
          {feature.metric}
        </code>
      </div>
    </div>
  )
}
