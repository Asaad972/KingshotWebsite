import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Dark navy / charcoal dashboard backgrounds -- lifted a bit
        // lighter across the board per feedback that the site read as too
        // dark, while keeping the same charcoal-navy hue family.
        stone: {
          950: '#0d1119',
          900: '#131a26',
          850: '#182030',
          800: '#1e2738',
          700: '#283449',
          600: '#374863',
          500: '#4f617a',
        },
        // Warm royal-gold accent family -- the primary accent token,
        // paired with `cyan` below for gradients.
        gold: {
          200: '#f5e2a8',
          300: '#f6cf6b',
          400: '#f0b429',
          500: '#d99a1b',
          600: '#b37e15',
          700: '#8f6511',
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
        'gradient-primary': 'linear-gradient(135deg, #f6cf6b 0%, #f0b429 50%, #b37e15 100%)',
        'gradient-primary-soft': 'linear-gradient(135deg, rgba(240,180,41,0.15) 0%, rgba(179,126,21,0.15) 100%)',
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
