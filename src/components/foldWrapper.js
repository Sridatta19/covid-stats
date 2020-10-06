import React from "react"
import { m as motion, AnimatePresence } from "framer-motion"

const FoldWrapper = ({ children }) => {
  return (
    <AnimatePresence>
      {React.Children.map(children, (element, index) => (
        <motion.div
          animate={{ rotateY: 0, opacity: 1 }}
          style={{ originX: 0, originY: 0.5 }}
          initial={{ opacity: 0 }}
          transition={{
            from: 90,
            duration: 1,
            type: "tween",
            ease: "anticipate",
            delay: 0.2 + index * 0.2,
          }}
        >
          {element}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default FoldWrapper
