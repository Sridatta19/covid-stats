import React from "react"
import { curveMonotoneX, line, area } from "d3-shape"

const Line = ({
  type,
  data,
  xAccessor,
  yAccessor,
  y0Accessor,
  interpolation,
  gradientColors,
  ...props
}) => {
  const d3Shape = type === "line" ? line : area
  const lineGenerator = d3Shape().x(xAccessor).y(yAccessor).curve(interpolation)

  if (type === "area") {
    lineGenerator.y0(y0Accessor).y1(yAccessor)
  }

  return (
    <path
      {...props}
      className={`Line Line--type-${type} ${
        !gradientColors && "stroke-current text-tertiary"
      }`}
      d={lineGenerator(data)}
    />
  )
}

Line.defaultProps = {
  type: "line",
  y0Accessor: 0,
  interpolation: curveMonotoneX,
}

export default Line
