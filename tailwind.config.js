/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          900: "#0d0c0a",
          800: "#15130f",
          700: "#1c1914"
        }
      },
      fontFamily: {
        gothic: ["Cinzel", "Cormorant Garamond", "Georgia", "serif"]
      },
      boxShadow: {
        gothic: "0 10px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
      },
      backgroundImage: {
        parchment:
          "radial-gradient(ellipse at top, rgba(255,255,255,0.03), rgba(0,0,0,0.2)), radial-gradient(ellipse at bottom, rgba(255,255,255,0.02), rgba(0,0,0,0.2))"
      }
    }
  },
  plugins: []
}
