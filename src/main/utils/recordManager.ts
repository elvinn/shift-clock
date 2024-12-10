import { JsonlStorage } from './jsonlStorage'
import { addRowToNotionDb } from './notionStorage'

export interface BaseRecord {
  event: string
  timestamp: number
  [key: string]: any
}

export class RecordManager {
  private storage: JsonlStorage<BaseRecord>
  private notionDbId?: string
  constructor({ fileName, notionDbId }: { fileName: string; notionDbId?: string }) {
    if (!fileName) {
      throw new Error('File name is required')
    }

    this.storage = new JsonlStorage<BaseRecord>(fileName)
    this.notionDbId = notionDbId
  }

  /**
   * Add a new record
   */
  async addRecord(data: BaseRecord): Promise<void> {
    if (!data.event) {
      throw new Error('Record event is required')
    }

    const record: BaseRecord = {
      timestamp: Date.now(),
      ...data
    }
    await this.storage.append(record)

    if (this.notionDbId) {
      await addRowToNotionDb(this.notionDbId, record)
    }
  }

  /**
   * Get all records
   */
  async getAllRecords(): Promise<BaseRecord[]> {
    return await this.storage.load()
  }

  /**
   * Get records by events
   */
  async getRecordsByEvents(events: readonly string[]): Promise<BaseRecord[]> {
    const records = await this.storage.load()
    return records.filter((record) => events.includes(record.event))
  }

  /**
   * Get records within a time range
   */
  async getRecordsByTimeRange(startTime: number, endTime: number): Promise<BaseRecord[]> {
    const records = await this.storage.load()
    return records.filter((record) => record.timestamp >= startTime && record.timestamp <= endTime)
  }

  /**
   * Clear all records
   */
  async clearAllRecords(): Promise<void> {
    await this.storage.save([])
  }
}
