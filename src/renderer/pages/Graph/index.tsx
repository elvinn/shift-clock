import React from 'react'
import { useWorkRecords } from '@/renderer/hooks'
import { TimeRangeSelector } from './components/TimeRangeSelector'
import { DurationFilter } from './components/DurationFilter'
import { WorkTimeChart } from './components/WorkTimeChart'
import { CustomTooltip } from './components/CustomTooltip'
import { useChartData } from './hooks/useChartData'
import { useTimeRange } from './hooks/useTimeRange'

const Graph: React.FC = () => {
  const {
    timeRange,
    dateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    handleRangeChange,
    handleDateRangeChange
  } = useTimeRange()

  const [minDuration, setMinDuration] = React.useState<number | null>(null)
  const { data, loading, error } = useWorkRecords(dateRange[0].getTime(), dateRange[1].getTime())
  const { chartData, yAxisDomain } = useChartData({
    records: data.records || [],
    minDuration
  })

  const formatYAxis = (value: number) => {
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  if (error) {
    return <div className="text-red-500 text-center p-5">Error: {error.message}</div>
  }

  return (
    <div className="page p-8">
      <div className="w-[850px]">
        <div className="mb-8">
          <div className="grid grid-cols-[160px_1fr] gap-6">
            <TimeRangeSelector
              timeRange={timeRange}
              dateRange={dateRange}
              isCalendarOpen={isCalendarOpen}
              onTimeRangeChange={handleRangeChange}
              onDateRangeChange={handleDateRangeChange}
              onCalendarOpenChange={setIsCalendarOpen}
            />
            <DurationFilter minDuration={minDuration} onDurationChange={setMinDuration} />
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center items-center h-[500px] text-base text-gray-600">
              Loading...
            </div>
          ) : (
            <WorkTimeChart
              data={chartData}
              yAxisDomain={yAxisDomain}
              formatYAxis={formatYAxis}
              CustomTooltip={CustomTooltip}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Graph
