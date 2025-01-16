/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // green-600
          light: '#22c55e',   // green-500
          dark: '#15803d',    // green-700
        },
        secondary: {
          DEFAULT: '#0f766e', // teal-700
          light: '#14b8a6',   // teal-500
          dark: '#115e59',    // teal-800
        },
        accent: {
          DEFAULT: '#047857', // emerald-700
          light: '#059669',   // emerald-600
          dark: '#065f46',    // emerald-800
        },
      },
    },
  },
  plugins: [],
}
