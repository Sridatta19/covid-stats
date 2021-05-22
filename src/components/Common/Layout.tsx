import React, { ReactElement, useEffect, useState } from "react"
import { LazyMotion, domAnimation } from "framer-motion"
import ThemeSwitch from "./ThemeSwitch"

interface LayoutProps {
  children: ReactElement
  path: string
}

const Layout = ({ children, path }: LayoutProps) => {
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
    <LazyMotion features={domAnimation}>
      <ThemeSwitch toggleTheme={toggleTheme} isDark={isDark} />
      <div className="sm:mx-12 md:mx-20 lg:mx-6 mt-4 lg:mt-8">
        {React.cloneElement(children, { apiResult })}
      </div>
      {path === "/" && (
        <p className="my-4 text-xs sm:text-sm lg:text-base text-center text-primary">
          Made with{" "}
          <span role="img" aria-label="Love">
            ❤️
          </span>{" "}
          by
          <a
            rel="noopener"
            target="_blank"
            className="ml-1 text-blue-600 dark:text-blue-400 underline"
            href="https://github.com/Sridatta19/covid-stats"
          >
            Sridatta
          </a>
        </p>
      )}
    </LazyMotion>
  )
}

export default Layout
