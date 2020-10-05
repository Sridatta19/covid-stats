import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"

import { Downtrend, Uptrend, SortAcs, SortDesc } from "@components/icons"
import { TOTAL_KEY_MAPPINGS, LABEL_MAPPINGS } from "@utils/constants"
import { transformKeys, filterPredicate } from "@utils/fn-utils"
import DISTRICT_CODES from "@lib/districtNames"
import stateCodes from "@lib/stateCodes"

const STATE_CODES = transformKeys(stateCodes, s => s.toLowerCase())

const DataTable = ({ stateId, childData, dataKey }) => {
  const [sortKey, changeSortKey] = useState("lw")
  const [isAscSort, changeSortOrder] = useState(false)
  useEffect(() => {
    changeSort("lw")
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
      return {
        code,
        name: stateCodes[code] || code,
        [TOTAL_KEY_MAPPINGS[dataKey]]:
          childData[code].data[childData[code].data.length - 1][
            TOTAL_KEY_MAPPINGS[dataKey]
          ],
        lw,
        pw,
        average: Math.ceil(((lw - pw) / pw) * 100),
      }
    })
    .filter(el => el[TOTAL_KEY_MAPPINGS[dataKey]] !== 0)
  parsedData.sort((a, b) =>
    isAscSort ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
  )
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
                    label="Totals"
                    isAscSort={isAscSort}
                    columnKey={TOTAL_KEY_MAPPINGS[dataKey]}
                    changeSort={() => changeSort(TOTAL_KEY_MAPPINGS[dataKey])}
                  />
                  <TableHead
                    sortKey={sortKey}
                    changeSort={changeSort}
                    isAscSort={isAscSort}
                    label={`${LABEL_MAPPINGS[dataKey]} in Last Week`}
                    columnKey="lw"
                  />
                  <TableHead
                    sortKey={sortKey}
                    changeSort={changeSort}
                    isAscSort={isAscSort}
                    label={`${LABEL_MAPPINGS[dataKey]} in Week Before That`}
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

const TableBody = ({ stateId, dataKey, data }) => {
  const rowClick = code => {
    if (stateCodes[code]) {
      navigate(`/state/${code.toLowerCase()}`)
    } else {
      navigate(
        `/state/${stateId}/district/${DISTRICT_CODES[
          STATE_CODES[stateId]
        ].indexOf(code)}`
      )
    }
  }
  return (
    <tbody className="theme-bg divide-y divide-gray-200">
      {data.map((el, index) => {
        return (
          <tr key={index}>
            <td
              role="button"
              onClick={() => rowClick(el.code)}
              className="px-2 md:px-4 py-3 break-normal cursor-pointer whitespace-pre-wrap text-xxs sm:text-sm leading-5 font-medium text-primary"
            >
              {el.code}
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-no-wrap text-xxs sm:text-sm leading-5 text-secondary">
              {new Intl.NumberFormat("en-IN").format(
                el[TOTAL_KEY_MAPPINGS[dataKey]]
              )}
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-no-wrap text-xxs sm:text-sm leading-5 text-secondary">
              {new Intl.NumberFormat("en-IN").format(el.lw)}
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-no-wrap text-xxs sm:text-sm leading-5 text-secondary">
              {new Intl.NumberFormat("en-IN").format(el.pw)}
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-no-wrap text-sm sm:text-lg leading-5 text-secondary">
              <span
                className={`${
                  el.average < 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {`${el.average > 0 ? "+" : ""}${el.average}%`}
              </span>
              {el.lw < el.pw ? <Downtrend /> : <Uptrend />}
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

export default DataTable
