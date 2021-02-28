import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"

import Dashboard from "@components/dashboard"
import { getCountryEntry, getStateEntry } from "@utils/fn-utils"

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
  const [childData, setChildData] = useState(
    edges.map(({ node }) => node).reduce(edgeReducer, {})
  )
  useEffect(() => {
    if (apiResult) {
      // Calculate Latest 'TT' Entry
      const entry = getCountryEntry(data, apiResult)
      if (entry) {
        if (entry.date === data[data.length - 1].date) {
          // Merge Latest Entry Fetched by API
          setData(d => d.slice(0, d.length - 1).concat(entry))
        } else {
          // Append Latest Entry Fetched by API
          setData(d => d.concat(entry))
        }
      }
      // Append Latest Entry of Each State to Child Data
      const newChildData = Object.keys(childData).reduce((acc, code) => {
        const stateEntry = getStateEntry(childData[code].data, apiResult, code)
        return {
          ...acc,
          [code]: {
            id: code,
            data: stateEntry
              ? childData[code].data.concat(stateEntry)
              : childData[code].data,
          },
        }
      }, {})
      setChildData(newChildData)
    }
  }, [apiResult])
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

export default IndexPage
