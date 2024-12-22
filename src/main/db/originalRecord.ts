import path from 'path'
import Datastore from '@seald-io/nedb'

import { getAppDataPath } from '../utils/constants'

export interface OriginalRecord {
  event: string
  timestamp: number
  [key: string]: any
}

export const originalRecordsDb = new Datastore<OriginalRecord>({
  filename: path.join(getAppDataPath(), 'originalRecords.db'),
  autoload: true
})
