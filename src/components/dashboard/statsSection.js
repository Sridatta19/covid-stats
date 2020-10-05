import React from "react"
import { PropTypes } from "prop-types"
import { InfoIcon } from "@components/icons"

import FadeContainer from "@components/fadeContainer"
import {
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

const StatsSection = ({ data, dataKey }) => {
  return (
    <div className="mt-10 md:mt-12 mx-4 grid grid-cols-4 gap-x-2 gap-y-1 text-center">
      <FadeContainer>
        <TotalInfo dataKey={dataKey} data={data} />
        <DailyInfo dataKey={dataKey} data={data} />
        <RecentInfo dataKey={dataKey} data={data} />
        <TrendLine dataKey={dataKey} data={data} />
      </FadeContainer>
      <div className="col-span-4 flex justify-center">
        <InfoIcon />
        <p className="text-xxs md:text-xs text-tertiary">
          {`${TREND_DAYS} day change uses 7-day averages`}
        </p>
      </div>
    </div>
  )
}

const TotalInfo = ({ data, dataKey }) => (
  <>
    <p className="text-xs text-tertiary truncate">{TOTAL_MAPPINGS[dataKey]}</p>
    <span className="highlight-color">
      {new Intl.NumberFormat("en-IN").format(
        Number(data[data.length - 1][TOTAL_KEY_MAPPINGS[dataKey]])
      )}
    </span>
  </>
)

const DailyInfo = ({ data, dataKey }) => (
  <>
    <p className="text-xs text-tertiary">
      {getShortMonth(data[data.length - 1].date)}
    </p>
    <span className="highlight-color">
      {new Intl.NumberFormat("en-IN").format(
        Number(data[data.length - 1][dataKey])
      )}
    </span>
  </>
)

const RecentInfo = ({ data, dataKey }) => {
  const avg = calculateAverage(data, dataKey)
  return (
    <>
      <p className="text-xs text-tertiary">{`Last ${TREND_DAYS} Days`}</p>
      <span className="highlight-color">{`${avg > 0 ? "+" : ""}${avg}%`}</span>
    </>
  )
}

const TrendLine = ({ data, dataKey }) => {
  const trendDates = retrieveRecentDatesFormatted(TREND_DAYS)
  const lineData = data.filter(entry => trendDates[entry.date.trim()])
  return (
    <div className="h-5 w-4/5 md:w-24">
      <p className="text-xs text-tertiary">Trend</p>
      <Linechart
        gradientColors={KEY_GRADIENTS[dataKey]}
        data={lineData.slice(0, lineData.length - 1)}
        xAccessor={dateAccessor}
        yAccessor={d => d[dataKey]}
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
