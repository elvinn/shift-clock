declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electronAPI: {
      invoke(channel: string, ...data: any[]): Promise<any>;
    }
  }
}

export { }
