/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import Wrapper from "./wrapPageElement"

import "./src/styles/globals.css"
import "./src/styles/mapbox-styles.css"

require("typeface-arvo")
require("typeface-rosario")

export const wrapPageElement = Wrapper
