/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#004878',
        'custom-red': '#D22E1E',
        'credit-blue': '#5877B4',
      },
    },
  },
  plugins: [],
}