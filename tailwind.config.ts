import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './i18n/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          dim: '#8C7527',
        },
        ink: '#0D0D0D',
        graphite: '#1F2023',
        silver: '#A7A9AC',
        bone: '#F3F1EA',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        data: '0.18em',
        wide2: '0.25em',
      },
      transitionTimingFunction: {
        aureon: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        micro: '200ms',
        panel: '400ms',
        camera: '800ms',
      },
      maxWidth: {
        shell: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
