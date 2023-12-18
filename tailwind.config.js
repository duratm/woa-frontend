/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkMode:{
            'primary': '#2D033B',
            'secondary': '#810CA8',
            'tertiary': '#C147E9',
            'quaternary': '#E5B8F4',
        },
        'primary': '#E5B8F4',
        'secondary': '#C147E9',
        'tertiary': '#810CA8',
        'quaternary': '#2D033B',
      },
      fontFamily: {
        sans: ['MuseoModerno', 'sans-serif'],
}
    },
  },
  plugins: [
      '@tailwincss/forms',
  ],
}

