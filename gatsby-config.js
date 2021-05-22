require("dotenv").config({
  path: `.env`,
})

let path = require("path")

module.exports = {
  siteMetadata: {
    title: `India`,
    description: `An ongoing statistical accumulation of coronavirus cases and deaths in India`,
    author: `@gatsbyjs`,
  },
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `states`,
        path: `${__dirname}/lib/data/states`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `districts`,
        path: `${__dirname}/lib/data/districts`,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-theme-animated-tailwind`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `corons-stats-app`,
        short_name: `coronastats`,
        start_url: `/`,
        display: `standalone`,
        icon: `src/images/covid19.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `tomato`,
        showSpinner: false,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    `gatsby-plugin-typescript`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
