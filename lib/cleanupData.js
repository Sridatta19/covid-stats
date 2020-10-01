var fs = require("fs")
var path = require("path")
var rimraf = require("rimraf")

const cleanupGeneratedData = () => {
  // Cleanup Generated Data
  rimraf(path.join(__dirname, "./data"), err => {
    if (err) {
      console.error("An error occurred while performing operation")
    }
  })
}

cleanupGeneratedData()
