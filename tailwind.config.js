/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,scss}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          light: "#818cf8",
        },
        secondary: {
          DEFAULT: "#06b6d4",
          light: "#22d3ee",
        },
      },
      backgroundImage: {
        base: "linear-gradient(145deg, #eef2ff 0%, #f0f9ff 30%, #faf5ff 60%, #f5f3ff 100%)",
        card: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))",
      },

      boxShadow: {
        primary: "0 14px 32px -4px rgb(99 102 241 / 0.45)",
        soft: "0 4px 12px rgba(0,0,0,0.08)",
        card: "0 32px 64px -16px rgba(99,102,241,0.12)",
      },
    },
  },
  plugins: [],
};
