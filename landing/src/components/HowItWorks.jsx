import { useRef, useState, useEffect } from 'react'

// Each line: type determines color, delay is ms after the terminal becomes visible
const LOG_LINES = [
  { type: 'cmd',     text: '$ reelradar --profile instagram.com/natgeo',   delay: 0    },
  { type: 'comment', text: '# detecting posts in active feed...',           delay: 320  },
  { type: 'arrow',   text: '→  found 847 posts',                           delay: 700  },
  { type: 'arrow',   text: '→  metric: Views ↓ (descending)',              delay: 1000 },
  { type: 'comment', text: '# processing...',                               delay: 1300 },
  { type: 'success', text: '✓  sorted 847 posts in 0.8s',                  delay: 1700 },
  { type: 'blank',   text: '',                                              delay: 1900 },
  { type: 'rank',    text: '  #1   44.2M   aurora-borealis-timelapse',     delay: 2100 },
  { type: 'rank',    text: '  #2   12.8M   great-migration-kenya',         delay: 2350 },
  { type: 'rank',    text: '  #3    8.1M   deep-sea-creatures-4k',         delay: 2600 },
  { type: 'rank',    text: '  #4    3.4M   milkyway-sahara-night',         delay: 2850 },
  { type: 'rank',    text: '  #5     847K  arctic-fox-den',                delay: 3100 },
  { type: 'comment', text: '  ...  842 more posts',                        delay: 3250 },
  { type: 'blank',   text: '',                                              delay: 3400 },
  { type: 'arrow',   text: '→  export: natgeo-views.csv',                  delay: 3700 },
  { type: 'success', text: '✓  downloaded · 847 rows · 1.4 KB',           delay: 4100 },
]

const LINE_COLORS = {
  cmd:     '#e8f8fc',
  arrow:   '#7a9aa3',
  success: '#5eead4',
  rank:    '#22d3ee',
  comment: '#1a2e36',
  blank:   'transparent',
}

/* Hook: fires once when element enters viewport */
function useInView(ref, threshold = 0.25) {
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

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="rr-section"
      style={{ background: '#050a0c', borderTop: '1px solid #1a2e36', borderBottom: '1px solid #1a2e36', padding: '6rem 0' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="max-lg:grid-cols-1 rr-howitworks-grid"
          style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
        >

          {/* Left: copy */}
          <div>
            <p style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#22d3ee',
              margin: '0 0 0.75rem',
            }}>
              How it works
            </p>
            <h2 style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#e8f8fc',
              margin: '0 0 1.5rem',
            }}>
              Open it.<br />
              Pick a metric.<br />
              <span style={{ color: '#7a9aa3' }}>Leave in 30 seconds.</span>
            </h2>

            <p style={{
              fontFamily: 'Barlow, sans-serif',
              fontSize: '0.9375rem',
              color: '#7a9aa3',
              lineHeight: 1.7,
              margin: '0 0 2rem',
              maxWidth: '40ch',
            }}>
              ReelRadar runs inside your browser tab. There's no server processing your request, no API rate limit to hit, no quota to exhaust. It reads what your browser already downloaded and reorders it.
            </p>

            {/* Steps summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Navigate to any Instagram or TikTok profile',
                'Open the ReelRadar extension popup',
                'Choose your metric from the dropdown',
                'Posts reorder — export if you need the data',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <span style={{
                    flexShrink: 0,
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: '#0c1418',
                    border: '1px solid #1a2e36',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    fontFamily: '"Barlow Condensed", sans-serif',
                    color: '#22d3ee',
                    letterSpacing: '0.02em',
                    marginTop: '0.05rem',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    fontFamily: 'Barlow, sans-serif',
                    fontSize: '0.875rem',
                    color: '#7a9aa3',
                    lineHeight: 1.55,
                  }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: terminal — only starts animation when scrolled into view */}
          <div>
            <TerminalLog />
          </div>

        </div>
      </div>
    </section>
  )
}

function TerminalLog() {
  const containerRef = useRef(null)
  const started = useInView(containerRef, 0.3)

  return (
    <div
      ref={containerRef}
      style={{
        background: '#000',
        border: '1px solid #1a2e36',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Window bar */}
      <div style={{
        background: '#050a0c',
        borderBottom: '1px solid #1a2e36',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}>
        {['#ff5f57', '#febc2e', '#28c840'].map(c => (
          <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.55 }} />
        ))}
        <span style={{
          marginLeft: 6,
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: '0.65rem',
          color: '#7a9aa3',
          letterSpacing: '0.04em',
          fontWeight: 500,
        }}>
          Terminal — ReelRadar trace
        </span>
      </div>

      {/* Log output */}
      <div style={{ padding: '1.25rem 1.5rem', overflowX: 'auto', minHeight: 280 }}>
        {LOG_LINES.map((line, i) => (
          <LogLine key={i} line={line} started={started} />
        ))}

        {/* Blinking cursor — appears after last line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: '0.35rem',
          opacity: started ? 1 : 0,
          transition: `opacity 0.2s ease ${(LOG_LINES[LOG_LINES.length - 1].delay + 500) / 1000}s`,
        }}>
          <span style={{
            fontFamily: '"SF Mono", "JetBrains Mono", monospace',
            fontSize: '0.72rem',
            color: '#22d3ee',
          }}>$</span>
          <span style={{
            display: 'inline-block',
            width: 7,
            height: '0.85em',
            background: '#22d3ee',
            animation: started ? 'blink 1.1s step-end infinite' : 'none',
            verticalAlign: 'text-bottom',
          }} />
        </div>
      </div>
    </div>
  )
}

function LogLine({ line, started }) {
  if (line.type === 'blank') return <div style={{ height: '0.6rem' }} />

  const color = LINE_COLORS[line.type]
  const delayS = line.delay / 1000

  return (
    <div
      style={{
        fontFamily: '"SF Mono", "JetBrains Mono", "Fira Code", monospace',
        fontSize: '0.72rem',
        lineHeight: 1.85,
        color,
        whiteSpace: 'pre',
        opacity: started ? 1 : 0,
        transform: started ? 'translateX(0)' : 'translateX(-6px)',
        transition: started
          ? `opacity 0.18s ease ${delayS}s, transform 0.18s ease ${delayS}s`
          : 'none',
      }}
    >
      {line.text}
    </div>
  )
}
