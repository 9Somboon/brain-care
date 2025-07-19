/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C4DFF', // Slightly darker purple for contrast on light background
        secondary: '#007BFF', // Standard blue
        accent: '#D81B60', // Stronger pink/red for accent
        background: '#F8F8F8', // Very light grey, almost white
        surface: '#FFFFFF', // Pure white for main content areas
        text: '#171717', // Dark grey for main text
        textSecondary: '#4A4A4A', // Medium grey for secondary text
        border: '#E0E0E0', // Light grey for borders
        success: '#28A745', // Standard green
        warning: '#FFC107', // Standard yellow/orange
        error: '#DC3545', // Standard red
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
      addUtilities(newUtilities, ['responsive'])
    }
  ],
}
