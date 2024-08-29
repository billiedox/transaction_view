// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        'custom-sm': '323px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}