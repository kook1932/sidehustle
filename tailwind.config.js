/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        lightgray: '#f4f7f6',
        darktext: '#2c3e50',
        mediumtext: '#7f8c8d',
        warning: '#f39c12',
      },
    },
  },
  plugins: [],
}
