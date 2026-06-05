import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta — base rose/mauve existente + dourado e preto premium
        rose: {
          DEFAULT: "#C77B8C", // rose principal
          wine: "#8E4B5A", // mauve vinho
          soft: "#F8F1F4", // blush claro
          deep: "#6B3947",
        },
        cream: "#F4EFE9",
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4CE94",
          dark: "#A8842F",
        },
        ink: {
          DEFAULT: "#1A1416", // preto profundo premium
          soft: "#3A2A2D", // marrom frio (texto)
          muted: "#6B5A5E",
        },
        line: "rgba(58,42,45,.12)",
      },
      fontFamily: {
        serif: ['Georgia', 'ui-serif', '"Times New Roman"', "serif"],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "22px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.08)",
        glow: "0 6px 18px rgba(199,123,140,.35)",
        gold: "0 6px 20px rgba(201,162,75,.25)",
      },
      backgroundImage: {
        "rose-gradient": "linear-gradient(90deg, #8E4B5A, #C77B8C)",
        "gold-gradient": "linear-gradient(90deg, #A8842F, #E4CE94)",
        "page-glow":
          "radial-gradient(60% 80% at 0% 0%, #F9E6EC 0%, transparent 60%), radial-gradient(60% 80% at 100% 100%, #F2E7DE 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
