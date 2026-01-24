/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6B46C1", // Deep purple
        secondary: "#FFD700", // Gold
        background: "#0F0F0F", // Dark background
        surface: "#1F1F1F", // Darker surface for cards
        text: "#FFFFFF",
        "text-muted": "#A1A1AA",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};