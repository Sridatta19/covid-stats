import React from "react"
import { motion, AnimateSharedLayout } from "framer-motion"
import { KEY_BUTTONS, KEY_MAPPINGS } from "../utils/constants"
import { DATA_KEY } from "../utils/type-definitions"

interface ToggleDataKeyProps {
  dataKey: keyof typeof KEY_MAPPINGS
  setKey: React.Dispatch<React.SetStateAction<DATA_KEY>>
}

const ToggleDataKey = ({ dataKey, setKey }: ToggleDataKeyProps) => {
  return (
    <AnimateSharedLayout>
      <div className="mt-10 lg:mt-7 mb-2 flex items-center justify-center">
        <span className="relative z-0 inline-flex shadow-sm rounded-md">
          {Object.keys(KEY_BUTTONS).map((buttonKey: string) => (
            <Button
              key={buttonKey}
              setKey={setKey}
              dataKey={dataKey}
              buttonKey={buttonKey as DATA_KEY}
            />
          ))}
        </span>
      </div>
    </AnimateSharedLayout>
  )
}

interface ButtonProps extends ToggleDataKeyProps {
  buttonKey: DATA_KEY
}

const Button = ({ dataKey, setKey, buttonKey }: ButtonProps) => {
  const IconButton = KEY_BUTTONS[buttonKey]
  return (
    <button
      onClick={() => setKey(buttonKey)}
      aria-label={KEY_MAPPINGS[buttonKey].label}
      className={`${KEY_MAPPINGS[buttonKey].class} relative flex justify-center items-center w-16 md:w-28 py-2.5 md:py-3 border border-gray-400 cursor-pointer bg-transparent text-sm leading-5 font-medium focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-red active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
    >
      {dataKey !== buttonKey && (
        <motion.span
          layoutId={KEY_MAPPINGS[buttonKey].label}
          transition={{ ease: [0.445, 0.05, 0.55, 0.95] }}
        >
          <IconButton />
        </motion.span>
      )}

      {dataKey === buttonKey && (
        <motion.div
          layoutId="circle"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{
            type: "tween",
            ease: "anticipate",
            duration: 0.4,
          }}
          className="absolute z-20"
        >
          <div
            className={`relative transform -translate-y-5 md:-translate-y-6 bg-gradient-to-r ${KEY_MAPPINGS[buttonKey].buttonGradient} rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-secondary`}
          >
            <motion.span
              layoutId={KEY_MAPPINGS[buttonKey].label}
              transition={{ ease: [0.445, 0.05, 0.55, 0.95] }}
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
