import { app, powerMonitor, Notification } from 'electron'

import { originalRecordsDb, shiftRecordsDb, OriginalRecord } from './db'
import { isSameDay, formatTime, getTodayStartTimestamp } from './utils/time'
import log from 'electron-log/main'

const workStartEvents = ['app-launch', 'resume', 'unlock-screen', 'user-did-become-active'] as const
const workEndEvents = ['suspend', 'lock-screen', 'user-did-resign-active'] as const

let startTimestamp: number
let endTimestamp: number

async function initTimeStamps() {
  const todayStartRecord: OriginalRecord | null = await originalRecordsDb
    .findOneAsync({
      event: { $in: workStartEvents },
      timestamp: { $gte: getTodayStartTimestamp() }
    })
    .sort({ timestamp: 1 })
    .catch(() => null)

  const now = Date.now()
  startTimestamp = isSameDay(todayStartRecord?.timestamp, now) ? todayStartRecord.timestamp : 0

  const lastEndRecord: OriginalRecord | null = await originalRecordsDb
    .findOneAsync({ event: { $in: workEndEvents } })
    .sort({ timestamp: -1 })
    .catch(() => null)

  endTimestamp = lastEndRecord?.timestamp || 0

  log.info(
    [
      'Recover work time:',
      `start: ${startTimestamp ? new Date(startTimestamp).toLocaleString() : '-'},`,
      `end: ${endTimestamp ? new Date(endTimestamp).toLocaleString() : '-'}`
    ].join(' ')
  )
}

async function onWorkStartEventHandler(eventName: string) {
  const now = Date.now()
  await originalRecordsDb.insertAsync({
    event: eventName,
    timestamp: now
  })

  if (isSameDay(now, startTimestamp) || now <= startTimestamp) {
    return
  }

  // record work start time of current session
  await shiftRecordsDb.insertAsync({
    startTimestamp: now,
  })

  if (startTimestamp && endTimestamp) {
    // update work end time of last session
    await shiftRecordsDb.updateAsync(
      { startTimestamp },
      { $set: { endTimestamp } },
      { upsert: true }
    )

    if (Notification.isSupported()) {
      // to attract user's attention
      // wait for 2 seconds to show notification after start event
      const lastWorkSession = `${formatTime(startTimestamp)} - ${formatTime(endTimestamp)}`
      setTimeout(() => {
        new Notification({
          title: 'Welcome back!',
          body: `Last work session: ${lastWorkSession}`
        }).show()
      }, 2000)
    }
  }

  endTimestamp = 0
  startTimestamp = now
}

async function onWorkEndEventHandler(eventName: string) {
  const now = Date.now()
  await originalRecordsDb.insertAsync({
    event: eventName,
    timestamp: now
  })

  endTimestamp = now
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
