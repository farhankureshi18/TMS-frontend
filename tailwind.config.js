/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.htmnl",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}

