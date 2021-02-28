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

const parseDistrictData = masterData => {
  return masterData.reduce((acc, elem) => {
    if (acc[elem.Date] != undefined) {
      // Date is already present
      if (acc[elem.Date][elem.State] != undefined) {
        // Date and State are already present
        acc[elem.Date] = {
          ...acc[elem.Date],
          [elem.State]: {
            ...acc[elem.Date][elem.State],
            [elem.District]: elem,
          },
        }
      } else {
        // Date is present AND other States are present
        acc[elem.Date] = {
          ...acc[elem.Date],
          [elem.State]: {
            [elem.District]: elem,
          },
        }
      }
    } else {
      acc[elem.Date] = {
        [elem.State]: {
          [elem.District]: elem,
        },
      }
    }
    return acc
  }, {})
}

const processDistrictData = () => {
  const { districts: masterData } = JSON.parse(
    fs.readFileSync("districts.json", "utf8")
  )
  const parsedMasterData = parseDistrictData(masterData)
  const districtContentByState = []
  Object.keys(STATE_CODES).map(stateCode => {
    // Loop through each district and write master state file for all districts together
    if (Array.isArray(DISTRICTS[STATE_CODES[stateCode]])) {
      DISTRICTS[STATE_CODES[stateCode]].forEach((district, index) => {
        districtContentByState.push(
          retrieveDistrictsDataByState(
            parsedMasterData,
            stateCode,
            district,
            index
          )
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
  const content = getDates().reduce((acc, date, index, dates) => {
    if (index === 0) {
      return acc
    }
    const districtDate = safeGet(
      [date, STATE_CODES[stateCode], district],
      masterData
    )
    const previousDate = safeGet(
      [dates[index - 1], STATE_CODES[stateCode], district],
      masterData
    )
    if (districtDate && previousDate) {
      const { Confirmed } = districtDate
      if (
        isNotNearDate(date) ||
        Math.abs(Confirmed - previousDate.Confirmed) !== 0
      ) {
        acc[date] = createEntry(date, districtDate, previousDate)
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
  }
}

module.exports = processDistrictData
