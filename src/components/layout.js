import React, { useEffect, useState } from "react"
import {
  MotionConfig,
  ExitFeature,
  AnimationFeature,
  AnimateLayoutFeature,
} from "framer-motion"

import ThemeSwitch from "./themeSwitch"

const Layout = ({ children, path }) => {
  const [isDark, setDark] = useState(false)
  const [apiResult, setApiResult] = useState(0)
  useEffect(() => {
    // get data from Covid India API
    fetch("https://api.covid19india.org/v4/data.json")
      .then(response => response.json()) // parse JSON from request
      .then(resultData => setApiResult(resultData)) // set data for the today's data
  }, [])
  const toggleTheme = () => {
    const root = document.getElementsByTagName("html")[0]
    if (isDark) {
      root.classList.remove("dark")
    } else {
      root.classList.add("dark")
    }
    setDark(!isDark)
  }
  return (
    <MotionConfig
      features={[ExitFeature, AnimationFeature, AnimateLayoutFeature]}
    >
      <ThemeSwitch toggleTheme={toggleTheme} isDark={isDark} />
      <div className="sm:mx-12 md:mx-20 lg:mx-6 mt-4 lg:mt-8 pb-10">
        {React.cloneElement(children, { apiResult })}
      </div>
    </MotionConfig>
  )
}

export default Layout
