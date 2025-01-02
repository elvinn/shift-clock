import { app, powerMonitor } from 'electron'
import { saveStartRecord, saveEndRecord } from './db'
import Constants from './utils/constants'

async function onWorkStartEventHandler(eventName: string) {
  await saveStartRecord(eventName)
}

async function onWorkEndEventHandler(eventName: string) {
  await saveEndRecord(eventName)
}

export async function registerAutoListener() {
  await onWorkStartEventHandler('app-launch')

  Constants.WORK_START_EVENTS.forEach((event) => {
    powerMonitor.on(event as any, () => {
      onWorkStartEventHandler(event)
    })
  })

  Constants.WORK_END_EVENTS.forEach((event) => {
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
