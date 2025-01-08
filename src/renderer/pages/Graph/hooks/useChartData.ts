import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { ChartData } from '../types'

interface UseChartDataProps {
  records: any[]
  minDuration: number | null
}

export const useChartData = ({ records, minDuration }: UseChartDataProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 24 * 60])

  useEffect(() => {
    if (!records) return

    // Process records into chart data
    const processedData = records.map((record) => {
      const startTime = dayjs(record.startTimestamp)
      const endTime = record.endTimestamp ? dayjs(record.endTimestamp) : null

      return {
        date: startTime.format('YYYY-MM-DD'),
        startTimeValue: startTime.hour() * 60 + startTime.minute(),
        endTimeValue: endTime ? endTime.hour() * 60 + endTime.minute() : null,
        startTimeLabel: startTime.format('HH:mm'),
        endTimeLabel: endTime ? endTime.format('HH:mm') : '',
        duration: endTime
          ? (record.endTimestamp! - record.startTimestamp) / (1000 * 60 * 60)
          : 0
      }
    })

    // Filter and sort data
    const filteredData = minDuration
      ? processedData.filter((item) => item.duration >= minDuration)
      : processedData

    filteredData.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

    // Update Y axis domain
    updateYAxisDomain(filteredData)

    setChartData(filteredData)
  }, [records, minDuration])

  const updateYAxisDomain = (data: ChartData[]) => {
    const allTimes = data.reduce<number[]>((acc, curr) => {
      if (curr.startTimeValue !== null) acc.push(curr.startTimeValue)
      if (curr.endTimeValue !== null) acc.push(curr.endTimeValue)
      return acc
    }, [])

    if (allTimes.length > 0) {
      const minTime = Math.min(...allTimes)
      const maxTime = Math.max(...allTimes)

      const minDomain = Math.max(0, Math.floor((minTime - 30) / 30) * 30)
      const maxDomain = Math.min(24 * 60, Math.ceil((maxTime + 30) / 30) * 30)

      setYAxisDomain([minDomain, maxDomain])
    }
  }

  return { chartData, yAxisDomain }
}