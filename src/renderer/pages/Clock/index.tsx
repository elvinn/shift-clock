import React, { useState, useEffect, useRef, useCallback } from 'react'
import './styles.css'
import arrow from '../../assets/arrow.png'

import { useWorkRecords } from '../../hooks/'

interface WorkSession {
  startTimestamp: number
  endTimestamp?: number
}

const Record: React.FC<WorkSession> = ({ startTimestamp, endTimestamp }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // 检查是否是今天
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return 'Today'
    }

    // 检查是否是昨天
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday'
    }

    // 如果是今年
    if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    // 其他年份
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDay = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  }

  return (
    <div className="record">
      <h2>
        <span className="date">{formatDate(startTimestamp)}</span>
        <span className="day-label">{formatDay(startTimestamp)}</span>
      </h2>
      <div className="time-entry">
        <span>{formatTime(startTimestamp)}</span>
        <img className="arrow" src={arrow} alt="arrow" />
        <span>{endTimestamp ? formatTime(endTimestamp) : '...'}</span>
      </div>
    </div>
  )
}

const Clock: React.FC = () => {
  const [endDate, setEndDate] = useState(Date.now())

  const daysPerPage = 30
  const startDate = endDate - daysPerPage * 24 * 60 * 60 * 1000
  const containerRef = useRef<globalThis.HTMLDivElement>(null)

  const { data, loading, error } = useWorkRecords(startDate, endDate)
  const [records, setRecords] = useState<WorkSession[]>([])

  // 自动加载更多数据的逻辑
  useEffect(() => {
    if (!loading && data.hasEarlierRecords && data.records.length < 10) {
      const newEndDate = endDate - daysPerPage * 24 * 60 * 60 * 1000
      setEndDate(newEndDate)
    }
  }, [data.records, data.hasEarlierRecords, loading, endDate])

  useEffect(() => {
    setRecords((preRecords) => {
      // Create a map of existing records for easy lookup and update
      const existingRecordsMap = new Map(
        preRecords.map((record) => [record.startTimestamp, record])
      )

      // Process new records
      data.records.forEach((newRecord) => {
        if (existingRecordsMap.has(newRecord.startTimestamp)) {
          // Update endTimestamp of existing record if needed
          const existingRecord = existingRecordsMap.get(newRecord.startTimestamp)!
          existingRecordsMap.set(newRecord.startTimestamp, {
            ...existingRecord,
            endTimestamp: newRecord.endTimestamp
          })
        } else {
          // Add new record
          existingRecordsMap.set(newRecord.startTimestamp, newRecord)
        }
      })

      // Convert map back to array and sort
      return Array.from(existingRecordsMap.values()).sort(
        (a, b) => b.startTimestamp - a.startTimestamp
      )
    })
  }, [data.records])

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !data.hasEarlierRecords) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      const newEndDate = endDate - daysPerPage * 24 * 60 * 60 * 1000
      setEndDate(newEndDate)
    }
  }, [loading, data.hasEarlierRecords, endDate])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const handleStartEvent = useCallback((_: any, data: any) => {
    const eventDate = new Date(Date.now())
    const currentEndDate = new Date(endDate)
    if (
      eventDate.getFullYear() === currentEndDate.getFullYear() &&
      eventDate.getMonth() === currentEndDate.getMonth() &&
      eventDate.getDate() === currentEndDate.getDate()
    ) {
      return
    }

    setEndDate(Date.now())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    window.electronAPI.on('triggerStartEvent', handleStartEvent)
    return () => {
      window.electronAPI.off('triggerStartEvent', handleStartEvent)
    }
  }, [handleStartEvent])

  if (error) {
    return <div className="error">Error: {error.message}</div>
  }

  return (
    <div className="page clock-page" ref={containerRef}>
      {records.map((item, index) => (
        <React.Fragment key={`${item.startTimestamp}-${index}`}>
          <Record {...item} />
          <div className="divider" />
        </React.Fragment>
      ))}
      {loading && <div className="loading">Loading...</div>}
    </div>
  )
}

export default Clock
