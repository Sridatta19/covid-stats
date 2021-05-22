import { STATE_CODES, STATE_NAMES } from "./stateCodes"

export interface APIEntry {
  Date: string
  Confirmed: string
  Recovered: string
  Deceased: string
  Tested: string
}

export interface StateAPIEntry extends APIEntry {
  State: STATE_NAMES
}

export interface DistrictAPIEntry extends APIEntry {
  State: STATE_NAMES
  District: string
}

export interface DATA_ENTRY {
  date: string
  dc: number
  dd: number
  dr: number
  dt: number
  tc: number
  td: number
  tr: number
  tt: number
}

export interface DETAILS {}

export interface STATE_DETAILS extends DETAILS {
  [date: string]: STATE_CODE_DETAILS
}

export type STATE_CODE_DETAILS = {
  [key in STATE_NAMES]: [StateAPIEntry]
}

export interface STATE_DATA {
  data: DATA_ENTRY[]
  id: STATE_CODES
}

export interface DISTRICT_DETAILS extends DETAILS {
  [date: string]: DISTRICT_NAME_DETAILS
}

export type DISTRICT_NAME_DETAILS = {
  [key in STATE_NAMES]: {
    [district: string]: [DistrictAPIEntry]
  }
}

export interface DISTRICT_DATA {
  data: DATA_ENTRY[]
  name: STATE_CODES
  district: number
}
