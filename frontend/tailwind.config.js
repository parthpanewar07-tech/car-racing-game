/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0a0a0a',
          light: '#f5f5f5',
          primary: '#e63946',
          accent: '#ffd166'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arcade: ['Press Start 2P', 'cursive'],
      }
    },
  },
  plugins: [],
}
