import React from 'react'

export interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 border border-gray-300 p-2.5 rounded">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="m-0 leading-normal">
            {entry.name}:{' '}
            {entry.payload[entry.name === 'Start Time' ? 'startTimeLabel' : 'endTimeLabel']}
          </p>
        ))}
      </div>
    )
  }
  return null
}
