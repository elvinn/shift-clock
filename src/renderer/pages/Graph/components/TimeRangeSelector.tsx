import React from 'react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/renderer/components/ui/select'
import { Calendar } from '@/renderer/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/renderer/components/ui/popover'
import { Button } from '@/renderer/components/ui/button'

interface TimeRangeSelectorProps {
  timeRange: string
  dateRange: [Date, Date]
  isCalendarOpen: boolean
  onTimeRangeChange: (value: string) => void
  onDateRangeChange: (dates: Date[]) => void
  onCalendarOpenChange: (open: boolean) => void
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  dateRange,
  isCalendarOpen,
  onTimeRangeChange,
  onDateRangeChange,
  onCalendarOpenChange
}) => {
  return (
    <>
      <span className="text-lg font-medium flex items-center">Time Range:</span>
      <div className="flex items-center gap-4">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {timeRange === 'custom' && (
          <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {format(dateRange[0], 'PP')} - {format(dateRange[1], 'PP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange[0],
                  to: dateRange[1]
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRangeChange([range.from, range.to])
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </>
  )
}
