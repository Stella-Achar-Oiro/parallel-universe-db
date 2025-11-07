/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      colors: {
        // Vercel design system
        vercel: {
          bg: '#000000',
          fg: '#ffffff',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        accent: {
          DEFAULT: '#0070f3',
          dark: '#0761d1',
        },
        universe: {
          alpha: '#FFD700',
          beta: '#00CED1',
          gamma: '#FF69B4',
          delta: '#9370DB'
        }
      },
      borderRadius: {
        'vercel': '8px',
      },
      boxShadow: {
        'vercel-sm': '0 0 0 1px rgba(0,0,0,.05)',
        'vercel': '0 5px 10px rgba(0,0,0,.12)',
        'vercel-md': '0 8px 30px rgba(0,0,0,.12)',
        'vercel-lg': '0 30px 60px rgba(0,0,0,.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 112, 243, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 112, 243, 0.5)' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(0, 112, 243, 0.3)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 40px rgba(0, 112, 243, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
