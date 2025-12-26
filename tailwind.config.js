/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nomi: {
          bg: '#87CEEB',
          primary: '#4285F4',
          accent: '#FFA500',
          surface: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}

