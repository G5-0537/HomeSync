/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#ECE3D4',
          DEFAULT: '#FAF7F2',
        },
        sage: {
          50: '#F2F6F3',
          100: '#E2ECE4',
          200: '#C5D8C9',
          300: '#9EBFA4',
          400: '#729F7B',
          500: '#4A7C59',
          600: '#3D684A',
          700: '#32543C',
          800: '#28412F',
          900: '#203326',
          DEFAULT: '#4A7C59',
        },
        lavender: {
          50: '#F8F6FC',
          100: '#F0EDF7',
          200: '#E0DAEE',
          300: '#C7BCE0',
          400: '#AA98CF',
          500: '#8B7BB5',
          600: '#72619E',
          700: '#5C4E82',
          DEFAULT: '#8B7BB5',
        },
        charcoal: {
          50: '#F6F7F6',
          100: '#E2E5E2',
          200: '#C4C9C4',
          300: '#9DA49E',
          400: '#6C756E',
          500: '#48504A',
          600: '#363D38',
          700: '#292E2A',
          800: '#1E221F',
          900: '#141715',
          DEFAULT: '#1E221F',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(26, 29, 26, 0.04), 0 1px 3px rgba(26, 29, 26, 0.02)',
        'premium': '0 12px 32px -4px rgba(30, 34, 31, 0.08), 0 4px 12px -2px rgba(30, 34, 31, 0.04)',
        'float': '0 20px 48px -8px rgba(30, 34, 31, 0.12), 0 8px 16px -4px rgba(30, 34, 31, 0.06)',
      }
    },
  },
  plugins: [],
}
