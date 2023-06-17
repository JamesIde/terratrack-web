/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F5D6',
          100: '#E0EECD',
          'dark': "#7AA53B"
        }
      }
    },
  },
  plugins: [],
}

