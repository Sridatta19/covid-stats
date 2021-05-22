import STATE_MAPPINGS, { STATE_CODES } from "./stateCodes"
import { DETAILS, DATA_ENTRY, APIEntry } from "./type-definitions"

export const safeGet = (
  propertyArray: string[],
  object: { [key: string]: any }
) => {
  return propertyArray.reduce(
    (accumulator, currentValue) =>
      accumulator && accumulator[currentValue]
        ? accumulator[currentValue]
        : null,
    object
  )
}

export const getPastDates = (count: number = 100) => {
  let generatedDate
  const dates = []
  while (dates.length !== count + 1) {
    const subtractedDate = new Date().setDate(
      new Date().getDate() - dates.length + 1
    )
    const date = new Date(subtractedDate)
    generatedDate = formatDate(date)
    dates.push(generatedDate)
  }
  dates.reverse()
  return dates
}

export const formatDate = (date: Date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`
}

// Hack to allow vercel to add future dates data
export const isNotNearDate = (date: string) => {
  const today = new Date()
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))

  return !(
    date === formatDate(today) ||
    date === formatDate(yesterday) ||
    date === formatDate(tomorrow)
  )
}

export const groupBy = <T, K extends string = string>(
  grouper: (a: T) => K,
  list: T[]
): Record<K, T[]> => {
  return list.reduce<Record<string, T[]>>(
    (acc: Record<string, T[]>, elem: T) => {
      const key: K = grouper(elem)
      if (acc[key] !== undefined) {
        acc[key] = [elem].concat(acc[key])
      } else {
        acc[key] = [elem]
      }
      return acc
    },
    {}
  )
}

export const groupByMulti = <T, K extends string = string>(
  groupers: Array<(a: T) => K>,
  list: T[]
): Record<K, any> => {
  if (groupers.length === 0) {
    throw Error
  } else if (groupers.length == 1) {
    return groupBy(groupers[0], list)
  } else {
    const groupedList: Record<K, T[]> = groupBy(
      groupers.pop() as (a: T) => K,
      list
    )
    const keys = Object.keys(groupedList) as Array<keyof typeof groupedList>
    return keys.reduce<Record<string, any>>(
      (acc: Record<string, any>, key: K) => {
        return {
          ...acc,
          [key]: groupByMulti(groupers, groupedList[key]),
        }
      },
      {}
    )
  }
}

export const createEntry = <T extends APIEntry>(
  date: string,
  delta: T,
  previousData: T
): DATA_ENTRY => {
  return {
    date,
    dc:
      delta.Confirmed && previousData.Confirmed
        ? Math.abs(Number(delta.Confirmed) - Number(previousData.Confirmed))
        : 0,
    dd:
      delta.Deceased && previousData.Deceased
        ? Math.abs(Number(delta.Deceased) - Number(previousData.Deceased))
        : 0,
    dr:
      delta.Recovered && previousData.Recovered
        ? Math.abs(Number(delta.Recovered) - Number(previousData.Recovered))
        : 0,
    tc: delta.Confirmed ? Number(delta.Confirmed) : 0,
    td: delta.Deceased ? Number(delta.Deceased) : 0,
    tr: delta.Recovered ? Number(delta.Recovered) : 0,
  }
}

export const createDefaultEntry = (date: string): DATA_ENTRY => {
  return {
    date,
    dc: 0,
    dd: 0,
    dr: 0,
    tc: 0,
    td: 0,
    tr: 0,
  }
}

export const getStateCodes = (): STATE_CODES[] => {
  const CODES: string[] = []
  for (const value in STATE_MAPPINGS) {
    CODES.push(value)
  }
  // Hack to convert string keys to State Code Keys
  // Need to figure out if I can add type safety here
  return CODES as any as STATE_CODES[]
}

function isValidKey(value: string): value is keyof typeof STATE_MAPPINGS {
  return value in STATE_MAPPINGS
}

export const getReverseStateMappings = (): { [key: string]: string } => {
  const mappings: { [key: string]: string } = {}
  for (const value in STATE_MAPPINGS) {
    if (isValidKey(value)) {
      mappings[STATE_MAPPINGS[value]] = value
    }
  }
  // Hack to convert string keys to State Code Keys
  // Need to figure out if I can add type safety here
  return mappings
}

export const dateReducer =
  (data: DATA_ENTRY[], masterData: DETAILS, propertyArray: string[]) =>
  (date: string, index: number, dates: string[]) => {
    // Ignore first Entry
    if (index === 0) {
      return
    }
    // Check if State data exists for each date
    const stateData = safeGet(
      [[date, ...propertyArray].join("_"), "0"],
      masterData
    ) as APIEntry
    const previousData = safeGet(
      [[dates[index - 1], ...propertyArray].join("_"), "0"],
      masterData
    ) as APIEntry
    if (stateData && previousData) {
      const { Confirmed } = stateData
      if (
        isNotNearDate(date) ||
        (Confirmed &&
          Math.abs(Number(Confirmed) - Number(previousData.Confirmed)) !== 0)
      ) {
        data.push(createEntry(date, stateData, previousData))
      }
    } else if (isNotNearDate(date)) {
      data.push(createDefaultEntry(date))
    }
  }
