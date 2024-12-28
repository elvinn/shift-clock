import { AppIPCHandler } from './app'
import { FileIPCHandler } from './file'
import { WorkRecordsIPCHandler } from './workRecords'

export default class IPCs {
  private static handlers = [
    new AppIPCHandler(),
    new FileIPCHandler(),
    new WorkRecordsIPCHandler()
  ]

  static initialize(): void {
    this.handlers.forEach(handler => handler.initialize())
  }
}