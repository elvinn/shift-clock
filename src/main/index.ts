import { app, WebContents, RenderProcessGoneDetails } from 'electron'
import log from 'electron-log/main'


import Constants from './utils/constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import { registerAutoListener } from './autoListener'

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

  mainWindow = await createMainWindow()
  registerAutoListener()
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
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
