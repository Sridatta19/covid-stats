import React from "react"
import { PropTypes } from "prop-types"
import { navigate } from "gatsby"
import { m as motion, AnimatePresence } from "framer-motion"

import Linechart from "./linechart"
import {
  dateAccessor,
  LINE_DAYS,
  TOTAL_KEY_MAPPINGS,
  LABEL_MAPPINGS,
} from "@utils/constants"
import {
  retrieveRecentDatesFormatted,
  getDistrictId,
  transformKeys,
  filterPredicate,
} from "@utils/fn-utils"
import DISTRICT_CODES from "@lib/districtNames"
import stateCodes from "@lib/stateCodes"

const STATE_CODES = transformKeys(stateCodes, s => s.toLowerCase())

const PANEL_VARIANTS = {
  enter: {
    x: "-100%",
    opacity: 0,
  },
  center: i => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.48,
      ease: [0.445, 0.05, 0.55, 0.95],
      delay: 1 + i * 0.04,
    },
  }),
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3, delay: 0.15 },
  },
}

const ChildDashboard = ({ childData, dataKey, stateId }) => {
  const dates = retrieveRecentDatesFormatted(LINE_DAYS)
  const filtered = Object.keys(childData)
    .map(key => ({
      key,
      ...childData[key],
    }))
    .filter(d => {
      return d.key !== "TT" && filterPredicate(d)
    })
  filtered.sort(
    (a1, a2) =>
      a2.data[a2.data.length - 1][dataKey] -
      a1.data[a1.data.length - 1][dataKey]
  )
  const length = 12
  return (
    <div>
      <Subtitle dataKey={dataKey} />
      <div className="mt-4 mx-4 grid grid-cols-4 gap-x-4 gap-y-2.5 md:gap-y-3 text-blue text-sm md:text-lg font-rose font-bold">
        <AnimatePresence>
          {filtered.slice(0, length).map(({ key: childKey, data }, index) => {
            const label = getDistrictId(childKey)
            return (
              <motion.div
                key={index}
                custom={index + 1}
                variants={PANEL_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                role="button"
                className="justify-self-center flex items-baseline cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 hover:opacity-75 focus:outline-none focus:shadow-outline-blue focus:border-teal-700 dark:focus:border-gray-50"
                onClick={() => {
                  if (stateId && stateId !== "tt") {
                    navigate(
                      `/state/${stateId}/district/${DISTRICT_CODES[
                        STATE_CODES[stateId]
                      ].indexOf(childKey)}`
                    )
                  } else {
                    navigate(`/state/${label.toLowerCase()}`)
                  }
                }}
              >
                <span className="text-sm md:text-base text-primary border-b-2 border-primary uppercase">
                  {label}
                </span>
                <div className="ml-2 w-6 h-4">
                  <Linechart
                    data={data.filter(entry => dates[entry.date.trim()])}
                    xAccessor={dateAccessor}
                    yAccessor={d => d[TOTAL_KEY_MAPPINGS[dataKey]]}
                    yAccessorKey={TOTAL_KEY_MAPPINGS[dataKey]}
                    label="Confirmed"
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

const Subtitle = ({ dataKey }) => (
  <div className="text-center text-primary text-sm md:text-lg font-arvo md:font-serif">
    <span>Where</span>
    <span className="ml-1 border-b border-primary">
      {LABEL_MAPPINGS[dataKey]}
    </span>
    <span className="ml-1">are currently the</span>
    <span className="ml-1 font-bold">highest</span>
  </div>
)

Subtitle.propTypes = {
  dataKey: PropTypes.string.isRequired,
}

export default ChildDashboard
