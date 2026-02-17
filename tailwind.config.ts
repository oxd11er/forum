import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#121417',
        paper: '#ECE8DD',
        amberMuted: '#A0784B',
        burgundyMuted: '#6A3744',
        panel: '#191D22'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        dossier: '0 10px 32px rgba(0,0,0,0.28)'
      }
    }
  },
  plugins: []
};

export default config;
