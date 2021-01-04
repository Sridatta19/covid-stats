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
  while (dates.length !== 100) {
    const subtractedDate = new Date().setDate(
      new Date().getDate() - dates.length + 1
    )
    const date = new Date(subtractedDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getYear() + 1900
    generatedDate = `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`
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

const calculateGrowth = (stateCode, data, key) => {
  return Math.ceil(
    ((Number(data[data.length - 1][key]) -
      Number(data[data.length - 14][key])) /
      Number(data[data.length - 1][key])) *
      100
  )
}

exports.calculateGrowth = calculateGrowth

const createEntry = (date, delta, total) => {
  return {
    date,
    dc: delta && delta.confirmed ? delta.confirmed : 0,
    dd: delta && delta.deceased ? delta.deceased : 0,
    dr: delta && delta.recovered ? delta.recovered : 0,
    tc: total && total.confirmed ? total.confirmed : 0,
    td: total && total.deceased ? total.deceased : 0,
    tr: total && total.recovered ? total.recovered : 0,
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
