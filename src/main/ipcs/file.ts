import { ipcMain, dialog, IpcMainEvent } from 'electron'
import { IPCHandler } from './base'

export class FileIPCHandler implements IPCHandler {
  initialize(): void {
    // Open file
    ipcMain.handle('openFile', async (event: IpcMainEvent, filter: string) => {
      const filters = []
      if (filter === 'text') {
        filters.push({ name: 'Text', extensions: ['txt', 'json'] })
      } else if (filter === 'zip') {
        filters.push({ name: 'Zip', extensions: ['zip'] })
      }
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters
      })
      return dialogResult
    })
  }
}
