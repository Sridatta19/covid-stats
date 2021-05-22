import React from "react"
import { navigate } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"

import { LineChart } from "../Charts"
import { dateAccessor, LINE_DAYS, KEY_MAPPINGS } from "../utils/constants"
import {
  retrieveRecentDatesFormatted,
  getDistrictId,
  transformKeys,
  filterPredicate,
} from "../utils/fn-utils"
import DISTRICT_CODES from "../../../lib/districtNames"
import stateCodes from "../../../lib/stateCodes"

const STATE_MAPPINGS = transformKeys(stateCodes, s => s.toLowerCase())

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

interface ChildDashboardProps {
  dataKey: keyof typeof KEY_MAPPINGS
  stateId: keyof typeof STATE_MAPPINGS
  childData: any
}

const ChildDashboard = ({
  childData,
  dataKey,
  stateId,
}: ChildDashboardProps) => {
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
                        STATE_MAPPINGS[stateId]
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
                  <LineChart
                    data={data.filter(entry => dates[entry.date.trim()])}
                    xAccessor={dateAccessor}
                    yAccessor={d => d[KEY_MAPPINGS[dataKey].totalKey]}
                    yAccessorKey={KEY_MAPPINGS[dataKey].totalKey}
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

const Subtitle = ({ dataKey }: SubtitleProps) => (
  <div className="text-center text-primary text-sm md:text-lg font-arvo md:font-serif">
    <span>Where</span>
    <span className="ml-1 border-b border-primary">
      {KEY_MAPPINGS[dataKey].label}
    </span>
    <span className="ml-1">are currently the</span>
    <span className="ml-1 font-bold">highest</span>
  </div>
)

interface SubtitleProps {
  dataKey: keyof typeof KEY_MAPPINGS
}

export default ChildDashboard
