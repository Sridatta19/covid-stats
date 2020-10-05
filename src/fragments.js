import { graphql } from "gatsby"

export const DailyStateData = graphql`
  fragment StateEntry on StatesJsonData {
    date
    dc
    dd
    dr
    tc
    td
    tr
  }
`

export const DailyDistrictData = graphql`
  fragment DistrictEntry on DistrictsJsonData {
    date
    dc
    dd
    dr
    tc
    td
    tr
  }
`
