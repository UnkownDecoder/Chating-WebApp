import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4B6CB7', // Custom Blue
        secondary: '#182848', // Custom Dark Blue
        accent: '#F7A600', // Custom Yellow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom Font
      },
      boxShadow: {
        'glow': '0 4px 6px rgba(255, 255, 255, 0.4)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes : [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    ]
  },

};