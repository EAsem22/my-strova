import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-bricolage)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        border: "var(--border)",
        surface: "var(--surface)",
        "off-white": "var(--off-white)",
        emerald: "var(--emerald)",
        "emerald-dk": "var(--emerald-dk)",
        "emerald-lt": "var(--emerald-lt)",
        red: "var(--red)",
        amber: "var(--amber)",
      },
    },
  },
  plugins: [],
};
export default config;
