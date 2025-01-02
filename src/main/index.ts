import { app, WebContents, RenderProcessGoneDetails } from 'electron'
import log from 'electron-log/main'

import Constants from './utils/constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import { registerAutoListener } from './autoListener'
import { saveEndRecord } from './db'

let mainWindow
let errorWindow

app.on('ready', async () => {
  // Disable special menus on macOS by uncommenting the following, if necessary
  /*
  if (Constants.IS_MAC) {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
  }
  */

  await registerAutoListener()
  mainWindow = await createMainWindow()
})

app.on('window-all-closed', async () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    await saveEndRecord('app-exit')
    app.quit()
  }
})

app.on(
  'render-process-gone',
  (event: Event, webContents: WebContents, details: RenderProcessGoneDetails) => {
    errorWindow = createErrorWindow(errorWindow, mainWindow, details)
  }
)

process.on('uncaughtException', (error) => {
  log.error('uncaughtException', error)
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})
