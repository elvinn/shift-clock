import { useState, useEffect } from 'react'

interface WorkSession {
  startTimestamp: number
  endTimestamp?: number
}

interface UseWorkRecordsResult {
  data: {
    records: WorkSession[]
    hasEarlierRecords: boolean
  }
  loading: boolean
  error: Error | null
}

/**
 * A hook to fetch work records from the main process.
 * @param startDate - The start date to fetch records from.
 * @param endDate - The end date to fetch records to.
 * @returns The work records and loading state.
 */
export const useWorkRecords = (startDate: number, endDate: number): UseWorkRecordsResult => {
  const [data, setData] = useState<UseWorkRecordsResult['data']>({
    records: [],
    hasEarlierRecords: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await window.electronAPI.invoke('getWorkRecords', {
          startDate,
          endDate
        })

        setData({
          records: response.records,
          hasEarlierRecords: response.hasEarlierRecords
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load work records'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  return { data, loading, error }
}
