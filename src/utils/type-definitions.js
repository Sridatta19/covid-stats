import { PropTypes } from "prop-types"
import stateCodes from "@lib/stateCodes"
import DISTRICT_CODES from "@lib/districtNames"

const districtNames = [].concat.apply([], Object.values(DISTRICT_CODES))

export const NodeDataType = PropTypes.shape({
  date: PropTypes.string,
  dc: PropTypes.number,
  dd: PropTypes.number,
  dr: PropTypes.number,
  tc: PropTypes.number,
  td: PropTypes.number,
  tr: PropTypes.number,
}).isRequired

export const StatNodeType = PropTypes.shape({
  data: PropTypes.arrayOf(NodeDataType),
  id: PropTypes.string,
})

export const validateChildData = (
  props,
  propName,
  componentName,
  location,
  propFullName
) => {
  var obj = props[propName]
  if (!obj) {
    return null
  }

  var keys = Object.keys(obj)

  var key

  for (var i = 0; i < keys.length; i++) {
    key = keys[i]
    if (
      Object.keys(stateCodes).indexOf(key) === -1 &&
      districtNames.indexOf(key) === -1
    ) {
      return new Error(
        "Invalid key `" +
          propName +
          "` supplied to " +
          "`" +
          componentName +
          "`; expected to be one of state codes but this key - " +
          key +
          "-  isn't a valid state code."
      )
    }
  }

  // Check if all of its values are numbers
  var validObjectValues = PropTypes.objectOf(StatNodeType)
  var validObjectValuesError = validObjectValues(
    props,
    propFullName,
    componentName,
    location
  )
  if (validObjectValuesError) {
    return validObjectValuesError
  }

  return null
}
