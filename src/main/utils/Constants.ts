import { app, screen } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { name, version } from '../../../package.json'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default class Constants {
  // Display app name (uppercase first letter)
  static APP_NAME = name.charAt(0).toUpperCase() + name.slice(1)

  static APP_VERSION = version

  static IS_DEV_ENV = process.env.NODE_ENV === 'development'

  static IS_MAC = process.platform === 'darwin'

  static WEB_PREFERENCES = {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    devTools: this.IS_DEV_ENV,
    preload: join(__dirname, '../preload/index.js'),
    sandbox: true
  }

  static WORK_START_EVENTS = [
    'app-launch',
    'resume',
    'unlock-screen',
    'user-did-become-active'
  ] as const

  static WORK_END_EVENTS = ['app-exit', 'suspend', 'lock-screen', 'user-did-resign-active'] as const

  static getWindowOptions() {
    const allDisplays = screen.getAllDisplays()
    const primaryDisplay = screen.getPrimaryDisplay()
    const secondaryDisplay = allDisplays.find((display) => display.id !== primaryDisplay.id)

    // use secondary display if dev env, otherwise use primary display
    const targetDisplay = this.IS_DEV_ENV ? secondaryDisplay || primaryDisplay : primaryDisplay

    const width = this.IS_DEV_ENV ? 1500 : 1000
    const height = 650

    const windowOptions = {
      x: Math.floor(targetDisplay.bounds.x + (targetDisplay.bounds.width - width) / 2),
      y: Math.floor(targetDisplay.bounds.y + (targetDisplay.bounds.height - height) / 2),
      width,
      height
    }

    return windowOptions
  }

  static APP_INDEX_URL_DEV = 'http://localhost:5173/index.html'
  static APP_INDEX_URL_PROD = join(__dirname, '../index.html')
}

export function getAppDataPath() {
  return Constants.IS_DEV_ENV ? join(__dirname, '../../data') : app.getPath('userData')
}
