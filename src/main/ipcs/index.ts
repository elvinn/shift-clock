import { AppIPCHandler } from './app'
import { FileIPCHandler } from './file'
import { WorkRecordsIPCHandler } from './workRecords'
import { AutoLaunchIPCHandler } from './autoLaunch'

export default class IPCs {
  private static handlers = [
    new AppIPCHandler(),
    new FileIPCHandler(),
    new WorkRecordsIPCHandler(),
    new AutoLaunchIPCHandler()
  ]

  static initialize(): void {
    this.handlers.forEach((handler) => handler.initialize())
  }
}
