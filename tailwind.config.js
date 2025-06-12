/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#000000',
        accent: '#00A3FF',
        dark: '#000000',
        'dark-gray': '#111111',
        'light-gray': '#666666',
        'pure-white': '#FFFFFF',
        'blue-black': '#000B1A',
        'blue-gray': '#1A1F2E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #0F172A 0%, #1E40AF 100%)',
      },
    },
  },
  plugins: [],
} 