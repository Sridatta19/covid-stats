import { timeParse } from "d3-time-format"
import { ConfirmedIcon, DeceasedIcon, RecoveredIcon } from "@components/icons"

const parseDate = timeParse("%Y-%m-%d")
export const dateAccessor = d => parseDate(d.date)

export const CHART_DAYS = 100

export const TREND_DAYS = 14
export const LINE_DAYS = 30

export const LG_SCREEN = 1200
export const MD_SCREEN = 768

export const KEY_MAPPINGS = {
  dc: "New Cases",
  dd: "New Deaths",
  dr: "New Recovered",
}

export const SORT_KEY_MAPPINGS = {
  dc: "gc",
  dd: "gd",
  dr: "gr",
}

export const KEY_BUTTONS = {
  dc: ConfirmedIcon,
  dd: DeceasedIcon,
  dr: RecoveredIcon,
}

export const KEY_BUTTON_CLASSES = {
  dc: "rounded-bl-full",
  dd: "-ml-px",
  dr: "-ml-px rounded-br-full",
}

export const LABEL_MAPPINGS = {
  dc: "cases",
  dd: "deaths",
  dr: "recovered",
}

export const TOTAL_MAPPINGS = {
  dc: "Total Cases",
  dd: "Total Deaths",
  dr: "Total Recovered",
}

export const TOTAL_KEY_MAPPINGS = {
  dc: "tc",
  dd: "td",
  dr: "tr",
}

export const KEY_PALETTES = {
  dc: ["#00C6FF", "#3BC6BD", "#D4A35C", "#415A77", "#0072FF"],
  dd: ["#f5af19", "#E5D728", "#87814A", "#754725", "#f12711"],
  dr: ["#DCE35B", "#EACD2D", "#AE8950", "#4E8E81", "#45B649"],
}

export const KEY_GRADIENTS = {
  dc: ["#4884EE", "#06BCFB"],
  dd: ["#f12711", "#f5af19"],
  dr: ["#F4D03F", "#16A085"],
}

export const STROKES = {
  dc: "#0072ff",
  dd: "#f12711",
  dr: "#45B649",
}

export const KEY_BUTTON_GRADIENTS = {
  dc: "from-blue-400 to-blue-500",
  dd: "from-red-500 to-red-300",
  dr: "from-green-500 to-yellow-400",
}

export const COUNT_GRADIENTS = {
  dc: "from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400",
  dd: "from-red-500 to-red-500 dark:from-red-400 dark:to-red-300",
  dr: "from-green-500 dark:from-green-400 to-yellow-500 dark:to-yellow-400",
}
