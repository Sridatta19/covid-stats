const colors = require("tailwindcss/colors")

module.exports = {
  purge: {
    mode: "all",
    content: ["./src/**/*.tsx", "./src/**/*.ts"],
    whitelistPatterns: [/mapbox$/],
  },
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
        amber: colors.amber,
        emerald: colors.emerald,
        lime: colors.lime,
        fuchsia: colors.fuchsia,
        orange: colors.orange,
        "light-blue": colors.lightBlue,
      },
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
