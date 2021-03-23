import React, { useEffect, useRef } from "react"
import * as mapboxgl from "mapbox-gl"

import { KEY_MAPPINGS } from "../utils/constants"
import { getPopupDescription } from "./Utils/getPopupDescription"
import DISTRICT_CODES from "../../../lib/districtNames"
import stateCodes from "../../../lib/stateCodes"
import { fmt, transformKeys } from "../utils/fn-utils"

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default
//Refer: https://github.com/mapbox/mapbox-gl-js/issues/10173

const STATE_MAPPINGS = transformKeys(stateCodes, s => s.toLowerCase())

mapboxgl.accessToken = process.env.GATSBY_MAPBOX_TOKEN

var map

const MapboxComponent = ({ stateId, dataKey, stepFn, zoomMap, centerMap }) => {
  const mapEl = useRef(null)
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapEl.current,
      style: "mapbox://styles/sridatta7/ckf41otga185y19s7k8q8fi1z",
      zoom: zoomMap[stateId],
      minZoom: zoomMap[stateId],
      center: centerMap[stateId],
    })
    var hoveredStateId = null

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeOnClick: false,
    })

    map.on("error", e => {
      // Hide those annoying non-error errors
      if (e && e.error !== "Error: Not Found") console.error(e)
    })

    map.on("load", function () {
      map.addSource("states", {
        type: "geojson",
        data: `https://raw.githubusercontent.com/Sridatta19/covid-stats/maps/lib/geojson/${stateId}.json`,
      })

      let fillColors = [
        "step",
        ["get", KEY_MAPPINGS[dataKey].totalKey],
        KEY_MAPPINGS[dataKey].palette[0],
        stepFn(0.3),
        KEY_MAPPINGS[dataKey].palette[1],
        stepFn(0.5),
        KEY_MAPPINGS[dataKey].palette[2],
        stepFn(0.7),
        KEY_MAPPINGS[dataKey].palette[3],
        stepFn(0.9),
        KEY_MAPPINGS[dataKey].palette[4],
      ]

      if (stepFn(0) === stepFn(1)) {
        fillColors = [
          "interpolate",
          ["linear"],
          ["get", KEY_MAPPINGS[dataKey].totalKey],
          stepFn(0),
          KEY_MAPPINGS[dataKey].palette[0],
        ]
      }

      map.addLayer({
        id: "state-fills",
        type: "fill",
        source: "states",
        layout: {},
        paint: {
          "fill-color": fillColors,
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.6,
            1,
          ],
        },
      })

      map.addLayer({
        id: "state-borders",
        type: "line",
        source: "states",
        layout: {},
        paint: {
          "line-color": "#F7FAFC",
          "line-width": 1,
        },
      })

      map.on("mousemove", "state-fills", function (e) {
        // db.set(`zooms.${stateId}`, parseFloat(map.getZoom()).toFixed(2)).write()
        // db.set(`center.${stateId}`, [
        //   parseFloat(map.getCenter().lng).toFixed(2),
        //   parseFloat(map.getCenter().lat).toFixed(2),
        // ]).write()

        if (e.features.length > 0) {
          if (hoveredStateId) {
            map.setFeatureState(
              { source: "states", id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = e.features[0].id
          map.setFeatureState(
            { source: "states", id: hoveredStateId },
            { hover: true }
          )
          const id = e.features[0].properties.id
          const getDistrictName = id => {
            const [stateCode, districtKey] = id.split("_")
            return DISTRICT_CODES[STATE_MAPPINGS[stateCode.toLowerCase()]][
              districtKey
            ]
          }
          const label =
            stateId === "tt" || stateId === "dl"
              ? STATE_MAPPINGS[id.toLowerCase()]
              : getDistrictName(id)
          const totalCases = `${fmt(
            e.features[0].properties[KEY_MAPPINGS[dataKey].totalKey]
          )}`
          const cases = `${fmt(e.features[0].properties[dataKey])}`
          const { lng, lat } = e.lngLat
          popup
            .setLngLat([lng, lat])
            .setHTML(
              getPopupDescription(
                label,
                totalCases,
                e.features[0].properties.date,
                cases
              )
            )
            .addTo(map)
        }
      })

      map.on("mouseenter", "states-fills", function () {
        map.getCanvas().style.cursor = "pointer"
      })

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on("mouseleave", "state-fills", function () {
        map.getCanvas().style.cursor = ""
        popup.remove()
        if (hoveredStateId) {
          map.setFeatureState(
            { source: "states", id: hoveredStateId },
            { hover: false }
          )
        }
        hoveredStateId = null
      })
    })

    // map.scrollZoom.disable()
    return () => {
      if (map !== undefined) map.remove()
    }
  }, [stateId, dataKey, stepFn, zoomMap, centerMap])
  return (
    <>
      <div className="flex-1" ref={mapEl}></div>
      {stepFn(0) !== stepFn(1) && (
        <div className="mt-0.5 h-8 md:h-6 sm:w-96 mx-8 sm:mx-auto">
          <div className="flex h-4 md:h-3 min-w-full border border-gray-600 dark:border-gray-100">
            {KEY_MAPPINGS[dataKey].palette.map(paletteColor => (
              <div
                key={paletteColor}
                className="w-1/5"
                style={{ backgroundColor: `${paletteColor}` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between min-w-full h-4 text-xxs sm:text-xs lg:text-sm font-serif text-primary">
            {[0, 0.3, 0.5, 0.7, 0.9, 1].map(val => (
              <p key={val}>{fmt(stepFn(val))}</p>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MapboxComponent
