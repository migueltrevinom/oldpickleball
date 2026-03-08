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
        court: {
          blue: "#1e3a5f",
          surface: "#3b6fa0",
        },
        pickle: {
          green: "#22c55e",
          dark: "#15803d",
          light: "#bbf7d0",
        },
        ball: {
          yellow: "#facc15",
        },
        dark: "#0a0f1a",
        surface: {
          DEFAULT: "#ffffff",
          light: "#f8fafc",
          muted: "#f1f5f9",
        },
        warm: {
          peach: "#FFF8F3",
          "peach-light": "#FFF5F0",
          "peach-deep": "#FFEDE3",
        },
        text: {
          primary: "#1a1a1a",
          secondary: "#666666",
          muted: "#888888",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      animation: {
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(34, 197, 94, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
