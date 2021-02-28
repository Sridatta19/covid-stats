var fs = require("fs")
const STATE_CODES = require("./stateCodes")
const DISTRICTS = require("./districtNames")
const {
  safeGet,
  getDates,
  isNotNearDate,
  createEntry,
  createDefaultEntry,
} = require("./utils")

const parseStateData = masterData => {
  return masterData.reduce((acc, elem) => {
    if (acc[elem.Date] != undefined) {
      // Date is already present
      acc[elem.Date] = {
        ...acc[elem.Date],
        [elem.State]: elem,
      }
    } else {
      acc[elem.Date] = {
        [elem.State]: elem,
      }
    }
    return acc
  }, {})
}

const processStateData = () => {
  const { states: masterData } = JSON.parse(
    fs.readFileSync("states.json", "utf8")
  )
  const parsedStateData = parseStateData(masterData)
  const masterStatesArray = Object.keys(STATE_CODES).reduce(
    stateReducer(parsedStateData),
    []
  )
  fs.writeFileSync(`data/states/states.json`, JSON.stringify(masterStatesArray))
}

const stateReducer = masterData => (masterStates, stateCode) => {
  const content = getDates().reduce((acc, date, index, dates) => {
    if (index === 0) {
      return acc
    }
    // Check if State data exists for each date
    const stateData = safeGet([date, STATE_CODES[stateCode]], masterData)
    const previousDate = safeGet(
      [dates[index - 1], STATE_CODES[stateCode]],
      masterData
    )
    if (stateData && previousDate) {
      const { Confirmed } = stateData
      if (
        isNotNearDate(date) ||
        (Confirmed && Math.abs(Confirmed - previousDate.Confirmed) !== 0)
      ) {
        acc[date] = createEntry(date, stateData, previousDate)
      }
    } else if (isNotNearDate(date)) {
      acc[date] = createDefaultEntry(date)
    }
    return acc
  }, {})
  const data = Object.values(content)
  return masterStates.concat({
    data,
    id: stateCode,
  })
}

module.exports = processStateData
