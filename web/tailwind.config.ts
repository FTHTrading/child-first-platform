import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT: "#2563eb", hover: "#1d4ed8" },
        success:  { DEFAULT: "#16a34a", light: "#dcfce7" },
        warning:  { DEFAULT: "#d97706", light: "#fef3c7" },
        danger:   { DEFAULT: "#dc2626", light: "#fee2e2" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
