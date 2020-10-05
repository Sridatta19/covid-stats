import React from "react"
import PropTypes from "prop-types"
import { format } from "d3-axis"
import { useChartDimensions } from "./Chart"

const axisComponentsByDimension = {
  x: AxisHorizontal,
  y: AxisVertical,
}
const Axis = ({ dimension, ...props }) => {
  const dimensions = useChartDimensions()
  const Component = axisComponentsByDimension[dimension]
  if (!Component) return null

  return <Component dimensions={dimensions} {...props} />
}

export default Axis

function AxisHorizontal({ dimensions, label, formatTick, scale, ...props }) {
  const numberOfTicks = 4
  let ticks = scale.ticks(numberOfTicks)
  return (
    <g
      className="Axis AxisHorizontal"
      transform={`translate(0, ${dimensions.boundedHeight - 30})`}
      {...props}
    >
      {/* <line className="Axis__line" x2={dimensions.boundedWidth} /> */}

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          transform={`translate(${scale(tick)}, 25)`}
        >
          {formatTick(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
        >
          {label}
        </text>
      )}
    </g>
  )
}

function AxisVertical({ dimensions, label, formatTick, scale, ...props }) {
  const numberOfTicks = dimensions.boundedHeight / 70

  const ticks = scale.ticks(numberOfTicks)

  return (
    <g className="Axis AxisVertical" {...props}>
      <line className="Axis__line" y2={dimensions.boundedHeight} />

      {ticks.map((tick, i) => (
        <text
          key={tick}
          className="Axis__tick"
          transform={`translate(-16, ${scale(tick)})`}
        >
          {formatTick(tick)}
        </text>
      ))}

      {label && (
        <text
          className="Axis__label"
          style={{
            transform: `translate(-56px, ${
              dimensions.boundedHeight / 2
            }px) rotate(-90deg)`,
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

Axis.defaultProps = {
  dimension: "x",
  scale: null,
  formatTick: format(","),
}
