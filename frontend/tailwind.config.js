/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Satoshi', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#b4c6fc',
          400: '#8da2fb',
          500: '#6366f1', // Indigo
          600: '#4f46e5',
          700: '#3d9be0', // Anazk electric sky blue
          800: '#1a3a6d', // Anazk navy
          900: '#050f4a', // Anazk deep navy
          950: '#03082a',
        },
        accent: {
          blue: '#3d9be0',
          navy: '#1a3a6d',
          dark: '#050f4a',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(61, 155, 224, 0.25)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 12px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
      }
    },
  },
  plugins: [],
}
