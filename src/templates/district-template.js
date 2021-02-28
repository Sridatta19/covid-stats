import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"

import Dashboard from "@components/dashboard"
import { getDistrictEntry, transformKeys } from "@utils/fn-utils"
import DISTRICT_CODES from "@lib/districtNames"
import stateCodes from "@lib/stateCodes"

const STATE_CODES = transformKeys(stateCodes, s => s.toLowerCase())

const edgeReducer = (acc, elem, index) => ({
  ...acc,
  [index]: elem,
})

function DistrictTemplate({
  pageContext,
  apiResult,
  data: {
    allDistrictsJson: { edges },
  },
}) {
  const [data, setData] = useState(edges.map(({ node }) => node)[0].data)
  const keymap = DISTRICT_CODES[
    STATE_CODES[pageContext.slug.toLowerCase()]
  ].reduce(edgeReducer, {})
  useEffect(() => {
    if (apiResult) {
      const entry = getDistrictEntry(
        data,
        apiResult,
        pageContext.slug,
        keymap[pageContext.district]
      )
      if (entry) {
        setData(d => d.concat(entry))
      }
    }
  }, [apiResult, keymap])
  return (
    <Dashboard
      stateId={pageContext.slug.toLowerCase()}
      title={`Covid in ${keymap[pageContext.district]} District (${
        pageContext.slug
      })`}
      data={data}
    />
  )
}

export default DistrictTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $district: Int) {
    allDistrictsJson(
      filter: { name: { eq: $slug }, district: { eq: $district } }
    ) {
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
  }
`
