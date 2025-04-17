/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.75rem" }],
      lg: ["1.125rem", { lineHeight: "2rem" }],
      xl: ["1.25rem", { lineHeight: "2rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.5rem", { lineHeight: "3.5rem" }],
      "5xl": ["3rem", { lineHeight: "3.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1.1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },

    extend: {
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "custom-pulse-light": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.9 },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 10px #9dca7e, 0 0 20px #9dca7e" },
          "50%": { boxShadow: "0 0 20px #9dca7e, 0 0 40px #9dca7e" },
        },
      },
      animation: {
        "custom-pulse-light":
          "custom-pulse-light 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      scrollBehavior: {
        smooth: "smooth",
      },
      colors: {
        darkBg: "#121212",
        darkPrimaryText: "#E0E0E0",
        darkSecondaryText: "#B0B0B0",
        darkCompBg: "#282828",
        darkBorder: "#404040",
        darkLightGray: "#B3B3B3",

        lovesBlack: "#000000",
        lovesWhite: "#FFFFFF",
        lovesGray: "#D3D3D4",
        lovesOrange: "#FF8000",
        lovesYellow: "#FFEB00",
        lovesPrimaryRed: "#FF0000",
        lovesLightRed: "#ff7f7f",
        lovesGreen: "#9dca7e",
        lightGray: "#D9D9D9",
      },
      fontFamily: {
        futura: ['"futura-pt"', "sans-serif"],
        "futura-bold": ['"futura-pt-bold"', "sans-serif"],
      },
      maxWidth: {
        "2xl": "40rem",
      },
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
