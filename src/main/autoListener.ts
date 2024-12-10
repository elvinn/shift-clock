import { app, powerMonitor, Notification } from 'electron'

import { originalRecordManager, shiftRecordManager } from './model'
import { isSameDay, formatTime } from './utils/time'
import log from 'electron-log/main'

const workStartEvents = ['resume', 'unlock-screen', 'user-did-become-active'] as const
const workEndEvents = ['suspend', 'lock-screen', 'user-did-resign-active'] as const

let startTimeTimestamp: number
let endTimeTimestamp: number

async function initTimeStamps() {
  const startRecords = await originalRecordManager
    .getRecordsByEvents(workStartEvents)
    .catch(() => [])

  const now = Date.now()
  startTimeTimestamp =
    startRecords.find((record) => isSameDay(record.timestamp, now))?.timestamp || 0

  const endRecords = await originalRecordManager.getRecordsByEvents(workEndEvents).catch(() => [])
  endTimeTimestamp = endRecords.length > 0 ? endRecords[endRecords.length - 1].timestamp : 0

  log.info(
    [
      'Recover work time:',
      `start: ${new Date(startTimeTimestamp).toLocaleString()}`,
      `end: ${new Date(endTimeTimestamp).toLocaleDateString()}`
    ].join(' ')
  )
}

async function onWorkStartEventHandler(eventName: string) {
  const now = Date.now()
  await originalRecordManager.addRecord({
    event: eventName,
    timestamp: now
  })

  if (isSameDay(now, startTimeTimestamp) || now <= startTimeTimestamp) {
    return
  }

  // record work end time of last session
  await shiftRecordManager.addRecord({
    event: 'work-end',
    timestamp: endTimeTimestamp
  })

  if (Notification.isSupported()) {
    new Notification({
      title: 'Welcome back!',
      body: `Last work session: ${formatTime(startTimeTimestamp)} - ${formatTime(endTimeTimestamp)}`
    }).show()
  }

  // record work start time of current session
  startTimeTimestamp = now
  await shiftRecordManager.addRecord({
    event: 'work-start',
    timestamp: startTimeTimestamp
  })

  endTimeTimestamp = 0
}

async function onWorkEndEventHandler(eventName: string) {
  const now = Date.now()
  await originalRecordManager.addRecord({
    event: eventName,
    timestamp: now
  })

  endTimeTimestamp = now
}

export async function registerAutoListener() {
  await initTimeStamps()

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
