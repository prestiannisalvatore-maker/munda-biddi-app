import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14201a",
        bush: "#2f6b4f",
        ocean: "#1f4d3a",
        sand: "#eef3ef",
        surface: "#ffffff",
        "surface-2": "#e8f0ea",
        muted: "#5a6b62",
        line: "#d0ddd4",
        warn: "#b45309",
        "bush-soft": "#d8ebe0",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
