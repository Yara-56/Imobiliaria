/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 🔥 ESSENCIAL (modo dark real)

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        muted: "#64748b",
        border: "#e2e8f0",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.05)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  plugins: [],
};