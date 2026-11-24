/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premier: {
          red: '#DB0011',
          darkRed: '#B0000D',
          hoverRed: '#c0000f',
          bg: '#F5F5F5',
          card: '#FFFFFF',
          text: '#222222',
          muted: '#666666',
          border: '#E5E5E5',
          success: '#168447',
          error: '#D92D20',
          warning: '#D97706',
          sidebar: '#1E293B',
          sidebarHover: '#334155'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
