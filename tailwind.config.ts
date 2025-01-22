import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.gray,
        background: {
          light: colors.white,
          dark: colors.gray[900]
        },
        text: {
          light: colors.gray[900],
          dark: colors.gray[100]
        }
      },
      spacing: {
        'screen-padding-sm': '1rem',
        'screen-padding-md': '2rem',
        'screen-padding-lg': '4rem',
        'screen-padding-xl': '6rem'
      }
    },
  },
  plugins: [
    forms,
    typography,
  ],
} satisfies Config;
