/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "250px",
        sm:"650px",
        md:"768px",
        lg:"1024px",
      },
      variants: {
        display: ['responsive'], // ensure responsive variants are enabled
      },
      backgroundImage: {
        "steps": "url('/src/assets/Steps.png')",
        "water":"url('/src/assets/Hydration1.png')",
        "sleep": "url('/src/assets/Sleep_tracker.png')",
      },
    },
  },
  plugins: [],
};