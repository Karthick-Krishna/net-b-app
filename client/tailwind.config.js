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
          dark: '#121212',
          lightRed: '#FDF2F2',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 30px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
