import { IpcMainEvent } from 'electron'

export interface IIPCHandler {
  initialize(): void
}

export type IpcHandler = (event: IpcMainEvent, ...args: any[]) => Promise<any> | any