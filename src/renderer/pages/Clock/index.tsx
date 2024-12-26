import React, { useState } from 'react'
import './styles.scss'
import arrow from '../../assets/arrow.png'

interface RecordProps {
  startTimestamp: number
  endTimestamp: number
}

const Record: React.FC<RecordProps> = ({ startTimestamp, endTimestamp }) => {
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
        <span>{formatTime(endTimestamp)}</span>
      </div>
    </div>
  )
}

const mockData = [
  {
    startTimestamp: new Date('2024-12-25T09:30:00').getTime(),
    endTimestamp: new Date('2024-12-25T21:00:00').getTime()
  },
  {
    startTimestamp: new Date('2024-12-24T09:30:00').getTime(),
    endTimestamp: new Date('2024-12-24T21:00:00').getTime()
  },
  {
    startTimestamp: new Date('2024-12-23T09:30:00').getTime(),
    endTimestamp: new Date('2024-12-23T21:00:00').getTime()
  }
]

const Clock: React.FC = () => {
  const [data] = useState(mockData)
  return (
    <div className="page clock-page">
      {data.map((item) => (
        <>
          <Record key={item.startTimestamp} {...item} />
          <div className="divider"></div>
        </>
      ))}
    </div>
  )
}

export default Clock
