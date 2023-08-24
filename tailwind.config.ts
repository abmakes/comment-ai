import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'blue-under': '0px 8px 30px -8px hsla(241, 100%, 51%, 0.28)',
      },
      fontFamily:{
        'poppins': ['Poppins'],
        'inter': ['Inter'],
        'nunito-sans': ['Nunito Sans'],
      },
    },
    fontSize: {
      'xs': '0.75rem',
      'sm': '0.78rem',
      'base': '1rem',
      'xl': '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    }
  },
  plugins: [],
} satisfies Config;
