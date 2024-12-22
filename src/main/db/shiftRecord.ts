import path from 'path'
import Datastore from '@seald-io/nedb'

import { getAppDataPath } from '../utils/constants'

/* eslint-disable no-unused-vars */
export enum ShiftRecordEvent {
  WorkStart = 'work-start',
  WorkEnd = 'work-end'
}
/* eslint-enable no-unused-vars */

export interface ShiftRecord {
  event: ShiftRecordEvent
  timestamp: number
  [key: string]: any
}

export const shiftRecordsDb = new Datastore<ShiftRecord>({
  filename: path.join(getAppDataPath(), 'shiftRecords.db'),
  autoload: true
})
