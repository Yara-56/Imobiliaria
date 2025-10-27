/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Adiciona a fonte 'Inter' para usarmos
        inter: ['Inter', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};