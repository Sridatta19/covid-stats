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

const processDistrictData = () => {
  const masterData = JSON.parse(fs.readFileSync("data-all.json", "utf8"))
  const districtContentByState = []
  Object.keys(STATE_CODES).map(stateCode => {
    // Loop through each district and write master state file for all districts together
    if (Array.isArray(DISTRICTS[STATE_CODES[stateCode]])) {
      DISTRICTS[STATE_CODES[stateCode]].forEach((district, index) => {
        districtContentByState.push(
          retrieveDistrictsDataByState(masterData, stateCode, district, index)
        )
      })
    }
  })
  fs.writeFileSync(
    `data/districts/districts.json`,
    JSON.stringify(districtContentByState)
  )
}

const retrieveDistrictsDataByState = (
  masterData,
  stateCode,
  district,
  index
) => {
  const content = getDates().reduce((acc, date) => {
    const districtDate = safeGet(
      [date, stateCode, "districts", district],
      masterData
    )
    if (districtDate) {
      const { delta, total } = districtDate
      if (isNotNearDate(date) || (delta && delta.confirmed !== 0)) {
        acc[date] = createEntry(date, delta, total)
      }
    } else if (isNotNearDate(date)) {
      acc[date] = createDefaultEntry(date)
    }
    return acc
  }, {})
  const data = Object.values(content)
  return {
    data,
    name: stateCode,
    district: index,
    gc: calculateGrowth(stateCode, data, "tc"),
    gd: calculateGrowth(stateCode, data, "td"),
    gr: calculateGrowth(stateCode, data, "tr"),
  }
}

module.exports = processDistrictData
