import { timeParse } from "d3-time-format"
import { ConfirmedIcon, DeceasedIcon, RecoveredIcon } from "../Common/Icons"
import { DATA_KEY, MAPPING_VALUE } from "./type-definitions"

const parseDate = timeParse("%Y-%m-%d")
export const dateAccessor = (d: { date: string }): Date | null =>
  parseDate(d.date)

export const CHART_DAYS = 100

export const TREND_DAYS = 14
export const LINE_DAYS = 30

export const LG_SCREEN = 1200
export const MD_SCREEN = 768

export const KEY_MAPPINGS: Record<DATA_KEY, MAPPING_VALUE> = {
  dc: {
    label: "cases",
    totalLabel: "Total Cases",
    totalKey: "tc",
    palette: ["#00C6FF", "#3BC6BD", "#D4A35C", "#415A77", "#0072FF"],
    gradient: ["#4884EE", "#06BCFB"],
    buttonGradient: "from-blue-400 to-blue-500",
    countGradient:
      "from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400",
    class: "rounded-bl-full",
    stroke: "#0072ff",
    key: "New Cases",
  },
  dd: {
    label: "deaths",
    totalLabel: "Total Deaths",
    totalKey: "td",
    palette: ["#f5af19", "#E5D728", "#87814A", "#754725", "#f12711"],
    gradient: ["#f12711", "#f5af19"],
    buttonGradient: "from-red-500 to-red-300",
    countGradient: "from-red-500 to-red-500 dark:from-red-400 dark:to-red-300",
    class: "-ml-px",
    stroke: "#f12711",
    key: "New Deaths",
  },
  dr: {
    label: "recovered",
    totalLabel: "Total Recovered",
    totalKey: "tr",
    palette: ["#DCE35B", "#EACD2D", "#AE8950", "#4E8E81", "#45B649"],
    gradient: ["#F4D03F", "#16A085"],
    buttonGradient: "from-green-500 to-yellow-400",
    countGradient:
      "from-green-500 dark:from-green-400 to-yellow-500 dark:to-yellow-400",
    class: "-ml-px rounded-br-full",
    stroke: "#45B649",
    key: "New Recovered",
  },
}

export const KEY_BUTTONS: { [key: string]: () => JSX.Element } = {
  dc: ConfirmedIcon,
  dd: DeceasedIcon,
  dr: RecoveredIcon,
}
