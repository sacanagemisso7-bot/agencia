import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#09111f",
          900: "#0d1728",
          800: "#122038",
        },
        sand: {
          50: "#f8f4ee",
          100: "#f1eadf",
        },
        mist: {
          100: "#d9e3ea",
          200: "#bdd0db",
          300: "#9ab7c8",
        },
        emerald: {
          400: "#30b27c",
          500: "#219766",
        },
        amber: {
          300: "#e0bb67",
          400: "#cfa34c",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)"],
        display: ["var(--font-sora)"],
      },
      boxShadow: {
        premium: "0 20px 60px rgba(9, 17, 31, 0.12)",
        card: "0 12px 32px rgba(9, 17, 31, 0.08)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(48, 178, 124, 0.22), transparent 35%), radial-gradient(circle at top right, rgba(224, 187, 103, 0.18), transparent 32%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

