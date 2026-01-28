/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6B46C1", // Deep purple
        secondary: "#E6B36A", // Champagne Gold (Luxury) - FIXED COLOR
        rose: "#F4C2C2", // Rose Gold
        background: "#0B0B0B", // Soft Black (Luxury)
        surface: "#1F1F1F", // Darker surface for cards
        text: "#FAF9F6", // Off-white (Luxury)
        "text-muted": "#A1A1AA",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        pop: 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
};