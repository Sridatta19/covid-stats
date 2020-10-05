var fs = require("fs")
const STATE_CODES = require("./stateCodes")
const DISTRICTS = require("./districtNames")
const {
  safeGet,
  getDates,
  isNotNearDate,
  createEntry,
  createDefaultEntry,
  calculateGrowth,
} = require("./utils")

const processStateData = () => {
  const masterData = JSON.parse(fs.readFileSync("data-all.json", "utf8"))
  const masterStatesArray = Object.keys(STATE_CODES).reduce(
    stateReducer(masterData),
    []
  )
  fs.writeFileSync(`data/states/states.json`, JSON.stringify(masterStatesArray))
}

const stateReducer = masterData => (masterStates, stateCode) => {
  const content = getDates().reduce((acc, date) => {
    // Check if State data exists for each date
    const stateData = safeGet([date, stateCode], masterData)
    if (stateData) {
      const { delta, total } = stateData
      if (
        isNotNearDate(date) ||
        (delta && delta.confirmed && delta.confirmed !== 0)
      ) {
        acc[date] = createEntry(date, delta, total)
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
    gc: calculateGrowth(stateCode, data, "tc"),
    gd: calculateGrowth(stateCode, data, "td"),
    gr: calculateGrowth(stateCode, data, "tr"),
  })
}

module.exports = processStateData
