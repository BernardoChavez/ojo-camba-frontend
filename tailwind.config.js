/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        scz: {
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          accent: '#10B981', // Verde cruceño
          red: '#EF4444',
          yellow: '#F59E0B',
          blue: '#3B82F6',
          neon: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
