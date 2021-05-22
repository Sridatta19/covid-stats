import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"

import { Dashboard } from "../components/Dashboard"
import {
  transformKeys,
  getStateEntry,
  getDistrictEntry,
} from "../components/utils/fn-utils"
import DISTRICT_CODES from "../../lib/districtNames"
import stateCodes from "../../lib/stateCodes"

const STATE_MAPPINGS = transformKeys(stateCodes, s => s.toLowerCase())

const edgeReducer = stateCode => (acc, elem) => ({
  ...acc,
  [DISTRICT_CODES[STATE_MAPPINGS[stateCode]][elem.district]]: {
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
      // Calculate Latest 'State' Entry
      const entry = getStateEntry(data, apiResult, pageContext.slug)
      if (entry) {
        // Append Latest Entry Fetched by API
        setData(d => d.concat(entry))
      }
    }
    // Append Latest Entry of Each District to Child Data
    const newChildData = Object.keys(childData).reduce((acc, code) => {
      const districtEntry = getDistrictEntry(
        childData[code].data,
        apiResult,
        pageContext.slug,
        code
      )
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
      title={`Covid in ${STATE_MAPPINGS[stateCode]}`}
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
            date
            dc
            dd
            dr
            tc
            td
            tr
          }
        }
      }
    }
    allStatesJson(filter: { id: { eq: $slug } }) {
      edges {
        node {
          id
          data {
            date
            dc
            dd
            dr
            tc
            td
            tr
          }
        }
      }
    }
  }
`
