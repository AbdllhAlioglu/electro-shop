/** @type {import('tailwindcss').Config} */

import flowbite from "flowbite-react/tailwind";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      animation: {
        "fade-left": "fadeLeft 1s linear",
        "fade-left-thrice": "fadeLeft 1s linear 3", // Custom animation for thrice
        "fade-right": "fadeRight 1s linear",
        "fade-right-thrice": "fadeRight 1s linear 3", // Custom animation for thrice
        "fade-up": "fadeUp 2s ease-out",
      },
      keyframes: {
        fadeLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        customGreen: {
          100: "#5a7e67", // Lightest shade
          200: "#4b715d", // Lighter shade
          300: "#3e644f", // Lighter shade
          400: "#375b47", // Lighter shade
          500: "#31473A", // Base color (your color)
          600: "#2a3c33", // Darker shade
          700: "#223228", // Darker shade
          800: "#1b2920", // Darker shade
          900: "#14211b", // Darkest shade
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
      scale: {
        101: "1.01",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
