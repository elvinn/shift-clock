import { ipcMain, app, IpcMainEvent } from 'electron'
import { IIPCHandler } from './base'


export class AutoLaunchIPCHandler implements IIPCHandler {
  initialize(): void {
    ipcMain.handle('setAutoLaunch', async (event: IpcMainEvent, enable: boolean) => {
      if (enable) {
        if (!app.getLoginItemSettings().openAtLogin) {
          app.setLoginItemSettings({
            openAtLogin: true,
          })
        }
      } else {
        app.setLoginItemSettings({
          openAtLogin: false
        })
      }
    })

    ipcMain.handle('getAutoLaunchStatus', async () => {
      return app.getLoginItemSettings().openAtLogin
    })
  }
}
