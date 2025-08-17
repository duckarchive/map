/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../node_modules/@heroui/theme/dist/components/(button|snippet|code|input).js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
