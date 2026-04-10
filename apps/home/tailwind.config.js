/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            50: '#fef7f0',
            100: '#fdebd8',
            200: '#fad4b0',
            300: '#f5b57d',
            400: '#ef8d48',
            500: '#e97425',
            600: '#c2571e',
            700: '#a1431a',
            800: '#82371c',
            900: '#6a2f1a',
            950: '#3a150b',
          },
          coral: {
            50: '#fef5f3',
            100: '#fde8e4',
            200: '#fdd5cd',
            300: '#fab5a9',
            400: '#f48b7a',
            500: '#e86d5a',
            600: '#d44f3b',
            700: '#b23e2d',
            800: '#933629',
            900: '#7a3127',
            950: '#421610',
          },
          olive: {
            50: '#f9f8f0',
            100: '#f0eddb',
            200: '#e1dbb9',
            300: '#cec48f',
            400: '#bcab6c',
            500: '#b0a76a',
            600: '#967f4a',
            700: '#7a643d',
            800: '#665337',
            900: '#584631',
            950: '#322519',
          },
          sage: {
            50: '#f4f6f3',
            100: '#e5e9e2',
            200: '#cad3c5',
            300: '#a5b49e',
            400: '#8c9a86',
            500: '#637960',
            600: '#4e614b',
            700: '#3f4e3d',
            800: '#354034',
            900: '#2d352c',
            950: '#171c16',
          },
        },
        surface: {
          cream: '#faf6f1',
          warm: '#f5efe8',
          muted: '#ebe3d9',
        },
        ink: {
          DEFAULT: '#1a1a18',
          light: '#3d3a35',
          muted: '#6b6560',
          subtle: '#9c948c',
        },
      },
      fontFamily: {
        display: ['"Saira Condensed"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 6vw + 1rem, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['clamp(2.25rem, 4vw + 0.75rem, 4rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['clamp(1.75rem, 3vw + 0.5rem, 2.75rem)', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['clamp(1.25rem, 2vw + 0.25rem, 1.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up-delay-1': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
        'fade-up-delay-2': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-up-delay-3': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
        'fade-up-delay-4': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
        'fade-in': 'fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
