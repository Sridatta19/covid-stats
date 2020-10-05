import React from "react"
import { scaleTime, scaleLinear } from "d3-scale"
import { extent } from "d3-array"

import { useChartDimensions, useUniqueId } from "@utils/hooks"
import Chart from "./Chart/Chart"
import Line from "./Chart/Line"
import Gradient from "./Chart/Gradient"

const Linechart = ({
  data,
  xAccessor,
  yAccessor,
  yAccessorKey,
  stroke,
  label,
  gradientColors,
}) => {
  const [ref, dimensions] = useChartDimensions({
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  })
  const gradientId = useUniqueId("Timeline-gradient")
  const xScale = scaleTime()
    .domain(extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
  const yScale = scaleLinear()
    .domain(extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  return (
    <div className="flex-1 h-full" ref={ref}>
      <Chart dimensions={dimensions}>
        <defs>
          {gradientColors && (
            <Gradient
              id={gradientId}
              colors={gradientColors}
              x2="0"
              y2="100%"
              gradientTransform="rotate(0)"
            />
          )}
          <marker
            id={`arrow_${gradientId}`}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
            style={{ fill: stroke }}
            className={`fill-current text-tertiary`}
          >
            <path d="M0,0 L10,5 L0,10 z" />
          </marker>
        </defs>
        <Line
          data={data}
          type="line"
          fill="none"
          gradientColors={gradientColors}
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          markerEnd={`url(#arrow_${gradientId})`}
        />
      </Chart>
    </div>
  )
}

export default Linechart
