import { ipcMain, shell } from 'electron'
import Constants from '../utils/constants'
import { IIPCHandler } from './base'

export class AppIPCHandler implements IIPCHandler {
  initialize(): void {
    // Get application version
    ipcMain.handle('msgRequestGetVersion', () => {
      return Constants.APP_VERSION
    })

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event, url: string) => {
      await shell.openExternal(url)
    })
  }
}