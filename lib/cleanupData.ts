import path from "path"
import rimraf from "rimraf"

const cleanupGeneratedData = () => {
  // Cleanup Generated Data
  rimraf(path.join(__dirname, "./data"), err => {
    if (err) {
      console.error("An error occurred while performing operation")
    }
  })
}

cleanupGeneratedData()
