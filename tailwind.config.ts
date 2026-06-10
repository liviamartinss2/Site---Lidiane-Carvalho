import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta editorial — rosa vibrante (crimson/magenta) + off-white quente + bege dourado + preto editorial
        rose: {
          DEFAULT: "#C9184A", // crimson vibrante (acento principal)
          vibrant: "#B5005B", // magenta profundo
          wine: "#8E0038", // vinho escuro (titulos/links de enfase)
          soft: "#FBE7EE", // blush quente claro (fundos)
          deep: "#6B0029",
        },
        cream: "#FAF7F4", // off-white quente
        beige: "#FFEAD1", // bege dourado claro
        gold: {
          DEFAULT: "#C9A24B",
          light: "#FFEAD1",
          dark: "#A8842F",
        },
        ink: {
          DEFAULT: "#17110F", // preto editorial quente
          soft: "#2C2320", // texto principal
          muted: "#796763", // texto secundario (quente, sem cinza frio)
        },
        line: "rgba(23,17,15,.10)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "ui-serif", "serif"],
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23,17,15,.04), 0 18px 50px rgba(23,17,15,.07)",
        glow: "0 6px 20px rgba(201,24,74,.22)",
        "glow-lg": "0 12px 34px rgba(201,24,74,.30)",
        gold: "0 6px 20px rgba(201,162,75,.22)",
      },
      backgroundImage: {
        "rose-gradient": "linear-gradient(100deg, #B5005B, #C9184A)",
        "gold-gradient": "linear-gradient(100deg, #A8842F, #FFEAD1)",
        "page-glow":
          "radial-gradient(55% 65% at 0% 0%, #FBE7EE 0%, transparent 60%), radial-gradient(55% 65% at 100% 100%, #FFEAD1 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
