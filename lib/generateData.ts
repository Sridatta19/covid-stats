import fs from "fs"
import path from "path"
import rimraf from "rimraf"
import request from "request"
import csv from "csvtojson"
import processGeojsons from "./geojson-handler"
import processStateData from "./state-handler"
import processDistrictData from "./districts-handler"
import CSVError from "csvtojson/v2/CSVError"
import { APIEntry, DistrictAPIEntry, StateAPIEntry } from "./type-definitions"
import { getPastDates } from "./utils"

const onNext =
  <T extends APIEntry>(result: T[]) =>
  (data: any) => {
    return new Promise<void>(function (resolve) {
      result.push(data)
      resolve()
    })
  }
const onError = (term: string) => (err: CSVError) =>
  console.error(`An error occurred while processing ${term}`, err)

const onComplete =
  <T extends APIEntry>(term: string, result: T[]) =>
  () => {
    console.log(`PROCESSING ${term} COMPLETE`)
    const dates: string[] = getPastDates()
    const filtered = result.filter(
      (entry: APIEntry) => dates.indexOf(entry.Date) !== -1
    )
    fs.writeFileSync(`${term}.json`, JSON.stringify({ [term]: filtered }))
  }

const readData = async <T extends APIEntry>(term: string) => {
  const result: T[] = []
  await csv()
    .fromStream(
      request.get(`https://api.covid19india.org/csv/latest/${term}.csv`) as any
    )
    .subscribe(onNext(result), onError(term), onComplete(term, result))
}

const generateReports = async () => {
  try {
    rimraf.sync(path.join(__dirname, "./data"))
    console.log("CLEANED PRE_EXISTING DATA")
    // Retrieve States Data from APIs
    await readData<StateAPIEntry>("states")
    // Retrieve Districts Data from APIs
    await readData<DistrictAPIEntry>("districts")
    // Process Data
    processMasterData()
  } catch (err) {
    console.error("An error occurred while performing operation")
  }
}

const processMasterData = () => {
  fs.mkdirSync("data")

  // Process Districts Json Files
  fs.mkdirSync("data/districts")
  processDistrictData()
  console.info("Generated District files")

  // Process States Json File
  fs.mkdirSync("data/states")
  processStateData()
  console.info("Generated State file")

  // Rewrite All Geojson Files
  processGeojsons()
  console.info("Generated Updated Geojsons")
}

generateReports()
