/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#040711',
        surface: {
          50: 'rgba(255, 255, 255, 0.03)',
          100: 'rgba(255, 255, 255, 0.06)',
          200: 'rgba(255, 255, 255, 0.1)',
          glass: 'rgba(15, 23, 42, 0.55)',
          dark: '#080d1a',
          card: 'rgba(13, 20, 36, 0.7)'
        },
        brand: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          purple: '#a855f7',
          pink: '#ec4899',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(6, 182, 212, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
