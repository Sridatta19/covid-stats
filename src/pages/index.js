import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"

import Dashboard from "@components/dashboard"
import { getCountryEntry } from "@utils/fn-utils"
import { getEntryDate } from "../utils/fn-utils"

const edgeReducer = (acc, elem) => ({
  ...acc,
  [elem.id]: elem,
})

const IndexPage = ({
  apiResult,
  data: {
    allStatesJson: { edges },
  },
}) => {
  const [data, setData] = useState(
    edges.map(({ node }) => node).reduce(edgeReducer, {}).TT.data
  )
  useEffect(() => {
    if (apiResult) {
      const entry = getCountryEntry(data, apiResult)
      if (entry) {
        if (getEntryDate(apiResult.TT) !== data[data.length - 1].date) {
          setData(d => d.concat(entry))
        } else {
          setData(d => d.slice(0, d.length - 2).concat(entry))
        }
      }
    }
  }, [apiResult])
  const childData = edges.map(({ node }) => node).reduce(edgeReducer, {})
  console.log(childData)
  return (
    <Dashboard
      stateId="tt"
      data={data}
      childData={childData}
      title="Coronavirus Stats"
    />
  )
}

export const query = graphql`
  {
    allStatesJson {
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

export default IndexPage
