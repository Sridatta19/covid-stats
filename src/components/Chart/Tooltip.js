import React from "react"

const Tooltip = ({ cx, cy }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r="6"
      stroke="#FFF"
      fill="#ff3600"
      strokeWidth="4"
    ></circle>
  )
}

export default Tooltip
