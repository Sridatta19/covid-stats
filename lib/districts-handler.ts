import fs from "fs"
import DISTRICTS from "./districtNames"
import STATE_MAPPINGS, { STATE_CODES } from "./stateCodes"
import { DATA_ENTRY, DistrictAPIEntry, DISTRICT_DATA } from "./type-definitions"
import { getStateCodes, getPastDates, groupBy, dateReducer } from "./utils"

const parseDistrictData = (masterData: DistrictAPIEntry[]) =>
  groupBy(
    (elem: DistrictAPIEntry) => `${elem.Date}_${elem.State}_${elem.District}`,
    masterData
  )

const processDistrictData = () => {
  const { districts: masterData } = JSON.parse(
    fs.readFileSync("districts.json", "utf8")
  )
  const parsedMasterData: Record<string, DistrictAPIEntry[]> =
    parseDistrictData(masterData)
  const districtContentByState: DISTRICT_DATA[] = []
  const CODES = getStateCodes()
  CODES.map(stateCode => {
    // Loop through each district and write master state file for all districts together
    if (Array.isArray(DISTRICTS[STATE_MAPPINGS[stateCode]])) {
      DISTRICTS[STATE_MAPPINGS[stateCode]].forEach(
        (district: string, index: number) => {
          districtContentByState.push(
            retrieveDistrictsDataByState(
              parsedMasterData,
              stateCode,
              district,
              index
            )
          )
        }
      )
    }
  })
  fs.writeFileSync(
    `data/districts/districts.json`,
    JSON.stringify(districtContentByState)
  )
}

const retrieveDistrictsDataByState = (
  masterData: Record<string, DistrictAPIEntry[]>,
  stateCode: STATE_CODES,
  district: string,
  index: number
) => {
  const data: DATA_ENTRY[] = []
  getPastDates().forEach(
    dateReducer(data, masterData, [STATE_MAPPINGS[stateCode], district]),
    {}
  )
  return {
    data,
    name: stateCode,
    district: index,
  }
}

export default processDistrictData
