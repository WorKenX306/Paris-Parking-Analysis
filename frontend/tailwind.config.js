/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paris: {
          blue: '#003189',
          red: '#C1002A',
        },
      },
    },
  },
  plugins: [],
}
