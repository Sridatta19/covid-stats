export const retrieveRecentDatesFormatted = (length = 14) => {
  const dates = Array.from({ length })
  return dates.reduce((acc, _, index) => {
    const subtractedDate = new Date().setDate(new Date().getDate() - index)
    const date = formatDate(subtractedDate)
    acc[date] = true
    return acc
  }, {})
}

export const formatDate = dt => {
  const date = new Date(dt)
  const month = date.getMonth() + 1
  const year = date.getYear() + 1900
  const day = date.getDate()
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`
}

export const filterPredicate = d =>
  d !== "Unknown" && d !== "Foreign Evacuees" && d !== "Other State"

const prepareEntry = ({ delta, total }, date) => ({
  date,
  dc: delta && delta.confirmed ? delta.confirmed : 0,
  dd: delta && delta.deceased ? delta.deceased : 0,
  dr: delta && delta.recovered ? delta.recovered : 0,
  tc: total && total.confirmed ? total.confirmed : 0,
  td: total && total.deceased ? total.deceased : 0,
  tr: total && total.recovered ? total.recovered : 0,
})

export const safeGet = (propertyArray, object) => {
  return propertyArray.reduce(
    (accumulator, currentValue) =>
      accumulator && accumulator[currentValue]
        ? accumulator[currentValue]
        : null,
    object
  )
}

export const getShortMonth = dateStr => {
  const date = new Date(dateStr)
  const month = date.toLocaleString("default", { month: "short" })
  const day = date.getDate()
  return `${month} ${day < 10 ? `0${day}` : day}`
}

export const getFormattedDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`
}

export const getDistrictId = name =>
  name.split(" ").length > 1
    ? name
        .split(" ")
        .map(a => a.substr(0, 1))
        .join("")
        .substr(0, 2)
    : name.substr(0, 2)

export const getDistrictEntry = (filtered, response, stateId, district) => {
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

export const getStateEntry = (filtered, response, stateId) => {
  const deltaConfirmed = safeGet([stateId, "delta", "confirmed"], response)
  const formattedDate = getEntryDate(safeGet([stateId], response))
  if (deltaConfirmed && filtered[filtered.length - 1].date !== formattedDate) {
    return prepareEntry(safeGet([stateId], response), formattedDate)
  }
  return null
}

export const getCountryEntry = (filtered, response) => {
  const deltaConfirmed = safeGet(["TT", "delta", "confirmed"], response)
  if (deltaConfirmed) {
    const dateStr = safeGet(["meta", "last_updated"], response.TT)
    const date = dateStr ? new Date(dateStr) : new Date()
    return prepareEntry(response.TT, getFormattedDate(date))
  }
  return null
}

export const getEntryDate = entry => {
  const dateStr =
    safeGet(["meta", "tested", "last_updated"], entry) ||
    safeGet(["meta", "last_updated"], entry)
  const date = dateStr ? new Date(dateStr) : new Date()
  return getFormattedDate(date)
}

export const transformKeys = (initialObject, callback) => {
  return Object.keys(initialObject).reduce(
    (acc, key) => ({
      ...acc,
      [callback(key)]: initialObject[key],
    }),
    {}
  )
}

export const calculateAverage = (data, key, days = 21) => {
  const lw = Math.floor(
    data
      .slice(data.length - 8)
      .slice(0, 7)
      .reduce((acc, elem) => acc + elem[key], 0) / 7
  )
  const pw = Math.floor(
    data
      .slice(data.length - days)
      .slice(0, 7)
      .reduce((acc, elem) => acc + elem[key], 0) / 7
  )
  return lw === 0 && pw === 0
    ? 0
    : pw === 0
    ? 100
    : Math.ceil(((lw - pw) / pw) * 100)
}

export const fmt = num => new Intl.NumberFormat("en-IN").format(num)
