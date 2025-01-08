import { useState } from 'react'
import dayjs from 'dayjs'

export const useTimeRange = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    dayjs().subtract(7, 'day').toDate(),
    dayjs().toDate()
  ])
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleRangeChange = (value: string) => {
    setTimeRange(value)
    if (value === '7d') {
      setDateRange([dayjs().subtract(7, 'day').toDate(), dayjs().toDate()])
    } else if (value === '30d') {
      setDateRange([dayjs().subtract(30, 'day').toDate(), dayjs().toDate()])
    }
  }

  const handleDateRangeChange = (dates: Date[]) => {
    if (dates.length === 2) {
      setTimeRange('custom')
      setDateRange([dates[0], dates[1]])
    }
  }

  return {
    timeRange,
    dateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    handleRangeChange,
    handleDateRangeChange
  }
}