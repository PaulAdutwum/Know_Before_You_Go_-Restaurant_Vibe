/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0F172A',  // Dark blue
        'primary-blue': '#1E40AF',  // Medium blue
        'primary-light': '#3B82F6', // Light blue
        'accent-orange': '#F97316', // Orange
        'card-bg': '#1E293B',       // Card background
        'text-gray': '#94A3B8',     // Light gray text
      },
    },
  },
  plugins: [],
}

