/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // This covers everything in src
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Backup for root app
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Backup for root components
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        secondary: '#D8F3DC',
        background: '#FAF9F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}