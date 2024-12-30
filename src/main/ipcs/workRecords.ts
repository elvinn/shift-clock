import { ipcMain, IpcMainEvent } from 'electron'
import { shiftRecordsDb } from '../db'
import { IPCHandler } from './base'

export class WorkRecordsIPCHandler implements IPCHandler {
  private firstStart: number | null = null

  private async getFirstStart(): Promise<number | null> {
    if (this.firstStart) {
      return this.firstStart
    }
    const record = await shiftRecordsDb
      .findAsync({})
      .sort({ startTimestamp: 1 })
      .limit(1)

    this.firstStart = record[0]?.startTimestamp || null

    return this.firstStart
  }

  initialize(): void {
    // Get work records
    ipcMain.handle(
      'getWorkRecords',
      async (event: IpcMainEvent, { startDate, endDate }: { startDate: number; endDate: number }) => {

        const [firstStart, records] = await Promise.all([
          this.getFirstStart(),
          // Find work records within date range
          shiftRecordsDb
            .findAsync({
              startTimestamp: { $lte: endDate, $gte: startDate }
            })
            .sort({ startTimestamp: -1 })
        ])

        if (records.length === 0) {
          return {
            records: [],
            hasEarlierRecords: firstStart !== null && firstStart < startDate
          }
        }

        // Find earliest timestamp in current records
        const earliestTimestamp = Math.min(...records.map(r => r.startTimestamp))

        return {
          records,
          hasEarlierRecords: firstStart !== null && earliestTimestamp > firstStart
        }
      }
    )
  }
}