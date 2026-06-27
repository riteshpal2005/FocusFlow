/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text-primary)',
        primary: 'var(--color-brand-primary)',
        bordercolor: 'var(--color-border)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        'brand-primary': 'var(--color-brand-primary)',
        'brand-primary-content': 'var(--color-brand-primary-content)',
        'status-danger': 'var(--color-status-danger)',
        'status-success': 'var(--color-status-success)',
      },
    },
  },
  plugins: [],
}
