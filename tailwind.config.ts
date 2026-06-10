import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF5EE',
          200: '#F5EDE2',
          300: '#EFE2D2',
        },
        blush: {
          50: '#FCF4F4',
          100: '#F9E8E8',
          200: '#F3D5D5',
          300: '#EAB8BC',
          400: '#DE99A2',
        },
        rosegold: {
          300: '#D9A8A0',
          400: '#C98B82',
          500: '#B76E79',
          600: '#A05A66',
          700: '#854A55',
        },
        cocoa: {
          400: '#8C7B72',
          500: '#6E5D54',
          600: '#54453E',
          700: '#3E322C',
          800: '#2C231F',
        },
      },
      fontFamily: {
        display: ['var(--font-serif-tc)', 'serif'],
        body: ['var(--font-sans-tc)', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
