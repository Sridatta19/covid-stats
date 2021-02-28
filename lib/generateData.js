var fs = require("fs")
var path = require("path")
var rimraf = require("rimraf")
const fetch = require("node-fetch")
const request = require("request")
const csv = require("csvtojson")
const processGeojsons = require("./geojson-handler")
const processStateData = require("./state-handler")
const processDistrictData = require("./districts-handler")

const readStates = callback => {
  const states = []
  csv()
    .fromStream(
      request.get("https://api.covid19india.org/csv/latest/states.csv")
    )
    .subscribe(
      json => {
        return new Promise((resolve, reject) => {
          states.push(json)
          resolve()
        })
      },
      err => console.error("An error occurred while processing states", err),
      () => {
        console.log("PROCESSING STATES COMPLETE")
        fs.writeFileSync("states.json", JSON.stringify({ states }))
        callback()
      }
    )
}

const readDistricts = () => {
  const districts = []
  csv()
    .fromStream(
      request.get("https://api.covid19india.org/csv/latest/districts.csv")
    )
    .subscribe(
      json => {
        return new Promise((resolve, reject) => {
          districts.push(json)
          resolve()
        })
      },
      err => console.error("An error occurred while processing districts", err),
      () => {
        console.log("PROCESSING DISTRICTS COMPLETE")
        fs.writeFileSync("districts.json", JSON.stringify({ districts }))
        processMasterData()
      }
    )
}

const generateReports = () => {
  rimraf(path.join(__dirname, "./data"), err => {
    if (err) {
      console.error("An error occurred while performing operation")
    } else {
      console.log("CLEANED PRE_EXISTING DATA")
      readStates(readDistricts)
    }
  })
}

const processMasterData = () => {
  console.info("Remove pre-existing data")
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
