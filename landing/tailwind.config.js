/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rr: {
          bg:           '#000000',
          surface:      '#050a0c',
          's2':         '#0c1418',
          's3':         '#121e24',
          text:         '#e8f8fc',
          muted:        '#7a9aa3',
          border:       '#1a2e36',
          primary:      '#22d3ee',
          'primary-tx': '#021014',
          'primary-dim':'rgba(34,211,238,0.18)',
          accent2:      '#67e8f9',
          'danger-bg':  '#140808',
          'danger-tx':  '#fca5a5',
          'success-bg': '#050f0c',
          'success-tx': '#5eead4',
        },
      },
      fontFamily: {
        display:    ['Rajdhani', 'sans-serif'],
        body:       ['Barlow', 'sans-serif'],
        condensed:  ['"Barlow Condensed"', 'sans-serif'],
      },
      letterSpacing: {
        'display': '-0.04em',
        'heading': '-0.03em',
        'card':    '-0.01em',
        'label':   '0.01em',
        'caption': '0.02em',
        'micro':   '0.05em',
      },
      borderRadius: {
        'sharp': '4px',
        'std':   '8px',
        'cozy':  '10px',
        'card':  '12px',
      },
      boxShadow: {
        'cta':     '0 2px 12px rgba(34,211,238,0.18)',
        'elevated':'0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        'focus':   '0 0 0 3px rgba(34,211,238,0.15)',
      },
      animation: {
        'sweep':     'sweep 4s linear infinite',
        'ping-slow': 'ping 2.4s cubic-bezier(0,0,0.2,1) infinite',
        'fade-up':   'fadeUp 0.6s ease-out both',
        'fade-up-d': 'fadeUp 0.6s ease-out 0.15s both',
        'fade-up-d2':'fadeUp 0.6s ease-out 0.3s both',
      },
      keyframes: {
        sweep: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
