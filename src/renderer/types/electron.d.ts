declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electronAPI: {
      invoke(channel: string, ...data: any[]): Promise<any>
      on(channel: string, listener: (...args: any[]) => void): void
      off(channel: string, listener: (...args: any[]) => void): void
    }
  }
}

export { }
