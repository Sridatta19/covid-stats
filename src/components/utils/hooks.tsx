import ResizeObserver from "resize-observer-polyfill"
import { useEffect, useState, useRef } from "react"

interface Dimensions {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  boundedHeight: number
  boundedWidth: number
  height: number
  width: number
}

export const combineChartDimensions = (dimensions: Partial<Dimensions>) => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  }

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      (parsedDimensions.height || 0) -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      (parsedDimensions.width || 0) -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  }
}

export const useChartDimensions = (passedSettings?: any) => {
  const ref = useRef<Element>()
  const dimensions = combineChartDimensions(passedSettings)

  const [width, changeWidth] = useState(0)
  const [height, changeHeight] = useState(0)

  useEffect((): any => {
    if (dimensions.width && dimensions.height) return [ref, dimensions]

    const element = ref.current as Element
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        if (!Array.isArray(entries)) return
        if (!entries.length) return

        const entry = entries[0]

        if (width !== entry.contentRect.width)
          changeWidth(entry.contentRect.width)
        if (height !== entry.contentRect.height)
          changeHeight(entry.contentRect.height)
      }
    )

    resizeObserver.observe(element)

    return () => resizeObserver.unobserve(element)
  }, [passedSettings, height, width, dimensions])

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })

  return [ref, newSettings]
}

let lastId = 0
export const useUniqueId = (prefix = "") => {
  lastId++
  return [prefix, lastId].join("-")
}
