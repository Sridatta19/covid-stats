const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  purge: {
    mode: "all",
    content: ["./src/**/*.js"],
    whitelistPatterns: [/mapbox$/],
  },
  dark: "class",
  theme: {
    extend: {
      borderRadius: {
        xl: "1rem",
      },
      fontSize: {
        xxs: "0.6875rem",
      },
      fontFamily: {
        arvo: ["Arvo", ...defaultTheme.fontFamily.sans],
        rose: ["Rosario", ...defaultTheme.fontFamily.sans],
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
    require("@tailwindcss/ui")({
      layout: "sidebar",
    }),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  experimental: {
    applyComplexClasses: true,
    uniformColorPalette: true,
    extendedSpacingScale: true,
    defaultLineHeights: true,
    extendedFontSizeScale: true,
    darkModeVariant: true,
  },
}
