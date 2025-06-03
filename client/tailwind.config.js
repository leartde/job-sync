/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black" : "#141414",
        "prettyGray": "rgb(229 231 235 / 0.9)"
      }
    },
  },
  plugins: [],
}
