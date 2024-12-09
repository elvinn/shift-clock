import { RecordManager } from './utils/recordManager'
import config from '../config'

export const originalRecordManager = new RecordManager({
  fileName: 'originalRecords'
})

export const shiftRecordManager = new RecordManager({
  fileName: 'workTimeRecords',
  notionDbId: config.get('notionDatabaseId')
})
