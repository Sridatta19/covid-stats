import React, { ReactNode } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

const PANEL_VARIANTS: Variants = {
  enter: {
    x: -100,
    opacity: 0,
  },
  center: i => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.12,
      type: "tween",
      ease: "anticipate",
      delay: (i + 1) * 0.1,
    },
  }),
  exit: {
    x: -100,
    opacity: 0,
    transition: { duration: 0.12, delay: 0.15 },
  },
}

const FadeContainer = ({ children }: { children: ReactNode }) => {
  return (
    <AnimatePresence>
      {React.Children.map(children, (element, index) => (
        <motion.div
          key={index}
          custom={index + 1}
          variants={PANEL_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {element}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default FadeContainer
