/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        nomi: {
          bg: '#87CEEB', // Keeping original for backward compat if needed temporarily, but main theme below
          primary: '#4285F4',
          accent: '#FFA500',
          surface: '#FFFFFF',

          // New Dark Theme Palette
          dark: {
            bg: '#121212',
            surface: '#1E1E1E',
            surfaceHighlight: '#2A2A2A',
            text: '#EAEAEA',
            subtext: '#A0A0A0',
            primary: '#EAEAEA', // White/Off-white as primary in dark mode
            accent: '#FFFFFF',
          }
        }
      },
      fontFamily: {
        'satoshi-bold': ['Satoshi-Bold'],
        'satoshi-medium': ['Satoshi-Medium'],
        'satoshi-light': ['Satoshi-Light'],
        'satoshi-regular': ['Satoshi-Regular'],
      }
    },
  },
  plugins: [],
}

