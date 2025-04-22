/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./src/**/*.{js,jsx,ts,tsx,css}",
    "./index.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
        },
        secondary: {
          DEFAULT: "#10b981",
          dark: "#059669",
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeInUp: "fadeInUp 0.5s ease-in-out",
        slideIn: "slideIn 0.3s ease-in-out",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      scale: {
        102: "1.02",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  safelist: [
    "theme-light",
    "theme-dark",
    "tg-theme-bg",
    "tg-theme-header",
    "tg-theme-footer",
    "tg-theme-secondary-bg",
    "scale-102",
    "scale-105",
    "scale-110",
    "scale-95",
    "translate-x-4",
    "-translate-x-4",
    "translate-x-full",
    "-translate-x-full",
  ],
};
