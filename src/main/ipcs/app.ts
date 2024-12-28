import { ipcMain, shell } from 'electron'
import Constants from '../utils/constants'
import { IIPCHandler } from './base'

export class AppIPCHandler implements IIPCHandler {
  initialize(): void {
    // Update channel names
    ipcMain.handle('requestGetVersion', () => {
      return Constants.APP_VERSION
    })

    ipcMain.on('openExternalLink', async (event, url: string) => {
      await shell.openExternal(url)
    })
  }
}