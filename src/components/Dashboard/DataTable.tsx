import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"

import { Downtrend, Uptrend, SortAcs, SortDesc } from "../Common/Icons"
import { KEY_MAPPINGS } from "../utils/constants"
import {
  fmt,
  formatDate,
  transformKeys,
  filterPredicate,
} from "../utils/fn-utils"
import DISTRICT_CODES from "../../../lib/districtNames"
import stateCodes from "../../../lib/stateCodes"
import { AnimateSharedLayout, motion } from "framer-motion"

const STATE_MAPPINGS = transformKeys(stateCodes, s => s.toLowerCase())

const DataTable = ({ stateId, childData, dataKey }) => {
  const [sortKey, changeSortKey] = useState("lw")
  const [isAscSort, changeSortOrder] = useState(false)
  useEffect(() => {
    changeSort("lw")
    changeSortOrder(false)
  }, [dataKey])
  const changeSort = newKey => {
    if (newKey === sortKey) {
      changeSortOrder(!isAscSort)
    } else {
      changeSortKey(newKey)
      changeSortOrder(false)
    }
  }
  const parsedData = Object.keys(childData)
    .filter(childKey => filterPredicate(childKey) && childKey !== "TT")
    .map(code => {
      const lw = childData[code].data
        .slice(childData[code].data.length - 7)
        .reduce((acc, elem) => acc + elem[dataKey], 0)
      const pw = childData[code].data
        .slice(childData[code].data.length - 14)
        .slice(0, 7)
        .reduce((acc, elem) => acc + elem[dataKey], 0)
      const lastEntry = childData[code].data[childData[code].data.length - 1]
      return {
        code,
        date: lastEntry.date,
        dc: lastEntry.dc,
        dd: lastEntry.dd,
        dr: lastEntry.dr,
        name: stateCodes[code] || code,
        [KEY_MAPPINGS[dataKey].totalKey]:
          childData[code].data[childData[code].data.length - 1][
            KEY_MAPPINGS[dataKey].totalKey
          ],
        lw,
        pw,
        average:
          lw === 0 && pw === 0
            ? 0
            : pw === 0
            ? 100
            : Math.ceil(((lw - pw) / pw) * 100),
      }
    })
    .filter(el => el[KEY_MAPPINGS[dataKey].totalKey] !== 0)
  parsedData.sort((a, b) =>
    isAscSort ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
  )
  const today = formatDate(new Date("October 30, 2021"))
  const noTodayData = parsedData.map(e => e.date).every(dt => dt !== today)
  return (
    <div className="flex flex-col lg:rounded-xl border dark-border overflow-hidden">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="h-120 lg:h-144 shadow-inner overflow-y-scroll scrolling-touch">
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead>
                <tr>
                  <th className="table-head">
                    <span className="invisible">Name</span>
                  </th>
                  <TableHead
                    sortKey={sortKey}
                    changeSort={() =>
                      changeSort(KEY_MAPPINGS[dataKey].totalKey)
                    }
                    isAscSort={isAscSort}
                    label="Totals"
                    columnKey={KEY_MAPPINGS[dataKey].totalKey}
                  />
                  <TableHead
                    sortKey={sortKey}
                    changeSort={changeSort}
                    isAscSort={isAscSort}
                    label={`${KEY_MAPPINGS[dataKey].label} in Last Week`}
                    columnKey="lw"
                  />
                  <TableHead
                    sortKey={sortKey}
                    changeSort={changeSort}
                    isAscSort={isAscSort}
                    label={`${KEY_MAPPINGS[dataKey].label} in Week Before That`}
                    columnKey="pw"
                  />
                  <TableHead
                    sortKey={sortKey}
                    changeSort={changeSort}
                    isAscSort={isAscSort}
                    label="Change"
                    columnKey="average"
                  />
                </tr>
              </thead>
              <TableBody
                dataKey={dataKey}
                data={parsedData}
                stateId={stateId}
                noTodayData={noTodayData}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const TableHead = ({ sortKey, isAscSort, columnKey, label, changeSort }) => (
  <th onClick={() => changeSort(columnKey)} className="table-head">
    {label}
    {sortKey === columnKey && <>{isAscSort ? <SortAcs /> : <SortDesc />}</>}
  </th>
)

const TableBody = ({ stateId, dataKey, data, noTodayData }) => {
  const rowClick = code => {
    if (stateCodes[code]) {
      navigate(`/state/${code.toLowerCase()}`)
    } else {
      navigate(
        `/state/${stateId}/district/${DISTRICT_CODES[
          STATE_MAPPINGS[stateId]
        ].indexOf(code)}`
      )
    }
  }
  return (
    <AnimateSharedLayout>
      <motion.tbody layout className="theme-bg divide-y divide-gray-200">
        {data.map(el => {
          return (
            <motion.tr layout key={el.code}>
              <td
                role="button"
                onClick={() => rowClick(el.code)}
                className="px-2 md:px-4 py-3 break-normal cursor-pointer whitespace-pre-wrap text-xs sm:text-sm leading-5 text-primary"
              >
                {el.code}
                {(el.date === formatDate(new Date("October 30, 2021")) ||
                  noTodayData) && (
                  <p
                    className={`font-serif font-medium text-xs sm:text-sm lg:text-base bg-clip-text text-transparent bg-gradient-to-r ${KEY_MAPPINGS[dataKey].countGradient}`}
                  >{`${el[dataKey] > 0 ? "+" : ""}${fmt(el[dataKey])}`}</p>
                )}
              </td>
              <td className="px-2 md:px-4 py-3 whitespace-nowrap text-xxs sm:text-sm leading-5 text-secondary">
                {fmt(el[KEY_MAPPINGS[dataKey].totalKey])}
              </td>
              <td className="px-2 md:px-4 py-3 whitespace-nowrap text-xxs sm:text-sm leading-5 text-secondary">
                {fmt(el.lw)}
              </td>
              <td className="px-2 md:px-4 py-3 whitespace-nowrap text-xxs sm:text-sm leading-5 text-secondary">
                {fmt(el.pw)}
              </td>
              <td className="px-2 md:px-4 py-3 whitespace-nowrap text-sm sm:text-lg font-rose tracking-wide font-medium leading-5 text-secondary">
                {el.average < 0 ? (
                  <>
                    <span className="text-green-500">{`${el.average}%`}</span>
                    <Downtrend />
                  </>
                ) : el.average > 0 ? (
                  <>
                    <span className="text-red-500">{`+${el.average}%`}</span>
                    <Uptrend />
                  </>
                ) : (
                  <span className="text-4xl lg:text-5xl text-center text-secondary">
                    ~
                  </span>
                )}
              </td>
            </motion.tr>
          )
        })}
      </motion.tbody>
    </AnimateSharedLayout>
  )
}

export default DataTable
