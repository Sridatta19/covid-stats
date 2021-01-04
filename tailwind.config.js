module.exports = {
  purge: {
    mode: "all",
    content: ["./src/**/*.js"],
    whitelistPatterns: [/mapbox$/],
  },
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        xl: "1rem",
      },
      fontSize: {
        xxs: "0.6875rem",
      },
      fontFamily: {
        arvo: ["Arvo"],
        rose: ["Rosario"],
      },
      spacing: {
        7: "1.75rem",
        14: "3.5rem",
        120: "30rem",
        132: "33rem",
        144: "36rem",
        160: "40rem",
      },
    },
  },
  variants: {
    zIndex: ["responsive", "hover", "focus"],
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
}
