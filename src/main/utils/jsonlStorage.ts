import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import log from 'electron-log/main'

export class JsonlStorage<T extends object> {
  private readonly filePath: string

  constructor(fileName: string) {
    const dataPath = app.getPath('userData')
    const normalizedFileName = fileName.endsWith('.jsonl') ? fileName : `${fileName}.jsonl`

    this.filePath = path.join(dataPath, normalizedFileName)
  }

  /**
   * Save array of objects to file, overwriting existing content
   */
  async save(data: T[]): Promise<void> {
    try {
      const jsonLines = data.map((item) => JSON.stringify(item)).join('\n')
      await fs.writeFile(this.filePath, jsonLines, 'utf-8')
      log.info(`Successfully saved data to ${this.filePath}`)
    } catch (error) {
      log.error(`Failed to save data to ${this.filePath}:`, error)
      throw error
    }
  }

  /**
   * Append a single object to the end of file
   */
  async append(item: T): Promise<void> {
    try {
      const jsonLine = JSON.stringify(item)
      await fs.appendFile(this.filePath, jsonLine + '\n', 'utf-8')
      log.info(`Successfully appended data to ${this.filePath}`)
    } catch (error) {
      log.error(`Failed to append data to ${this.filePath}:`, error)
      throw error
    }
  }

  /**
   * Load and parse file content into array of objects
   */
  async load(): Promise<T[]> {
    try {
      await fs.access(this.filePath)
    } catch {
      return []
    }

    const content = await fs.readFile(this.filePath, 'utf-8')
    if (!content.trim()) {
      return []
    }

    try {
      const lines = content.trim().split('\n')
      const data: T[] = []

      for (const line of lines) {
        try {
          if (line.trim()) {
            const parsedItem = JSON.parse(line) as T
            data.push(parsedItem)
          }
        } catch (parseError) {
          log.warn(`Failed to parse line in ${this.filePath}:`, parseError)
        }
      }

      log.info(`Successfully loaded ${data.length} items from ${this.filePath}`)
      return data
    } catch (error) {
      log.error(`Failed to load data from ${this.filePath}:`, error)
      throw error
    }
  }
}
