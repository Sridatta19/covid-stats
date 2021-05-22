import React, { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FoldWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AnimatePresence>
      {React.Children.map(children, (element, index) => (
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -75, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.445, 0.05, 0.55, 0.95],
            delay: 0.3 + index * 0.4,
          }}
        >
          {element}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default FoldWrapper
