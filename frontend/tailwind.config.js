// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['"Nunito Sans Condensed"', 'sans-serif'],
        lexend: ['"Lexend Deca"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
