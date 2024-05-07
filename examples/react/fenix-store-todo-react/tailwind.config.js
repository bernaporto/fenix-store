/** @type {import('tailwindcss').Config} */
import config from '../../tailwind.config';

export default {
  content: ['./src/**/*.{ts,tsx}', './*.html'],
  theme: config.theme,
};
