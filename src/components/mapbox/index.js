import React from "react"
import { quantile } from "d3-array"
import { PropTypes } from "prop-types"
import Loadable from "@loadable/component"

import { filterPredicate } from "@utils/fn-utils"
import { TOTAL_KEY_MAPPINGS } from "@utils/constants"
import { StatNodeType, validateChildData } from "@utils/type-definitions"

import { LARGE_ZOOM_MAP } from "@utils/map/lg-zoom"
import { LARGE_CENTER_MAP } from "@utils/map/lg-centers"
import { COORD_ZOOM_MAP } from "@utils/map/sm-zoom"
import { COORD_CENTER_MAP } from "@utils/map/sm-centers"

const MapboxComponent = Loadable(() => import("@components/mapbox/map-impl"))

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
        Object.values(modifiedData).map(d => d[TOTAL_KEY_MAPPINGS[dataKey]]),
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

Mapbox.propTypes = {
  data: PropTypes.arrayOf(StatNodeType),
  dataKey: PropTypes.string.isRequired,
  stateId: PropTypes.string.isRequired,
  isMedium: PropTypes.bool,
  childData: validateChildData,
}

export default Mapbox
