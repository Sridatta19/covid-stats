import React, { useEffect, useState } from "react"

import SEO from "../Common/SEO"
import { BarChart } from "../Charts"
import { ToggleDisplayMode, ToggleDataKey } from "../Common"
import { StatsSection, ChildDashboard, DataTable } from "./index"
import { FadeContainer, FoldWrapper } from "../Animation"
import { Map } from "../Map"

import { retrieveRecentDatesFormatted } from "../utils/fn-utils"
import { LG_SCREEN, MD_SCREEN, CHART_DAYS } from "../utils/constants"
import { useChartDimensions } from "../utils/hooks"
import { DATA_ENTRY, DATA_KEY, MODE } from "../utils/type-definitions"

interface DashboardProps {
  title: string
  stateId: string
  data: DATA_ENTRY[]
  childData: any
}

const Dashboard = ({ title, stateId, data, childData }: DashboardProps) => {
  const [dataKey, setKey] = useState<DATA_KEY>("dc")
  const [displayMode, setMode] = useState<MODE>("chart")
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
      <Header title={title} isNotDistrict={!!childData} />
      <div
        className="lg:grid lg:grid-cols-3 gap-x-3 mt-4"
        style={{ perspective: 1200 }}
      >
        <MainSection
          width={width}
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

interface MainSectionProps {
  width: number
  stateId: string
  childData: any
  displayMode: MODE
  dataKey: DATA_KEY
  data: DATA_ENTRY[]
}

const MainSection = ({
  width,
  stateId,
  childData,
  displayMode,
  dataKey,
  data,
}: MainSectionProps) => {
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
          <Map
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

const Header = ({ title, isNotDistrict }: HeaderProps) => (
  <div className={`${isNotDistrict ? "mx-4" : "mx-14"} text-center`}>
    <h1 className="tracking-wider inline-block text-2xl sm:text-4xl font-arvo font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 dark:from-yellow-200 via-green-500 dark:via-green-400 to-yellow-500 dark:to-red-500 uppercase">
      {title}
    </h1>
  </div>
)

interface HeaderProps {
  title: string
  isNotDistrict: boolean
}

export default Dashboard
