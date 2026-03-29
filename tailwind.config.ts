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
          950: "#050a16",
          900: "#081226",
          850: "#0d1a33",
          800: "#132749",
          700: "#1b315b",
        },
        sand: {
          50: "#f3f6fb",
          100: "#e7edf6",
        },
        mist: {
          50: "#eef8ff",
          100: "#d9eeff",
          200: "#a9d0f1",
          300: "#7da8d4",
          400: "#5e84ab",
        },
        emerald: {
          300: "#7ae9d1",
          400: "#28c7a5",
          500: "#17997d",
        },
        jade: {
          300: "#9ad8ff",
          400: "#63b5ea",
          500: "#2d7fb2",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)"],
        display: ["var(--font-jakarta)"],
        editorial: ["var(--font-fraunces)"],
      },
      boxShadow: {
        premium: "0 20px 60px rgba(4, 10, 22, 0.2)",
        card: "0 12px 32px rgba(4, 10, 22, 0.18)",
        luxe: "0 32px 120px rgba(2, 6, 15, 0.55)",
        halo: "0 0 0 1px rgba(143,190,255,0.08), 0 30px 90px rgba(4,10,22,0.48)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(40, 199, 165, 0.24), transparent 35%), radial-gradient(circle at top right, rgba(99, 181, 234, 0.18), transparent 32%)",
        aurora:
          "radial-gradient(circle at 15% 15%, rgba(40, 199, 165, 0.24), transparent 0 28%), radial-gradient(circle at 82% 12%, rgba(99, 181, 234, 0.2), transparent 0 24%), radial-gradient(circle at 50% 100%, rgba(27, 49, 91, 0.32), transparent 0 38%)",
        "grid-fade":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        sheen: "linear-gradient(115deg, rgba(255,255,255,0.12), transparent 35%, transparent 65%, rgba(255,255,255,0.08))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -18px, 0) scale(1.035)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.42" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        drift: "drift 10s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        glow: "glow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
