import React from "react"
import { m as motion, AnimateSharedLayout } from "framer-motion"
import {
  KEY_BUTTONS,
  LABEL_MAPPINGS,
  KEY_BUTTON_CLASSES,
  KEY_BUTTON_GRADIENTS,
} from "@utils/constants"

const ToggleDataKey = ({ dataKey, setKey }) => {
  return (
    <AnimateSharedLayout>
      <div className="mt-10 lg:mt-7 mb-2 flex items-center justify-center">
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
          {Object.keys(LABEL_MAPPINGS).map((buttonKey, i) => (
            <Button
              key={i}
              index={i}
              setKey={setKey}
              dataKey={dataKey}
              buttonKey={buttonKey}
            />
          ))}
        </span>
      </div>
    </AnimateSharedLayout>
  )
}

const Button = ({ index, dataKey, setKey, buttonKey }) => {
  const IconButton = KEY_BUTTONS[buttonKey]
  return (
    <button
      onClick={() => setKey(buttonKey)}
      aria-label={LABEL_MAPPINGS[buttonKey]}
      className={`${KEY_BUTTON_CLASSES[buttonKey]} relative flex justify-center items-center w-24 md:w-36 py-2.5 md:py-3 border border-gray-400 cursor-pointer bg-transparent text-sm leading-5 font-medium focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-red active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
    >
      {dataKey !== buttonKey && (
        <motion.span
          transition={{ ease: [0.445, 0.05, 0.55, 0.95] }}
          layoutId={LABEL_MAPPINGS[buttonKey]}
        >
          <IconButton />
        </motion.span>
      )}

      {dataKey === buttonKey && (
        <motion.div
          layoutId="circle"
          initial={false}
          transition={{
            type: "tween",
            ease: "anticipate",
            duration: 0.4,
          }}
          className="absolute z-20"
        >
          <div
            className={`relative transform -translate-y-5 md:-translate-y-6 bg-gradient-to-r ${KEY_BUTTON_GRADIENTS[buttonKey]} rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-secondary`}
          >
            <motion.span
              transition={{ ease: [0.445, 0.05, 0.55, 0.95] }}
              layoutId={LABEL_MAPPINGS[buttonKey]}
            >
              <IconButton />
            </motion.span>
          </div>
        </motion.div>
      )}
    </button>
  )
}

export default ToggleDataKey
