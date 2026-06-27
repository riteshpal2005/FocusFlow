/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        text: "var(--text)",
        primary: "var(--primary)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
}
