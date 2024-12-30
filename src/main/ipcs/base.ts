import { IpcMainEvent } from 'electron'

export interface IPCHandler {
  initialize(): void
}

export type IpcHandler = (event: IpcMainEvent, ...args: any[]) => Promise<any> | any
