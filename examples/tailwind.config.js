/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        black: '#000000',
        primary: {
          100: '#ffebd2',
          200: '#ffd3a4',
          300: '#ffb46b',
          400: '#ff882f',
          500: '#ff6607',
          600: '#f94900',
          700: '#e03800',
          800: '#a32a09',
          900: '#83250b',
        },
        gray: {
          100: '#f4f4f4',
          200: '#e0e0e0',
          300: '#c6c6c6',
          400: '#a8a8a8',
          500: '#8d8d8d',
          600: '#6f6f6f',
          700: '#525252',
          800: '#393939',
          900: '#262626',
        },
        danger: {
          100: '#ffc7c8',
          200: '#ff9b9d',
          300: '#ff7d80',
          400: '#ff575b',
          500: '#f02e33',
          600: '#d71c22',
          700: '#bb1217',
          800: '#9a0d0d',
          900: '#740909',
        },
      },
      width: {
        13: '3.25rem', // 52px
      },
      height: {
        13: '3.25rem', // 52px
      },
    },
  },
  plugins: [],
};
