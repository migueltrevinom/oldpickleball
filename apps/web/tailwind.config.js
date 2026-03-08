/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#22c55e', dark: '#15803d', light: '#dcfce7', 50: '#f0fdf4' },
        peach: { DEFAULT: '#FFF8F3', light: '#FFFDF9', dark: '#FFF0E6' },
        sidebar: { DEFAULT: '#fafafa', border: '#e5e7eb' },
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
