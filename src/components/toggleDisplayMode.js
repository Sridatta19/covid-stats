import React from "react"
import { ChartIcon, ListIcon, MapIcon } from "@components/icons"

const ToggleDisplayMode = ({ displayMode, setMode }) => {
  return (
    <div className="flex justify-center items-center">
      <span className="relative z-0 inline-flex shadow-sm rounded-md">
        <button
          aria-label="Charts"
          onClick={() => setMode("chart")}
          className={`toggle-button ${
            displayMode === "chart" ? "dark-bg" : "bg-transparent"
          } rounded-l-md`}
        >
          <ChartIcon
            classes={displayMode === "chart" ? "text-light" : "text-secondary"}
          />
        </button>
        <button
          aria-label="List"
          onClick={() => setMode("list")}
          className={`toggle-button  ${
            displayMode === "list" ? "dark-bg" : "bg-transparent"
          } `}
        >
          <ListIcon
            classes={displayMode === "list" ? "text-light" : "text-secondary"}
          />
        </button>
        <button
          aria-label="Maps"
          onClick={() => setMode("map")}
          className={`-ml-px toggle-button ${
            displayMode === "map" ? "dark-bg" : "bg-transparent"
          } rounded-r-md`}
        >
          <MapIcon
            classes={displayMode === "map" ? "text-light" : "text-secondary"}
          />
        </button>
      </span>
    </div>
  )
}

export default ToggleDisplayMode
