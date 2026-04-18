/* ─────────────────────────────────────────────────────────────
   Platform support section
   Technical spec layout — what works where, what metrics exist,
   exactly where to navigate on each platform.
───────────────────────────────────────────────────────────── */

const INSTAGRAM = {
  name: 'Instagram',
  handle: 'instagram.com',
  url: 'instagram.com/[username]',
  color: '#22d3ee',
  content: [
    { label: 'Reels',                    supported: true,  note: 'Full metric access — views, likes, comments, saves' },
    { label: 'Posts (photo & carousel)', supported: true,  note: 'Likes, comments, saves — no view count on static posts' },
    { label: 'Stories',                  supported: false, note: 'Ephemeral — no persistent data to sort' },
    { label: 'Highlights',               supported: false, note: 'Not a sortable feed context' },
  ],
  metrics: ['Views (Reels)', 'Likes', 'Comments', 'Saves', 'Date posted'],
  navigate: [
    'Go to instagram.com/[any username]',
    'Click the Reels tab for video content, or Posts for photos',
    'Let the feed load at least one scroll — then open ReelRadar',
  ],
  note: "ReelRadar reads the data Instagram already loaded in your browser. It doesn't call the Instagram API — it reads the embedded JSON Instagram puts in the page.",
}

const TIKTOK = {
  name: 'TikTok',
  handle: 'tiktok.com',
  url: 'tiktok.com/@[username]',
  color: '#22d3ee',
  content: [
    { label: 'Videos (all)',             supported: true,  note: 'Full metric access — views, likes, comments, shares' },
    { label: 'Liked videos (public)',    supported: true,  note: 'Visible on profiles with public likes' },
    { label: 'Live replays',             supported: false, note: 'Separate content type, not in the main video feed' },
  ],
  metrics: ['Views', 'Likes', 'Comments', 'Shares', 'Date posted'],
  navigate: [
    'Go to tiktok.com/@[any username]',
    'Scroll down slowly to load posts into the feed — TikTok loads lazily',
    'Once you see content, open ReelRadar and sort',
  ],
  note: 'TikTok uses a paginated JSON API under /api/post/item_list/*. ReelRadar uses declarativeNetRequest to intercept these responses and capture the full metric payload before it renders.',
}

function CheckIcon({ ok }) {
  return ok
    ? (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
    : (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a2e36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
}

function PlatformCard({ platform }) {
  return (
    <div style={{
      background: '#050a0c',
      border: '1px solid #1a2e36',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #1a2e36',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <h3 style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#e8f8fc',
            margin: '0 0 0.35rem',
          }}>
            {platform.name}
          </h3>
          <code style={{
            fontFamily: '"SF Mono", "JetBrains Mono", monospace',
            fontSize: '0.7rem',
            color: '#7a9aa3',
            letterSpacing: '0.01em',
          }}>
            {platform.url}
          </code>
        </div>
        {/* Metric pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'flex-end', maxWidth: 180 }}>
          {platform.metrics.map(m => (
            <span key={m} style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '0.58rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'rgba(34,211,238,0.07)',
              color: '#7a9aa3',
              border: '1px solid #1a2e36',
              borderRadius: '4px',
              padding: '0.15rem 0.45rem',
              whiteSpace: 'nowrap',
            }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Content types */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a2e36' }}>
        <p style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#7a9aa3',
          margin: '0 0 0.85rem',
        }}>
          Content types
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {platform.content.map(c => (
            <div key={c.label} style={{ display: 'grid', gridTemplateColumns: '13px 1fr', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ paddingTop: '0.05rem', flexShrink: 0 }}>
                <CheckIcon ok={c.supported} />
              </div>
              <div>
                <span style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: c.supported ? '#e8f8fc' : '#7a9aa3',
                  display: 'block',
                  marginBottom: '0.15rem',
                }}>
                  {c.label}
                </span>
                <span style={{
                  fontFamily: 'Barlow, sans-serif',
                  fontSize: '0.775rem',
                  color: '#7a9aa3',
                  lineHeight: 1.45,
                  opacity: 0.8,
                }}>
                  {c.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Where to navigate */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a2e36' }}>
        <p style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: '0.62rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#7a9aa3',
          margin: '0 0 0.85rem',
        }}>
          Where to navigate
        </p>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {platform.navigate.map((step, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#22d3ee',
                minWidth: 14,
                paddingTop: '0.1rem',
              }}>
                {i + 1}.
              </span>
              <span style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.85rem',
                color: '#7a9aa3',
                lineHeight: 1.5,
              }}>
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Technical note */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{
          background: 'rgba(26, 46, 54, 0.35)',
          borderRadius: '6px',
          padding: '0.65rem 0.85rem',
        }}>
          <p style={{
            fontFamily: '"SF Mono", "JetBrains Mono", monospace',
            fontSize: '0.67rem',
            color: '#7a9aa3',
            lineHeight: 1.75,
            margin: 0,
            opacity: 0.9,
          }}>
            {platform.note}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Platforms() {
  return (
    <section
      id="platforms"
      style={{
        background: '#050a0c',
        borderTop: '1px solid #1a2e36',
        borderBottom: '1px solid #1a2e36',
        padding: '6rem 0',
      }}
    >
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
            Platform support
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
            Instagram &amp; TikTok.<br />
            <span style={{ color: '#7a9aa3' }}>Here's exactly what works on each.</span>
          </h2>
          <p style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '0.9375rem',
            color: '#7a9aa3',
            lineHeight: 1.65,
            maxWidth: '52ch',
            margin: 0,
          }}>
            ReelRadar works differently on each platform because each platform exposes its data differently. No guesswork — here's the full breakdown.
          </p>
        </div>

        {/* Platform cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem',
        }} className="max-lg:grid-cols-1">
          <PlatformCard platform={INSTAGRAM} />
          <PlatformCard platform={TIKTOK} />
        </div>

        {/* Shared limitations */}
        <div style={{
          marginTop: '1.5rem',
          background: '#050a0c',
          border: '1px solid #1a2e36',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.5rem',
        }} className="max-lg:grid-cols-1">
          {[
            {
              label: 'Profile pages only',
              body: "ReelRadar reads the content your browser loaded from the profile feed. It won't work on the Explore page, search results, hashtag pages, or your own home feed.",
            },
            {
              label: 'Let the feed load first',
              body: 'Both platforms load posts lazily as you scroll. If the profile only shows 6 posts, scroll down until more appear before triggering a sort — you only sort what the page has already loaded.',
            },
            {
              label: 'Public profiles only',
              body: "Private accounts that you don't follow won't have accessible post data in the page. ReelRadar only reads what your browser can already see.",
            },
          ].map(item => (
            <div key={item.label}>
              <p style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#e8f8fc',
                margin: '0 0 0.4rem',
              }}>
                {item.label}
              </p>
              <p style={{
                fontFamily: 'Barlow, sans-serif',
                fontSize: '0.825rem',
                color: '#7a9aa3',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
