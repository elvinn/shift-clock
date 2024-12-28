import { ipcMain, IpcMainEvent } from 'electron'
import { shiftRecordsDb, ShiftRecord, ShiftRecordEvent } from '../db'
import { IIPCHandler } from './base'

export class WorkRecordsIPCHandler implements IIPCHandler {
  private firstStart: number | null = null

  private async getFirstStart(): Promise<number | null> {
    if (this.firstStart) {
      return this.firstStart
    }
    const record = await shiftRecordsDb
      .findAsync({ event: ShiftRecordEvent.WorkStart })
      .sort({ timestamp: 1 })
      .limit(1)

    this.firstStart = record[0]?.timestamp || null

    return this.firstStart
  }

  initialize(): void {
    // Get work records
    ipcMain.handle(
      'getWorkRecords',
      async (event: IpcMainEvent, { startDate, endDate }: { startDate: number; endDate: number }) => {
        const firstStart = await this.getFirstStart()
        // Find work records within date range
        const records = await shiftRecordsDb
          .findAsync({
            timestamp: { $lte: endDate, $gte: startDate }
          })
          .sort({ timestamp: -1 })

        // Group records by day and process each day's records
        const workSessions: { startTimestamp: number; endTimestamp?: number }[] = []

        // Group records by day
        const recordsByDay = new Map<string, ShiftRecord[]>()
        for (const record of records) {
          const date = new Date(record.timestamp)
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
          if (!recordsByDay.has(dayKey)) {
            recordsByDay.set(dayKey, [])
          }
          recordsByDay.get(dayKey)!.push(record)
        }

        // Process each day's records
        for (const dayRecords of recordsByDay.values()) {
          let firstStart: number | null = null
          let lastEnd: number | null = null

          // Find earliest start and latest end
          for (const record of dayRecords) {
            if (record.event === ShiftRecordEvent.WorkStart) {
              if (firstStart === null || record.timestamp < firstStart) {
                firstStart = record.timestamp
              }
            } else if (record.event === ShiftRecordEvent.WorkEnd) {
              if (lastEnd === null || record.timestamp > lastEnd) {
                lastEnd = record.timestamp
              }
            }
          }

          // Add session if we have a start time
          if (firstStart !== null) {
            workSessions.push({
              startTimestamp: firstStart,
              endTimestamp: lastEnd || null
            })
          }
        }

        if (workSessions.length === 0) {
          return {
            records: [],
            hasEarlierRecords: firstStart !== null && firstStart < startDate
          }
        }

        // Find earliest timestamp in current records
        const earliestTimestamp = Math.min(...records.map(r => r.timestamp))

        return {
          records: workSessions,
          hasEarlierRecords: firstStart !== null && earliestTimestamp > firstStart
        }
      }
    )
  }
}