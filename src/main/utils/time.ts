export function isToday(timestamp: number): boolean {
  return isSameDay(timestamp, Date.now())
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  if (!timestamp1 || !timestamp2) {
    return false
  }

  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

export function getTodayStartTimestamp(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}
