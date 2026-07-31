/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#e8f5e9',
          DEFAULT: '#15803d',
          dark: '#166534',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
=======
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
>>>>>>> kasuni-development
    },
  },
  plugins: [],
}
