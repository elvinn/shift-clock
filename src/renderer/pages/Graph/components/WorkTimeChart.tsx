import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { ChartData } from '../types'
import { CustomTooltipProps } from './CustomTooltip'

interface WorkTimeChartProps {
  data: ChartData[]
  yAxisDomain: [number, number]
  formatYAxis: (value: number) => string
  CustomTooltip: React.FC<CustomTooltipProps>
}

export const WorkTimeChart: React.FC<WorkTimeChartProps> = ({
  data,
  yAxisDomain,
  formatYAxis,
  CustomTooltip
}) => {
  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis
        tickFormatter={formatYAxis}
        domain={yAxisDomain}
        interval="preserveStartEnd"
        tickCount={8}
        reversed={true}
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
