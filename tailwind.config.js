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
          light: "#60a5fa",
          hover: "#2563eb",
          focus: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "#10b981",
          dark: "#059669",
          light: "#34d399",
          hover: "#059669",
          focus: "#047857",
        },
        editor: {
          bg: "var(--editor-bg)",
          text: "var(--editor-text)",
          border: "var(--editor-border)",
          hover: "var(--editor-hover)",
          focus: "var(--editor-focus)",
        },
        success: {
          DEFAULT: "#10b981",
          dark: "#059669",
          light: "#34d399",
        },
        error: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
          light: "#f87171",
        },
        warning: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          light: "#fbbf24",
        },
        info: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#60a5fa",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "slide-out": "slideOut 0.3s ease-in",
        "bounce-soft": "bounceSoft 1s infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-10px)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      scale: {
        102: "1.02",
        105: "1.05",
        110: "1.10",
        95: "0.95",
        90: "0.90",
        80: "0.80",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        mono: ["Fira Code", "monospace"],
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      boxShadow: {
        editor: "0 0 10px rgba(0, 0, 0, 0.1)",
        "editor-dark": "0 0 10px rgba(0, 0, 0, 0.3)",
        "editor-hover": "0 0 15px rgba(0, 0, 0, 0.2)",
        "editor-focus": "0 0 0 2px rgba(59, 130, 246, 0.5)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      transitionDuration: {
        400: "400ms",
        500: "500ms",
        600: "600ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".text-size-adjust": {
          "-webkit-text-size-adjust": "100%",
          "-moz-text-size-adjust": "100%",
          "-ms-text-size-adjust": "100%",
          "text-size-adjust": "100%",
        },
        ".backface-hidden": {
          "-webkit-backface-visibility": "hidden",
          "-moz-backface-visibility": "hidden",
          "backface-visibility": "hidden",
        },
        ".transform-gpu": {
          "-webkit-transform": "translate3d(0, 0, 0)",
          "-moz-transform": "translate3d(0, 0, 0)",
          "-ms-transform": "translate3d(0, 0, 0)",
          transform: "translate3d(0, 0, 0)",
        },
        ".smooth-scroll": {
          "-webkit-overflow-scrolling": "touch",
          "scroll-behavior": "smooth",
        },
        ".touch-manipulation": {
          "-webkit-touch-callout": "none",
          "-webkit-tap-highlight-color": "transparent",
          "touch-action": "manipulation",
        },
        ".font-smoothing": {
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
        },
      });
    },
  ],
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
    "bg-editor-bg",
    "text-editor-text",
    "border-editor-border",
    "shadow-editor",
    "shadow-editor-dark",
    "text-size-adjust",
    "backface-hidden",
    "transform-gpu",
  ],
};
