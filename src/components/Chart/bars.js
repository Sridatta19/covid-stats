import React from "react"
import PropTypes from "prop-types"
import { max } from "d3-array"

const callAccessor = (accessor, d, i) =>
  typeof accessor === "function" ? accessor(d, i) : accessor

const Bars = ({
  data,
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  ...props
}) => (
  <React.Fragment>
    {data.map((d, i) => (
      <rect
        {...props}
        className="Bars__rect"
        key={keyAccessor(d, i)}
        x={callAccessor(xAccessor, d, i)}
        y={callAccessor(yAccessor, d, i)}
        width={max([callAccessor(widthAccessor, d, i), 0])}
        height={max([callAccessor(heightAccessor, d, i), 0])}
      />
    ))}
  </React.Fragment>
)

export default Bars
