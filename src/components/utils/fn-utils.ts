import { DATA_ENTRY, DATA_KEY } from "./type-definitions"

export const retrieveRecentDatesFormatted = (
  length: number = 14
): { [name: string]: boolean } => {
  const dates = Array.from({ length })
  return dates.reduce(
    (acc: { [name: string]: boolean }, _: any, index: number) => {
      // Covid19India last date is Oct 31st 2021
      const subtractedDate = new Date("October 30, 2021").setDate(new Date("October 30, 2021").getDate() - index)
      const date: string = formatDate(subtractedDate)
      acc[date] = true
      return acc
    },
    {}
  )
}

export const formatDate = (dt: number): string => {
  const date = new Date(dt)
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const day = date.getDate()
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`
}

export const filterPredicate = (d: string): boolean =>
  d !== "Unknown" && d !== "Foreign Evacuees" && d !== "Other State"

const prepareEntry = ({ delta, total }: any, date: string): DATA_ENTRY => ({
  date,
  dc: delta && delta.confirmed ? delta.confirmed : 0,
  dd: delta && delta.deceased ? delta.deceased : 0,
  dr: delta && delta.recovered ? delta.recovered : 0,
  tc: total && total.confirmed ? total.confirmed : 0,
  td: total && total.deceased ? total.deceased : 0,
  tr: total && total.recovered ? total.recovered : 0,
})

export const safeGet = (
  propertyArray: string[],
  object: { [key: string]: any }
): any => {
  return propertyArray.reduce(
    (accumulator, currentValue) =>
      accumulator && accumulator[currentValue]
        ? accumulator[currentValue]
        : null,
    object
  )
}

export const getShortMonth = (dateStr: string): string => {
  const date = new Date(dateStr)
  const month = date.toLocaleString("default", { month: "short" })
  const day = date.getDate()
  return `${month} ${day < 10 ? `0${day}` : day}`
}

export const getFormattedDate = (date: Date): string => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`
}

export const getDistrictId = (name: string): string =>
  name.split(" ").length > 1
    ? name
        .split(" ")
        .map(a => a.substr(0, 1))
        .join("")
        .substr(0, 2)
    : name.substr(0, 2)

export const getDistrictEntry = (
  filtered: any,
  response: any,
  stateId: string,
  district: string
): DATA_ENTRY | null => {
  const deltaConfirmed = safeGet(
    [stateId, "districts", district, "delta", "confirmed"],
    response
  )
  const formattedDate = getEntryDate(safeGet([stateId], response))
  if (deltaConfirmed && filtered[filtered.length - 1].date !== formattedDate) {
    return prepareEntry(
      safeGet([stateId, "districts", district], response),
      formattedDate
    )
  }
  return null
}

export const getStateEntry = (
  filtered: any,
  response: any,
  stateId: string
): DATA_ENTRY | null => {
  const deltaConfirmed: string | null = safeGet(
    [stateId, "delta", "confirmed"],
    response
  )
  const formattedDate = getEntryDate(safeGet([stateId], response))
  if (deltaConfirmed && filtered[filtered.length - 1].date !== formattedDate) {
    return prepareEntry(safeGet([stateId], response), formattedDate)
  }
  return null
}

export const getCountryEntry = (response: any): DATA_ENTRY | null => {
  const deltaConfirmed = safeGet(["TT", "delta", "confirmed"], response)
  if (deltaConfirmed) {
    const dateStr: string | null = safeGet(
      ["meta", "last_updated"],
      response.TT
    )
    const date = dateStr ? new Date(dateStr) : new Date("October 30, 2021")
    return prepareEntry(response.TT, getFormattedDate(date))
  }
  return null
}

export const getEntryDate = (entry: { [key: string]: any }) => {
  const dateStr: string | null =
    safeGet(["meta", "tested", "last_updated"], entry) ||
    safeGet(["meta", "last_updated"], entry)
  const date = dateStr ? new Date(dateStr) : new Date("October 30, 2021")
  return getFormattedDate(date)
}

export const transformKeys = <T extends { [key: string]: any }>(
  initialObject: T,
  callback: (keys: string) => string
) => {
  return Object.keys(initialObject).reduce(
    (acc: any, key: string) => ({
      ...acc,
      [callback(key)]: initialObject[key],
    }),
    {}
  )
}

export const calculateAverage = (
  data: DATA_ENTRY[],
  key: DATA_KEY,
  days = 21
) => {
  const lw = Math.floor(
    data
      .slice(data.length - 8)
      .slice(0, 7)
      .reduce((acc, elem: DATA_ENTRY) => acc + elem[key], 0) / 7
  )
  const pw = Math.floor(
    data
      .slice(data.length - days)
      .slice(0, 7)
      .reduce((acc, elem: DATA_ENTRY) => acc + elem[key], 0) / 7
  )
  return lw === 0 && pw === 0
    ? 0
    : pw === 0
    ? 100
    : Math.ceil(((lw - pw) / pw) * 100)
}

export const fmt = (num: number) => new Intl.NumberFormat("en-IN").format(num)
