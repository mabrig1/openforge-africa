/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forge: {
          dark: "#0F172A",
          accent: "#22C55E",
          soft: "#1E293B",
        },
      },
    },
  },
  plugins: [],
};
