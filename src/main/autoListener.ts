import { app, powerMonitor, Notification } from 'electron'

import { originalRecordsDb, shiftRecordsDb, ShiftRecordEvent, OriginalRecord } from './db'
import { isSameDay, formatTime } from './utils/time'
import log from 'electron-log/main'

const workStartEvents = ['app-launch', 'resume', 'unlock-screen', 'user-did-become-active'] as const
const workEndEvents = ['suspend', 'lock-screen', 'user-did-resign-active'] as const

let startTimeTimestamp: number
let endTimeTimestamp: number

async function initTimeStamps() {
  const lastStartRecord: OriginalRecord | null = await originalRecordsDb
    .findOneAsync({ event: { $in: workStartEvents } })
    .sort({ timestamp: -1 })
    .catch(() => null)

  const now = Date.now()
  startTimeTimestamp = isSameDay(lastStartRecord?.timestamp, now) ? lastStartRecord.timestamp : 0

  const lastEndRecord: OriginalRecord | null = await originalRecordsDb
    .findOneAsync({ event: { $in: workEndEvents } })
    .sort({ timestamp: -1 })
    .catch(() => null)

  endTimeTimestamp = lastEndRecord?.timestamp || 0

  log.info(
    [
      'Recover work time:',
      `start: ${startTimeTimestamp ? new Date(startTimeTimestamp).toLocaleString() : '-'}`,
      `end: ${endTimeTimestamp ? new Date(endTimeTimestamp).toLocaleString() : '-'}`
    ].join(' ')
  )
}

async function onWorkStartEventHandler(eventName: string) {
  const now = Date.now()
  await originalRecordsDb.insertAsync({
    event: eventName,
    timestamp: now
  })

  if (isSameDay(now, startTimeTimestamp) || now <= startTimeTimestamp) {
    return
  }

  // record work start time of current session
  await shiftRecordsDb.insertAsync({
    event: ShiftRecordEvent.WorkStart,
    timestamp: now
  })

  if (startTimeTimestamp && endTimeTimestamp) {
    // record work end time of last session
    await shiftRecordsDb.insertAsync({
      event: ShiftRecordEvent.WorkEnd,
      timestamp: endTimeTimestamp
    })

    if (Notification.isSupported()) {
      // to attract user's attention
      // wait for 2 seconds to show notification after start event
      const lastWorkSession = `${formatTime(startTimeTimestamp)} - ${formatTime(endTimeTimestamp)}`
      setTimeout(() => {
        new Notification({
          title: 'Welcome back!',
          body: `Last work session: ${lastWorkSession}`
        }).show()
      }, 2000)
    }
  }

  endTimeTimestamp = 0
  startTimeTimestamp = now
}

async function onWorkEndEventHandler(eventName: string) {
  const now = Date.now()
  await originalRecordsDb.insertAsync({
    event: eventName,
    timestamp: now
  })

  endTimeTimestamp = now
}

export async function registerAutoListener() {
  await initTimeStamps()
  onWorkStartEventHandler('app-launch')

  workStartEvents.forEach((event) => {
    powerMonitor.on(event as any, () => {
      onWorkStartEventHandler(event)
    })
  })

  workEndEvents.forEach((event) => {
    powerMonitor.on(event as any, () => {
      onWorkEndEventHandler(event)
    })
  })

  // @ts-ignore powerMonitor can't deal with event
  powerMonitor.on('shutdown', async (event: any) => {
    event.preventDefault()
    await onWorkEndEventHandler('shutdown')
    app.quit()
  })
}
