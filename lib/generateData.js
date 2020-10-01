var fs = require("fs")
var path = require("path")
var rimraf = require("rimraf")
const fetch = require("node-fetch")
const processGeojsons = require("./geojson-handler")
const processStateData = require("./state-handler")
const processDistrictData = require("./districts-handler")

const generateReports = () => {
  fetch("https://api.covid19india.org/v4/data-all.json")
    .then(res => res.json())
    .then(filecontent => {
      fs.writeFileSync("data-all.json", JSON.stringify(filecontent))
      // Cleanup Pre-existing Data
      rimraf(path.join(__dirname, "./data"), err => {
        if (err) {
          console.error("An error occurred while performing operation")
        } else {
          processMasterData()
        }
      })
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
  // Unlink the fetched master data json
  fs.unlinkSync("data-all.json")
}

generateReports()
