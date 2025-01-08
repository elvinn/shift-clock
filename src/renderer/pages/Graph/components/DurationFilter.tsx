import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/renderer/components/ui/select'

interface DurationFilterProps {
  minDuration: number | null
  onDurationChange: (value: number | null) => void
}

const getDurationOptions = () => {
  const options = []
  for (let i = 0.5; i <= 24; i += 0.5) {
    options.push({
      label: `${i} hours`,
      value: i
    })
  }
  return options
}

export const DurationFilter: React.FC<DurationFilterProps> = ({
  minDuration,
  onDurationChange
}) => {
  return (
    <>
      <span className="text-lg font-medium flex items-center">Filter by Duration:</span>
      <div className="flex items-center gap-4">
        <Select
          value={minDuration?.toString()}
          onValueChange={(value) => onDurationChange(value ? parseFloat(value) : null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Min duration (hours)" />
          </SelectTrigger>
          <SelectContent>
            {getDurationOptions().map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
