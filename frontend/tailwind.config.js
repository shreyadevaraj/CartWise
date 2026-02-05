/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff4eb',
          100: '#ffdcc2',
          200: '#ffbf99',
          300: '#ff9666',
          400: '#ff7033',
          500: '#ff540a',
        },
        mint: {
          50: '#e0fbf4',
          100: '#bcf6e6',
          200: '#87eed0',
          300: '#4fdbb6',
          400: '#21cfa5',
          500: '#0ca881',
        },
        lavender: {
          50: '#f2f0ff',
          100: '#e0dbfe',
          200: '#c6bdfc',
          300: '#a795fa',
          400: '#8b6ff5',
          500: '#724cf0',
        },
        sky: {
          50: '#e6f6ff',
          100: '#ccebff',
          200: '#99d6ff',
          300: '#66c2ff',
          400: '#33adff',
          500: '#0099ff',
        },
        lemon: {
          50: '#fffee0',
          100: '#fffab8',
          200: '#fff58f',
          300: '#ffeb66',
          400: '#ffe03d',
          500: '#ffcc00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
