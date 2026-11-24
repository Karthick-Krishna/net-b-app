/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hsbc: {
          red: '#DB0011',
          deepRed: '#B0000D',
          hoverRed: '#c4000f',
          bg: '#F5F5F5',
          card: '#FFFFFF',
          text: '#252525',
          secondary: '#777777',
          border: '#E8E8E8',
          success: '#16864A',
          warning: '#D99B20',
          error: '#D92D20',
        },
        sidebar: {
          bg: '#FFFFFF',
          border: '#E8E8E8',
          active: '#DB0011',
          text: '#252525',
          muted: '#777777',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
