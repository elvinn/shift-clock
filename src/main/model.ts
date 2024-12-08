import { RecordManager } from './utils/recordManager'

export const originalRecordManager = new RecordManager({
  fileName: 'originalRecords'
})

export const shiftRecordManager = new RecordManager({
  fileName: 'workTimeRecords',
  notionDbId: process.env.NOTION_DATABASE_ID
})
