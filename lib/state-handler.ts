import fs from "fs"
import STATE_MAPPINGS, { STATE_CODES } from "./stateCodes"
import {
  DATA_ENTRY,
  StateAPIEntry,
  STATE_DATA,
  STATE_DETAILS,
} from "./type-definitions"
import { getPastDates, getStateCodes, groupByMulti, dateReducer } from "./utils"

const parseStateData = (masterData: StateAPIEntry[]) =>
  groupByMulti(
    [(elem: StateAPIEntry) => elem.State, (elem: StateAPIEntry) => elem.Date],
    masterData
  )

const processStateData = () => {
  const { states: masterData } = JSON.parse(
    fs.readFileSync("states.json", "utf8")
  )
  const stateData: STATE_DETAILS = parseStateData(masterData)
  const CODES = getStateCodes()
  const masterStatesArray: STATE_DATA[] = []
  CODES.forEach(stateCode => {
    masterStatesArray.push(getStateData(stateData, stateCode))
  })
  fs.writeFileSync(`data/states/states.json`, JSON.stringify(masterStatesArray))
}

const getStateData = (
  masterData: STATE_DETAILS,
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
