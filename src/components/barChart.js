import React, { useState } from "react"
import { scaleBand, scaleLinear } from "d3-scale"
import { range, max, quantile } from "d3-array"

import Chart from "./Chart/Chart"
import Gradient from "./Chart/Gradient"

import { useChartDimensions, useUniqueId } from "@utils/hooks"
import {
  KEY_GRADIENTS,
  KEY_MAPPINGS,
  TOTAL_MAPPINGS,
  TOTAL_KEY_MAPPINGS,
} from "@utils/constants"
import { fmt, getShortMonth } from "@utils/fn-utils"

const BarChart = ({ data, dataKey }) => {
  const gradientId = useUniqueId("Histogram-gradient")
  const [ref, dimensions] = useChartDimensions({
    marginTop: 1,
    marginLeft: 10,
    marginBottom: 10,
  })
  const [closest, setClosest] = useState(null)
  if (!dimensions.width || !dimensions.height) {
    return <div ref={ref} className="flex-1 h-48 lg:h-64 relative"></div>
  }
  const xScale = scaleBand()
    .domain(range(data.length))
    .range([dimensions.marginLeft, dimensions.width - dimensions.marginRight])
    .padding(0.1)
  const yScale = scaleLinear()
    .domain([0, max(data, d => d[dataKey])])
    .nice()
    .range([dimensions.height - dimensions.marginBottom, dimensions.marginTop])
  const ticks = xScale.domain()
  const formatTick = d => getShortMonth(data[d].date)
  const trackMove = (evt, datum, i) => {
    setClosest({ ...datum, index: i })
  }
  const pQuantile = Math.floor(
    quantile(
      data.map(d => d[dataKey]),
      0.7
    )
  )
  return (
    <div
      ref={ref}
      role="presentation"
      onMouseLeave={() => setClosest(null)}
      className="flex-1 h-48 lg:h-64 relative"
    >
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient
            id={gradientId}
            colors={KEY_GRADIENTS[dataKey]}
            x2="0"
            y2="100%"
            gradientTransform="rotate(0)"
          />
        </defs>
        <React.Fragment>
          {data.map((d, i) => {
            return (
              <rect
                className="Bars__rect"
                key={i}
                style={{ fill: `url(#${gradientId})` }}
                onMouseEnter={evt => trackMove(evt, d, i)}
                x={xScale(i)}
                y={yScale(d[dataKey])}
                width={xScale.bandwidth()}
                height={yScale(0) - yScale(d[dataKey])}
              />
            )
          })}
        </React.Fragment>
        <g
          className="Axis AxisHorizontal"
          transform={`translate(0, ${
            dimensions.boundedHeight + dimensions.marginTop
          })`}
        >
          <line
            className="Axis__line"
            x1={dimensions.marginLeft}
            x2={dimensions.boundedWidth + dimensions.marginLeft}
          />
          {ticks
            .filter(a => data[a].date.split("-")[2] === "01")
            .map((tick, i) => (
              <text
                key={tick}
                className="Axis__tick"
                transform={`translate(${xScale(tick)}, 13)`}
              >
                {formatTick(tick)}
              </text>
            ))}
        </g>
        <text
          x="10"
          y={yScale(pQuantile) - 10}
          className="text-xs font-serif font-bold"
        >
          {fmt(pQuantile)}
        </text>
        <line
          x1={dimensions.marginLeft}
          x2={dimensions.boundedWidth + dimensions.marginLeft}
          y1={yScale(pQuantile)}
          y2={yScale(pQuantile)}
          strokeDasharray="2px 4px"
          className="stroke-current text-secondary"
        ></line>
      </Chart>
      {closest && (
        <div
          className="absolute bg-white p-2 rounded-sm shadow-2xl whitespace-no-wrap border border-gray-300"
          style={{
            left: `${
              xScale(closest.index) -
              (closest.index > (data.length * 3) / 4 ? 120 : 0)
            }px`,
            top: `${yScale(closest[dataKey]) - 50}px`,
          }}
        >
          <p className="text-gray-900 text-xs md:text-sm font-serif font-bold">
            {getShortMonth(closest.date)}
          </p>
          <p className="text-gray-800 text-xs font-medium">{`${
            KEY_MAPPINGS[dataKey]
          }: ${fmt(closest[dataKey])}`}</p>
          <p className="text-gray-700 text-xs">{`${
            TOTAL_MAPPINGS[dataKey]
          }: ${fmt(closest[TOTAL_KEY_MAPPINGS[dataKey]])}`}</p>
        </div>
      )}
    </div>
  )
}

export default BarChart
