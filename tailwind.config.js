/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main_profile.jsx",
    "./main.jsx",
    "./App.jsx",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Mentomania - blue theme */
        mento: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        'mento': '0 4px 14px -3px rgba(37, 99, 235, 0.2), 0 2px 6px -2px rgba(37, 99, 235, 0.1)',
        'mento-lg': '0 25px 50px -12px rgba(37, 99, 235, 0.15), 0 0 0 1px rgba(37, 99, 235, 0.05)',
        'mento-hover': '0 30px 60px -15px rgba(37, 99, 235, 0.2), 0 0 0 1px rgba(37, 99, 235, 0.08)',
      },
    },
  },
  plugins: [],
};
