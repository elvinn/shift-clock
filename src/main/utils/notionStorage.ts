import { Client } from '@notionhq/client'
import log from 'electron-log/main'
import { BaseRecord } from './recordManager'
import { name } from '../../../package.json'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

function formatNotionProperties(data: BaseRecord): any {
  const properties: Record<string, any> = {}
  const { event, timestamp, ...rest } = data

  properties.title = {
    title: [{ text: { content: `event from ${name} ` } }]
  }
  properties.event = {
    select: {
      name: event
    }
  }

  properties.time = {
    date: {
      start: new Date(timestamp).toISOString()
    }
  }

  Object.entries(rest).forEach(([key, value]) => {
    properties[key] = {
      rich_text: [{ text: { content: value } }]
    }
  })

  return properties
}

export async function addRowToNotionDb(databaseId: string, data: BaseRecord) {
  const { event, timestamp } = data
  if (!event || !timestamp) {
    throw new Error(`event and timestamp are required: ${JSON.stringify(data)}`)
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: formatNotionProperties(data)
    })
    log.info('Successfully added row to notion db:', response)
  } catch (error) {
    log.error('Failed to add row to notion db:', error)
  }
}
