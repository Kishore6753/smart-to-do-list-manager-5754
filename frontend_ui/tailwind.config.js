/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#424242',
        accent: '#ff4081'
      },
      boxShadow: {
        card: '0 4px 16px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: []
};
