import path from 'path'
import Datastore from '@seald-io/nedb'

import { getAppDataPath } from '../utils/constants'

export interface ShiftRecord {
  startTimestamp: number
  endTimestamp?: number
}

export const shiftRecordsDb = new Datastore<ShiftRecord>({
  filename: path.join(getAppDataPath(), 'shiftRecords.db'),
  autoload: true
})
