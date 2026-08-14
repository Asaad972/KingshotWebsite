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
        // Steel blue accent family (key kept as "gold" to avoid renaming
        // every class across the app -- it's just the accent token now).
        gold: {
          200: '#d7e3ee',
          300: '#b3cfe3',
          400: '#82aecb',
          500: '#4d84a8',
          600: '#3c6a89',
          700: '#2d5169',
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
