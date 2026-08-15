import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Dark navy / charcoal dashboard backgrounds
        stone: {
          950: '#080b12',
          900: '#0d121b',
          850: '#111723',
          800: '#161e2c',
          700: '#1f2a3c',
          600: '#2b384e',
          500: '#425065',
        },
        // Vibrant pink/magenta accent family (key kept as "gold" to avoid
        // renaming every class across the app -- it's just the primary
        // accent token now, paired with `cyan` below for gradients).
        gold: {
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
        // Cyan companion accent, used alongside `gold` in gradients and for
        // secondary highlights.
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Cool slate text on dark
        parchment: {
          100: '#eef2f8',
          200: '#d3dbe6',
          300: '#a7b3c4',
          400: '#7b899d',
          500: '#5a6779',
        },
        ember: {
          500: '#e2503f',
          600: '#b83f31',
        },
        moss: {
          500: '#3fae72',
          600: '#308a5b',
        },
        sky: {
          400: '#5fa8f5',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)',
        'gradient-primary-soft': 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(6,182,212,0.15) 100%)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
