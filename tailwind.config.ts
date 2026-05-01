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
          DEFAULT: "#ffffff",
          2: "#f8f7f2",
        },
        ink: {
          DEFAULT: "#000000",
          2: "#111111",
        },
        champagne: {
          DEFAULT: "#A69664",
          50: "#fbfaf5",
          100: "#f2eedf",
          200: "#e0d6b8",
          300: "#c8ba8a",
          400: "#b4a36f",
          500: "#A69664",
          600: "#928356",
          700: "#766B48",
          800: "#5e5539",
          900: "#403a27",
          950: "#242115",
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
        display: ["var(--font-display)", "Times New Roman MT", "Times New Roman", "serif"],
        subhead: ["var(--font-subhead)", "TimesNRMTPro", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "Glacial Indifference", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "Glacial Indifference", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        display: "0",
        caps: "0.2em",
      },
      backgroundImage: {
        'ivory-grain': "url('https://www.transparenttextures.com/patterns/felt.png'), linear-gradient(to bottom, #ffffff, #f8f7f2)",
      },
      boxShadow: {
        luxe: "0 20px 50px rgba(0, 0, 0, 0.05)",
      }
    },
  },
  plugins: [],
};
export default config;
