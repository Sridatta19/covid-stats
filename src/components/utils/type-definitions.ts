export type DATA_KEY = "dc" | "dd" | "dr"

export type MODE = "chart" | "list" | "map" | null

export interface MAPPING_VALUE {
  label: string
  totalLabel: string
  totalKey: string
  palette: string[]
  gradient: string[]
  buttonGradient: string
  countGradient: string
  class: string
  stroke: string
  key: string
}

export interface DATA_ENTRY {
  date: string
  dc: number
  dd: number
  dr: number
  tc: number
  td: number
  tr: number
}
