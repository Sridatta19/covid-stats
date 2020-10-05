import React from "react"
import { m as motion, AnimateSharedLayout } from "framer-motion"
import { MoonIcon, SunIcon } from "@components/icons"

const ThemeSwitch = ({ toggleTheme, isDark }) => (
  <div
    className={`absolute top-0 right-0 m-2 md:m-4 justify-between box-border w-12 sm:w-16 h-6 sm:h-8 rounded-xl p-2 flex items-center cursor-pointer ${
      isDark ? `bg-gray-100` : `bg-gray-700`
    }`}
    onClick={toggleTheme}
  >
    {isDark && <SunIcon />}
    <AnimateSharedLayout>
      <motion.div
        layoutId
        style={{ background: `${isDark ? "#333" : "#FFF"}` }}
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full box-border`}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      />
    </AnimateSharedLayout>
    {!isDark && <MoonIcon />}
  </div>
)

export default ThemeSwitch
