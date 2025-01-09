import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import dayjs from 'dayjs'
import { ChartData } from '../types'
import { CustomTooltipProps } from './CustomTooltip'

interface WorkTimeChartProps {
  data: ChartData[]
  yAxisDomain: [number, number]
  formatYAxis: (value: number) => string
  CustomTooltip: React.FC<CustomTooltipProps>
  width: number
  height?: number
}

export const WorkTimeChart: React.FC<WorkTimeChartProps> = ({
  data,
  yAxisDomain,
  formatYAxis,
  CustomTooltip,
  width,
  height = 500
}) => {
  const calculateTicks = () => {
    const [min, max] = yAxisDomain
    // Calculate optimal number of ticks based on chart height
    const targetTickCount = 8
    const range = max - min

    // Calculate interval that divides range into roughly targetTickCount segments
    let interval = Math.ceil(range / targetTickCount)

    // Round interval to nearest 10 minutes for cleaner numbers
    interval = Math.ceil(interval / 10) * 10

    const ticks = []
    for (let i = min; i <= max; i += interval) {
      ticks.push(i)
    }

    return ticks
  }

  const formatXAxis = (dateStr: string) => {
    const date = dayjs(dateStr)
    const currentYear = dayjs().year()
    return date.year() === currentYear ? date.format('MM-DD') : date.format('YYYY-MM-DD')
  }

  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={formatXAxis} />
      <YAxis
        tickFormatter={formatYAxis}
        domain={yAxisDomain}
        ticks={calculateTicks()}
        reversed={true}
        width={50}
      />
      <Tooltip
        content={({ active, payload, label }) => (
          <CustomTooltip active={active} payload={payload} label={label} />
        )}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="startTimeValue"
        name="Start Time"
        stroke="#76ABAE"
        dot={{ r: 4 }}
        animationDuration={500}
      />
      <Line
        type="monotone"
        dataKey="endTimeValue"
        name="End Time"
        stroke="#31363F"
        dot={{ r: 4 }}
        animationDuration={500}
      />
    </LineChart>
  )
}
