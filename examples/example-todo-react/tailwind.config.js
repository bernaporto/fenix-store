/** @type {import('tailwindcss').Config} */
import { theme } from '../tailwind.config';

export default {
  theme,
  darkMode: 'selector',
  content: ['./src/**/*.{ts,tsx}', './*.html'],
};
