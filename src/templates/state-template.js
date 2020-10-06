import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"

import Dashboard from "@components/dashboard"
import { transformKeys, getStateEntry, getDistrictEntry } from "@utils/fn-utils"
import DISTRICT_CODES from "@lib/districtNames"
import stateCodes from "@lib/stateCodes"

const STATE_CODES = transformKeys(stateCodes, s => s.toLowerCase())

const edgeReducer = stateCode => (acc, elem) => ({
  ...acc,
  [DISTRICT_CODES[STATE_CODES[stateCode]][elem.district]]: {
    data: elem.data,
  },
})

const StateTemplate = ({
  pageContext,
  apiResult,
  data: {
    allStatesJson: { edges: stateEdges },
    allDistrictsJson: { edges: districtEdges },
  },
}) => {
  const [data, setData] = useState(stateEdges.map(({ node }) => node)[0].data)
  const [childData, setChildData] = useState(
    districtEdges
      .map(({ node }) => node)
      .reduce(edgeReducer(pageContext.slug.toLowerCase()), {})
  )
  useEffect(() => {
    if (apiResult) {
      const entry = getStateEntry(data, apiResult, pageContext.slug)
      if (entry) {
        setData(d => d.concat(entry))
      }
    }
    const newChildData = Object.keys(childData).reduce((acc, code) => {
      const districtEntry = getDistrictEntry(
        childData[code].data,
        apiResult,
        pageContext.slug,
        code
      )
      console.log(districtEntry)
      return {
        ...acc,
        [code]: {
          id: code,
          data: districtEntry
            ? childData[code].data.concat(districtEntry)
            : childData[code].data,
        },
      }
    }, {})
    setChildData(newChildData)
  }, [apiResult])
  const stateCode = pageContext.slug.toLowerCase()
  return (
    <Dashboard
      data={data}
      stateId={stateCode}
      childData={childData}
      title={`Covid in ${STATE_CODES[stateCode]}`}
    />
  )
}

export default StateTemplate

export const pageQuery = graphql`
  query blogPostBySlugAndBlogPostBySlug($slug: String!) {
    allDistrictsJson(filter: { name: { eq: $slug } }) {
      edges {
        node {
          name
          district
          data {
            ...DistrictEntry
          }
        }
      }
    }
    allStatesJson(filter: { id: { eq: $slug } }) {
      edges {
        node {
          id
          data {
            ...StateEntry
          }
        }
      }
    }
  }
`
