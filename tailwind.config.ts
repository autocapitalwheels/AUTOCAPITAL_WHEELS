import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        brand: {
          charcoal: "#111827",
          "charcoal-light": "#1f2937",
          gold: "#b45309",
          "gold-light": "#d97706",
          "gold-subtle": "#fef3c7",
          warm: "#fafaf9",
        }
      }
    },
  },
  plugins: [],
};
export default config;
