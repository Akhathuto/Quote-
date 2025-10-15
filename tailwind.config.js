/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0070f3',
        'brand-secondary': '#1a202c',
        'brand-accent': '#38b2ac',
        'brand-light': '#f7fafc',
        'brand-dark': '#171923',
      },
    },
  },
  plugins: [],
}