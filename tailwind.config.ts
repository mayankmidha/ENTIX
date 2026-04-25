import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#fcfaf7",
          2: "#f5f2ed",
        },
        ink: {
          DEFAULT: "#120f0d",
          2: "#1c1815",
        },
        champagne: {
          50: "#fbf8f1",
          100: "#f5edd9",
          200: "#eadab2",
          300: "#d9b36a",
          400: "#c7a055",
          500: "#b48c42",
          600: "#9f7b3a",
          700: "#856431",
          800: "#6d522b",
          900: "#5a4326",
          950: "#342614",
        },
        jade: {
          DEFAULT: "#00a86b",
          10: "rgba(0, 168, 107, 0.1)",
        },
        oxblood: {
          DEFAULT: "#4a0404",
          10: "rgba(74, 4, 4, 0.1)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        display: "0",
        caps: "0.2em",
      },
      backgroundImage: {
        'ivory-grain': "url('https://www.transparenttextures.com/patterns/felt.png'), linear-gradient(to bottom, #fcfaf7, #f5f2ed)",
      },
      boxShadow: {
        luxe: "0 20px 50px rgba(18, 15, 13, 0.05)",
      }
    },
  },
  plugins: [],
};
export default config;
