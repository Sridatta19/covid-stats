const path = require("path")

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mapbox-gl/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const stateTemplate = path.resolve(`./src/templates/StateTemplate.tsx`)
  const districtTemplate = path.resolve(`./src/templates/DistrictTemplate.tsx`)
  const result = await graphql(
    `
      {
        allStatesJson {
          edges {
            node {
              id
            }
          }
        }
        allDistrictsJson {
          edges {
            node {
              name
              district
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const states = result.data.allStatesJson.edges
  const districts = result.data.allDistrictsJson.edges

  states.forEach(state => {
    createPage({
      path: `/state/${state.node.id.toLowerCase()}`,
      component: stateTemplate,
      context: {
        slug: state.node.id,
      },
    })
  })
  districts.forEach(district => {
    createPage({
      path: `/state/${district.node.name.toLowerCase()}/district/${
        district.node.district
      }`,
      component: districtTemplate,
      context: {
        slug: district.node.name,
        district: district.node.district,
      },
    })
  })
}
