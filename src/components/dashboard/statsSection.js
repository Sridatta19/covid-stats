import React from "react"
import { PropTypes } from "prop-types"

import FadeContainer from "@components/fadeContainer"
import {
  fmt,
  getShortMonth,
  retrieveRecentDatesFormatted,
  calculateAverage,
} from "@utils/fn-utils"
import {
  KEY_GRADIENTS,
  TOTAL_KEY_MAPPINGS,
  TOTAL_MAPPINGS,
  STROKES,
  TREND_DAYS,
  dateAccessor,
} from "@utils/constants"
import Linechart from "@components/linechart"
import { validateChildData, StatNodeType } from "@utils/type-definitions"
import { regressionPoly } from "d3-regression"

const StatsSection = ({ data, dataKey }) => {
  return (
    <div className="mt-10 md:mt-12 mx-4 grid grid-cols-4 gap-x-2 gap-y-1 text-center">
      <FadeContainer>
        <TotalInfo dataKey={dataKey} data={data} />
        <DailyInfo dataKey={dataKey} data={data} />
        <RecentInfo dataKey={dataKey} data={data} />
        <TrendLine dataKey={dataKey} data={data} />
      </FadeContainer>
      <div className="mt-1 col-span-4 grid grid-cols-4 items-center sm:mx-32 lg:mx-4">
        <div className="h-2 rounded-sm bg-gradient-to-r from-gray-100 dark:from-gray-700 to-red-500 dark:to-yellow-200 block"></div>
        <p className="text-xxs sm:text-xs lg:text-sm text-tertiary font-medium col-span-2">
          {`${TREND_DAYS} day change uses 7-day averages`}
        </p>
        <div className="h-2 rounded-sm bg-gradient-to-l from-gray-100 dark:from-gray-700 to-red-500 dark:to-yellow-200 block"></div>
      </div>
    </div>
  )
}

const TotalInfo = ({ data, dataKey }) => (
  <>
    <p className="text-xs text-tertiary font-medium truncate">
      {TOTAL_MAPPINGS[dataKey]}
    </p>
    <span className="highlight-color">
      {fmt(Number(data[data.length - 1][TOTAL_KEY_MAPPINGS[dataKey]]))}
    </span>
  </>
)

const DailyInfo = ({ data, dataKey }) => (
  <>
    <p className="text-xs text-tertiary font-medium">
      {getShortMonth(data[data.length - 1].date)}
    </p>
    <span className="highlight-color">
      {fmt(Number(data[data.length - 1][dataKey]))}
    </span>
  </>
)

const RecentInfo = ({ data, dataKey }) => {
  const avg = calculateAverage(data, dataKey)
  return (
    <>
      <p className="text-xs text-tertiary font-medium">{`Last ${TREND_DAYS} Days`}</p>
      <span className="highlight-color">{`${avg > 0 ? "+" : ""}${avg}%`}</span>
    </>
  )
}

const TrendLine = ({ data, dataKey }) => {
  const trendDates = retrieveRecentDatesFormatted(TREND_DAYS + 1)
  const lineData = data.filter(entry => trendDates[entry.date.trim()])
  const quad = regressionPoly()
    .x(dateAccessor)
    .y(d => d[dataKey])
    .order(3)
  return (
    <div className="h-12 w-4/5 md:w-24">
      <p className="text-xs text-tertiary font-medium">Trend</p>
      <Linechart
        gradientColors={KEY_GRADIENTS[dataKey]}
        data={quad(lineData.slice(0, lineData.length - 2))}
        xAccessor={d => d[0]}
        yAccessor={d => d[1]}
        yAccessorKey={dataKey}
        label="Confirmed"
        stroke={STROKES[dataKey]}
      />
    </div>
  )
}

StatsSection.propTypes = {
  data: PropTypes.arrayOf(StatNodeType),
  childData: validateChildData,
}

TrendLine.propTypes = {
  data: PropTypes.arrayOf(StatNodeType),
  childData: validateChildData,
}

export default StatsSection
