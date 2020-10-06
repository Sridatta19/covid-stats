import React, { useEffect, useState } from "react"
import { PropTypes } from "prop-types"

import SEO from "@components/seo"
import BarChart from "@components/barChart"
import ToggleDataKey from "@components/toggleDataKey"
import ChildDashboard from "@components/childDashboard"
import FadeContainer from "@components/fadeContainer"
import ToggleDisplayMode from "@components/toggleDisplayMode"
import Mapbox from "@components/mapbox"
import DataTable from "@components/dataTable"
import StatsSection from "@components/dashboard/statsSection"
import FoldWrapper from "@components/foldWrapper"

import { retrieveRecentDatesFormatted } from "@utils/fn-utils"
import { LG_SCREEN, MD_SCREEN, CHART_DAYS } from "@utils/constants"
import { StatNodeType, validateChildData } from "@utils/type-definitions"
import { useChartDimensions } from "@utils/hooks"

const Dashboard = ({ title, stateId, data, childData }) => {
  const [dataKey, setKey] = useState("dc")
  const [displayMode, setMode] = useState("chart")
  const [ref, { width }] = useChartDimensions()
  useEffect(() => {
    if (width > LG_SCREEN) {
      setMode(null)
    } else if (!displayMode) {
      setMode("chart")
    }
  }, [width])

  const barChartDates = retrieveRecentDatesFormatted(CHART_DAYS)
  const filtered = data.filter(entry => barChartDates[entry.date])
  return (
    <div ref={ref}>
      <SEO title={title} />
      {childData && displayMode && (
        <ToggleDisplayMode setMode={setMode} displayMode={displayMode} />
      )}
      <Header title={title} />
      <div
        className="lg:grid lg:grid-cols-3 gap-x-3 mt-4"
        style={{ perspective: 1200 }}
      >
        <MainSection
          width={width}
          setKey={setKey}
          data={filtered}
          stateId={stateId}
          dataKey={dataKey}
          childData={childData}
          displayMode={displayMode}
        />
      </div>
      <ToggleDataKey dataKey={dataKey} setKey={setKey} />
    </div>
  )
}

const MainSection = ({
  width,
  stateId,
  childData,
  displayMode,
  dataKey,
  data,
  setKey,
}) => {
  const Container = width > LG_SCREEN ? FoldWrapper : React.Fragment
  return (
    <Container>
      {(!displayMode || displayMode === "list") && childData && (
        <DataTable stateId={stateId} dataKey={dataKey} childData={childData} />
      )}
      {(!displayMode || displayMode === "chart") && (
        <div
          className={`space-y-8 lg:space-y-10 ${
            !childData && "lg:col-start-2"
          }`}
        >
          <FadeContainer>
            <BarChart data={data} dataKey={dataKey} />
            <StatsSection dataKey={dataKey} data={data} />
            {/* <ToggleDataKey dataKey={dataKey} setKey={setKey} /> */}
            {childData && (
              <ChildDashboard
                stateId={stateId}
                childData={childData}
                dataKey={dataKey}
              />
            )}
          </FadeContainer>
        </div>
      )}
      {(!displayMode || displayMode === "map") && childData && (
        <div className="min-w-full h-120 lg:h-144 flex flex-col">
          <Mapbox
            data={data}
            dataKey={dataKey}
            stateId={stateId}
            childData={childData}
            isMedium={width > MD_SCREEN}
          />
        </div>
      )}
    </Container>
  )
}

Dashboard.propTypes = {
  data: PropTypes.arrayOf(StatNodeType),
  title: PropTypes.string.isRequired,
  stateId: PropTypes.string.isRequired,
  childData: validateChildData,
}

const Header = ({ title }) => (
  <div className="mx-12 text-center">
    <h1 className="text-2xl sm:text-4xl font-arvo font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 dark:from-yellow-300 via-green-500 dark:via-pink-500 to-yellow-500 dark:to-indigo-500 uppercase">
      {title}
    </h1>
  </div>
)

Header.propTypes = {
  title: PropTypes.string.isRequired,
}

export default Dashboard
