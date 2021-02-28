const safeGet = (propertyArray, object) => {
  return propertyArray.reduce(
    (accumulator, currentValue) =>
      accumulator && accumulator[currentValue]
        ? accumulator[currentValue]
        : null,
    object
  )
}

exports.safeGet = safeGet

const getDates = () => {
  let generatedDate
  const dates = []
  while (dates.length !== 101) {
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

exports.getDates = getDates

const formatDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getYear() + 1900
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`
}

// Hack to allow vercel to add future dates data
const isNotNearDate = date => {
  const today = new Date()
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))

  return !(
    date === formatDate(today) ||
    date === formatDate(yesterday) ||
    date === formatDate(tomorrow)
  )
}

exports.isNotNearDate = isNotNearDate

const createEntry = (date, delta, previousData) => {
  return {
    date,
    dc:
      delta.Confirmed && previousData.Confirmed
        ? Math.abs(delta.Confirmed - previousData.Confirmed)
        : 0,
    dd:
      delta.Deceased && previousData.Deceased
        ? Math.abs(delta.Deceased - previousData.Deceased)
        : 0,
    dr:
      delta.Recovered && previousData.Recovered
        ? Math.abs(delta.Recovered - previousData.Recovered)
        : 0,
    tc: delta.Confirmed ? Number(delta.Confirmed) : 0,
    td: delta.Deceased ? Number(delta.Deceased) : 0,
    tr: delta.Recovered ? Number(delta.Recovered) : 0,
  }
}

exports.createEntry = createEntry

const createDefaultEntry = (date, delta, total) => {
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

exports.createDefaultEntry = createDefaultEntry
