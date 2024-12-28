import React, { useState, useEffect, useRef, useCallback } from 'react'
import './styles.scss'
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
  const [currentEndDate, setCurrentEndDate] = useState(Date.now())
  const daysPerPage = 30
  const startDate = currentEndDate - daysPerPage * 24 * 60 * 60 * 1000
  const containerRef = useRef<globalThis.HTMLDivElement>(null)

  const { data, loading, error } = useWorkRecords(startDate, currentEndDate)
  const [allData, setAllData] = useState<WorkSession[]>([])

  // 自动加载更多数据的逻辑
  useEffect(() => {
    if (!loading && data.hasEarlierRecords && data.records.length < 10) {
      const newEndDate = currentEndDate - daysPerPage * 24 * 60 * 60 * 1000
      setCurrentEndDate(newEndDate)
    }
  }, [data.records, data.hasEarlierRecords, loading, currentEndDate])

  useEffect(() => {
    setAllData((prevData) => {
      const existingTimestamps = new Set(prevData.map((item) => item.startTimestamp))

      const newRecords = data.records.filter(
        (record) => !existingTimestamps.has(record.startTimestamp)
      )

      return [...prevData, ...newRecords]
    })
  }, [data.records])

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !data.hasEarlierRecords) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      const newEndDate = currentEndDate - daysPerPage * 24 * 60 * 60 * 1000
      setCurrentEndDate(newEndDate)
    }
  }, [loading, data.hasEarlierRecords, currentEndDate])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  if (error) {
    return <div className="error">Error: {error.message}</div>
  }

  return (
    <div className="page clock-page" ref={containerRef}>
      {allData.map((item, index) => (
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
