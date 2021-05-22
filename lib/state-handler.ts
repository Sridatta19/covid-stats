import fs from "fs"
import STATE_MAPPINGS, { STATE_CODES } from "./stateCodes"
import { DATA_ENTRY, StateAPIEntry, STATE_DATA } from "./type-definitions"
import { getPastDates, getStateCodes, dateReducer, groupBy } from "./utils"

const parseStateData = (masterData: StateAPIEntry[]) =>
  groupBy((elem: StateAPIEntry) => `${elem.Date}_${elem.State}`, masterData)

const processStateData = () => {
  const { states: masterData } = JSON.parse(
    fs.readFileSync("states.json", "utf8")
  )
  const stateData: Record<string, StateAPIEntry[]> = parseStateData(masterData)
  const CODES = getStateCodes()
  const masterStatesArray: STATE_DATA[] = []
  CODES.forEach(stateCode => {
    masterStatesArray.push(getStateData(stateData, stateCode))
  })
  fs.writeFileSync(`data/states/states.json`, JSON.stringify(masterStatesArray))
}

const getStateData = (
  masterData: Record<string, StateAPIEntry[]>,
  stateCode: STATE_CODES
): STATE_DATA => {
  const data: DATA_ENTRY[] = []
  getPastDates().forEach(
    dateReducer(data, masterData, [STATE_MAPPINGS[stateCode]]),
    {}
  )
  return {
    data,
    id: stateCode,
  }
}

export default processStateData
