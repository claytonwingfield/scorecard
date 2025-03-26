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

      scrollBehavior: {
        smooth: "smooth",
      },
      colors: {
        darkLightGray: "#C0C4C4",
        darkBg: "#121212",
        lovesBlack: "#000000",
        lovesWhite: "#FFFFFF",
        lovesGray: "#D3D3D4",
        lovesOrange: "#FF8000",
        lovesYellow: "#FFEB00",
        lovesPrimaryRed: "#FF0000",
        lovesLightRed: "#ff7f7f",
        lovesGreen: "#9dca7e",
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
