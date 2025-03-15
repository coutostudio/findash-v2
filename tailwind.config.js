/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e65526",
        background: "#191919",
        card: "#252525",
        cardBorder: "#333333",
        textPrimary: "#ffffff",
        textSecondary: "#aaaaaa",
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      fontWeight: {
        regular: 400,
        bold: 700,
        black: 800,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
