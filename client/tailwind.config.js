/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#F4FBF4',
          100: '#E6F6E6',
          200: '#C5EBC5',
          300: '#94DA94',
          400: '#5EC15E',
          500: '#2E9E2E',
          600: '#1E7E1E',
          700: '#166416',
          800: '#124E12',
          900: '#0C370C',
        },
        doca: {
          saffron: '#FF9933',
          navy: '#000080',
          green: '#138808',
          gold: '#D97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
