import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'nb-bg': '#FAF7EE',
        'nb-card': '#FFFFFF',
        'nb-black': '#000000',
        'nb-yellow': '#FFE500',
        'nb-blue': '#2563EB',
        'nb-green': '#00E599',
        'nb-pink': '#FF3366',
        'nb-purple': '#A855F7',
        'nb-orange': '#FF8400',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #000000',
        'brutal': '4px 4px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-xl': '8px 8px 0px #000000',
      },
    },
  },
  plugins: [],
};

export default config;
