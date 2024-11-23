/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(red|blue|green|yellow|gray|purple|indigo)-(500|600)/,
      variants: ['hover'],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

