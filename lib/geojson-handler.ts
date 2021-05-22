import fs from "fs"
import STATE_MAPPINGS, { STATE_CODES } from "./stateCodes"
import DISTRICTS from "./districtNames"
import { getReverseStateMappings } from "./utils"
import { DATA_ENTRY, DISTRICT_DATA, STATE_DATA } from "./type-definitions"

const processGeojsons = () => {
  const filenames = fs.readdirSync("maps")
  filenames.forEach(filename => {
    if (filename.indexOf("json") !== -1) {
      const geojson = JSON.parse(fs.readFileSync(`maps/${filename}`, "utf8"))
      if (filename === "tt.json") {
        const states: STATE_DATA[] = JSON.parse(
          fs.readFileSync("data/states/states.json", "utf8")
        )
        const latestStateData: {
          [key in STATE_CODES]?: DATA_ENTRY
        } = states.reduce(
          (acc, stateEntry) => ({
            ...acc,
            [stateEntry.id]: stateEntry.data.pop(),
          }),
          {}
        )
        const modifiedgeojson = processTTGeojsonData(geojson, latestStateData)
        fs.writeFileSync(`geojson/tt.json`, JSON.stringify(modifiedgeojson))
      } else if (filename === "dl.json") {
        const states: STATE_DATA[] = JSON.parse(
          fs.readFileSync("data/states/states.json", "utf8")
        )
        const [{ data }] = states.filter(stateEntry => stateEntry.id === "DL")
        const modifiedgeojson = geojson
        modifiedgeojson.features = modifiedgeojson.features.map(
          (feature: any, index: number) => {
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
        const districts: DISTRICT_DATA[] = JSON.parse(
          fs.readFileSync("data/districts/districts.json", "utf8")
        )
        const latestDistrictData: {
          [key: string]: DATA_ENTRY
        } = districts.reduce(
          (acc, { name, district, data }) => ({
            ...acc,
            [`${name}_${district}`]: data.pop(),
          }),
          {}
        )
        const modifiedgeojson = processStateGeojsonData(
          geojson,
          latestDistrictData
        )
        fs.writeFileSync(`geojson/${filename}`, JSON.stringify(modifiedgeojson))
      }
    }
  })
}

const processTTGeojsonData = (
  geojson: any,
  reducedStates: {
    [key in STATE_CODES]?: DATA_ENTRY
  }
) => {
  let modifiedFile = geojson
  const stateReverseMappings = getReverseStateMappings()
  modifiedFile.features = modifiedFile.features.map(
    (feature: any, index: number) => {
      const stateCode: STATE_CODES = stateReverseMappings[
        feature.properties["st_nm"]
      ] as STATE_CODES
      return {
        ...feature,
        id: index + 1,
        properties: {
          ...reducedStates[stateCode],
          id: stateCode,
        },
      }
    }
  )
  return modifiedFile
}

const processStateGeojsonData = (
  geojson: any,
  reducedDistricts: {
    [key: string]: DATA_ENTRY
  }
) => {
  let modifiedFile = geojson
  const stateReverseMappings = getReverseStateMappings()
  modifiedFile.features = modifiedFile.features.map(
    (feature: any, index: number) => {
      const stateCode: STATE_CODES = stateReverseMappings[
        feature.properties["st_nm"]
      ] as STATE_CODES
      const districtKey: string = DISTRICTS[STATE_MAPPINGS[stateCode]].indexOf(
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
    }
  )
  return modifiedFile
}

export default processGeojsons
