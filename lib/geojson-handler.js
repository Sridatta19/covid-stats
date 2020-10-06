var fs = require("fs")
const STATE_CODES = require("./stateCodes")
const DISTRICTS = require("./districtNames")

const processGeojsons = () => {
  const filenames = fs.readdirSync("maps")
  filenames.forEach(filename => {
    if (filename.indexOf("json") !== -1) {
      const geojson = JSON.parse(fs.readFileSync(`maps/${filename}`, "utf8"))
      if (filename === "tt.json") {
        const states = JSON.parse(
          fs.readFileSync("data/states/states.json", "utf8")
        )
        const reducedStates = states.reduce(
          (acc, stateEntry) => ({
            ...acc,
            [stateEntry.id]: stateEntry.data.pop(),
          }),
          {}
        )
        const modifiedgeojson = processTTGeojsonData(geojson, reducedStates)
        fs.writeFileSync(`geojson/tt.json`, JSON.stringify(modifiedgeojson))
      } else if (filename === "dl.json") {
        const states = JSON.parse(
          fs.readFileSync("data/states/states.json", "utf8")
        )
        const [{ data }] = states.filter(stateEntry => stateEntry.id === "DL")
        const modifiedgeojson = geojson
        modifiedgeojson.features = modifiedgeojson.features.map(
          (feature, index) => {
            return {
              ...feature,
              id: index + 1,
              properties: {
                ...data.pop(),
                id: "DL",
              },
            }
          }
        )
        fs.writeFileSync(`geojson/dl.json`, JSON.stringify(modifiedgeojson))
      } else {
        const districts = JSON.parse(
          fs.readFileSync("data/districts/districts.json", "utf8")
        )
        const reducedDistricts = districts.reduce(
          (acc, { name, district, data }) => ({
            ...acc,
            [`${name}_${district}`]: data.pop(),
          }),
          {}
        )
        const modifiedgeojson = processStateGeojsonData(
          geojson,
          reducedDistricts
        )
        fs.writeFileSync(`geojson/${filename}`, JSON.stringify(modifiedgeojson))
      }
    }
  })
}

const processTTGeojsonData = (geojson, reducedStates) => {
  let modifiedFile = geojson
  const stateReverseMappings = Object.keys(STATE_CODES).reduce(
    (acc, elem) => ({ ...acc, [STATE_CODES[elem]]: elem }),
    {}
  )
  modifiedFile.features = modifiedFile.features.map((feature, index) => {
    const stateCode = stateReverseMappings[feature.properties["st_nm"]]
    return {
      ...feature,
      id: index + 1,
      properties: {
        ...reducedStates[stateCode],
        id: stateCode,
      },
    }
  })
  return modifiedFile
}

const processStateGeojsonData = (geojson, reducedDistricts) => {
  let modifiedFile = geojson
  const stateReverseMappings = Object.keys(STATE_CODES).reduce(
    (acc, elem) => ({ ...acc, [STATE_CODES[elem]]: elem }),
    {}
  )
  modifiedFile.features = modifiedFile.features.map((feature, index) => {
    const stateCode = stateReverseMappings[feature.properties["st_nm"]]
    const districtKey = DISTRICTS[STATE_CODES[stateCode]].indexOf(
      feature.properties["district"]
    )
    const idKey = `${stateCode}_${districtKey}`
    return {
      ...feature,
      id: index + 1,
      properties: {
        ...reducedDistricts[idKey],
        id: idKey,
      },
    }
  })
  return modifiedFile
}

module.exports = processGeojsons
