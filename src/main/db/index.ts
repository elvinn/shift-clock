import { originalRecordsDb } from './originalRecord'
import { shiftRecordsDb, ShiftRecord } from './shiftRecord'
import { isToday, getTodayStartTimestamp } from '../utils/time'

export * from './shiftRecord'

let todayStartEventTimestamp = 0
async function getTodayStartEventTimestamp() {
  if (isToday(todayStartEventTimestamp)) {
    return todayStartEventTimestamp
  }

  const todayShiftRecord: ShiftRecord | null = await shiftRecordsDb
    .findOneAsync({
      startTimestamp: { $gte: getTodayStartTimestamp() }
    })
    .sort({ timestamp: 1 })
    .catch(() => null)

  todayStartEventTimestamp = todayShiftRecord?.startTimestamp || 0
  return todayStartEventTimestamp
}

export async function saveStartRecord(eventName: string, timestamp: number = Date.now()) {
  await originalRecordsDb.insertAsync({
    event: eventName,
    timestamp
  })

  const startTimestamp = (await getTodayStartEventTimestamp()) || timestamp
  if (startTimestamp !== timestamp) {
    // start again, clear today end timestamp
    await clearTodayEndTimestamp()
    return
  }

  const shiftRecord = await shiftRecordsDb
    .findOneAsync({
      startTimestamp: timestamp
    })
    .catch(() => null)

  if (shiftRecord) {
    // have been saved before
    return
  }

  // today first start event, save it to shiftRecordsDb
  await shiftRecordsDb.insertAsync({
    startTimestamp
  })
}

async function clearTodayEndTimestamp() {
  const startTimestamp = await getTodayStartEventTimestamp()
  if (!startTimestamp) {
    return
  }

  await shiftRecordsDb.updateAsync(
    { startTimestamp },
    { $unset: { endTimestamp: true } },
    { upsert: false }
  )
}

export async function saveEndRecord(eventName: string, timestamp: number = Date.now()) {
  await originalRecordsDb.insertAsync({
    event: eventName,
    timestamp
  })

  const startTimestamp = await getTodayStartEventTimestamp()
  if (!startTimestamp) {
    return
  }

  await shiftRecordsDb.updateAsync({ startTimestamp }, { $set: { endTimestamp: timestamp } })
}
