import React from "react"
import { quantile } from "d3-array"
import Loadable from "@loadable/component"

import { filterPredicate } from "../utils/fn-utils"
import { KEY_MAPPINGS } from "../utils/constants"

import {
  LARGE_ZOOM_MAP,
  LARGE_CENTER_MAP,
  COORD_ZOOM_MAP,
  COORD_CENTER_MAP,
} from "./Utils"

const MapboxComponent = Loadable(() => import("./Mapbox"))

const Mapbox = ({ dataKey, stateId, data, childData, isMedium }) => {
  let modifiedData = Object.keys(childData).reduce((acc, childKey) => {
    if (childKey !== "TT" && filterPredicate(childKey)) {
      return {
        ...acc,
        [childKey]:
          childData[childKey].data[childData[childKey].data.length - 1],
      }
    }
    return acc
  }, {})
  if (stateId === "dl") {
    modifiedData = {
      Delhi: data[data.length - 1],
    }
  }
  const stepFn = p =>
    Math.floor(
      quantile(
        Object.values(modifiedData).map(d => d[KEY_MAPPINGS[dataKey].totalKey]),
        p
      )
    )
  return (
    <MapboxComponent
      zoomMap={isMedium ? LARGE_ZOOM_MAP : COORD_ZOOM_MAP}
      centerMap={isMedium ? LARGE_CENTER_MAP : COORD_CENTER_MAP}
      stepFn={stepFn}
      dataKey={dataKey}
      stateId={stateId}
    />
  )
}

export default Mapbox
