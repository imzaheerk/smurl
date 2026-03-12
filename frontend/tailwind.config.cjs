/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'enter': 'enter 0.5s ease-out forwards',
        'enter-2': 'enter 0.5s ease-out 0.1s forwards',
        'enter-3': 'enter 0.5s ease-out 0.2s forwards',
        'enter-4': 'enter 0.5s ease-out 0.3s forwards',
        'enter-5': 'enter 0.5s ease-out 0.4s forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.6', filter: 'brightness(1)' },
          '100%': { opacity: '1', filter: 'brightness(1.2)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        enter: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 40px -10px rgba(34, 211, 238, 0.5)',
        'glow-magenta': '0 0 40px -10px rgba(232, 121, 249, 0.5)',
        'glow-teal': '0 0 40px -10px rgba(45, 212, 191, 0.5)',
        'card': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 32px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(34, 211, 238, 0.15)',
      },
    },
  },
  plugins: []
};

