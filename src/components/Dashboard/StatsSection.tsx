import React from "react"
import { regressionPoly } from "d3-regression"

import { FadeContainer } from "../Animation"
import {
  fmt,
  getShortMonth,
  retrieveRecentDatesFormatted,
  calculateAverage,
} from "../utils/fn-utils"
import {
  KEY_MAPPINGS,
  LINE_DAYS,
  TREND_DAYS,
  dateAccessor,
} from "../utils/constants"
import { LineChart } from "../Charts"

const StatsSection = ({ data, dataKey }: StatsProps) => {
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

const TotalInfo = ({ data, dataKey }: StatsProps) => (
  <>
    <p className="text-xs text-tertiary font-medium truncate">
      {KEY_MAPPINGS[dataKey].totalLabel}
    </p>
    <span className="highlight-color">
      {fmt(Number(data[data.length - 1][KEY_MAPPINGS[dataKey].totalKey]))}
    </span>
  </>
)

const DailyInfo = ({ data, dataKey }: StatsProps) => (
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
  const averageDataChange: number = calculateAverage(data, dataKey)
  return (
    <>
      <p className="text-xs text-tertiary font-medium">{`Last ${TREND_DAYS} Days`}</p>
      <span className="highlight-color">{`${
        averageDataChange > 0 ? "+" : ""
      }${averageDataChange}%`}</span>
    </>
  )
}

const TrendLine = ({ data, dataKey }: StatsProps) => {
  const trendDates: {
    [name: string]: boolean
  } = retrieveRecentDatesFormatted(LINE_DAYS)
  const lineData: NodeType[] = data.filter(
    entry => trendDates[entry.date.trim()]
  )
  type RegressionFunction = (d: NodeType[]) => number[][]
  const quad: RegressionFunction = regressionPoly()
    .x(dateAccessor)
    .y(d => d[dataKey])
    .order(3)
  return (
    <div className="h-8 w-4/5 md:w-24">
      <p className="mb-1 text-xs text-tertiary font-medium">Trend</p>
      <LineChart
        gradientColors={KEY_MAPPINGS[dataKey].gradient}
        data={quad(lineData.slice(0, lineData.length - 2))}
        xAccessor={d => d[0]}
        yAccessor={d => d[1]}
        yAccessorKey={dataKey}
        label="Confirmed"
        stroke={KEY_MAPPINGS[dataKey].stroke}
      />
    </div>
  )
}

interface NodeType {
  date: string
  dc: number
  dd: number
  dr: number
  tc: number
  td: number
  tr: number
}

interface StatsProps {
  data: NodeType[]
  dataKey: keyof typeof KEY_MAPPINGS
}

export default StatsSection
