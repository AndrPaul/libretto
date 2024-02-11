/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background' : '#eae9e9',
        'violet' : '#7530FF',
        'lightViolet': '#B088FF',
        'lightPink': '#FDCFF3',
        'darkGrey': '#3C3C3C',
        'lightGrey': '#7530FF',
        'white': '#FFFFFF',
      }
    },
  },
  plugins: [],
}

