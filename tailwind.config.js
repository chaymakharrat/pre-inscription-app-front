/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d47a1',
        secondary: '#1565c0',
        accent: '#00bcd4',
      }
    },
  },
  plugins: [],
}
