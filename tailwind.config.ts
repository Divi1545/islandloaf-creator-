import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e5ff",
          200: "#bcd2ff",
          300: "#8eb8ff",
          400: "#5990ff",
          500: "#3b6cff",
          600: "#1a4fff",
          700: "#0d3beb",
          800: "#1132be",
          900: "#142f95",
          950: "#111d5a",
        },
        electric: {
          DEFAULT: "#00d4ff",
          50: "#eafffe",
          100: "#cbfffe",
          200: "#9effff",
          300: "#5bfbff",
          400: "#00eeff",
          500: "#00d4ff",
          600: "#00a8d6",
          700: "#0085ad",
          800: "#006b8c",
          900: "#065875",
          950: "#003b51",
        },
        surface: {
          DEFAULT: "#0f1117",
          50: "#f5f6f8",
          100: "#e0e2e8",
          200: "#c1c4d0",
          300: "#9a9fb2",
          400: "#747a90",
          500: "#596075",
          600: "#4a4f63",
          700: "#3f4353",
          800: "#2a2d3a",
          900: "#1a1c25",
          950: "#0f1117",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
