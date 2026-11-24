/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bank: {
          red: '#DB0011',
          'red-dark': '#B0000D',
          'red-light': '#FDF2F2',
          black: '#121212',
          text: '#222222',
          muted: '#777777',
          border: '#E5E5E5',
          bg: '#F5F5F5',
          success: '#168447',
          error: '#D92D20',
          warning: '#F59E0B',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 30px -10px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
