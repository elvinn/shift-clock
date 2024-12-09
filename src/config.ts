import Store from 'electron-store'

interface Config {
  notionToken?: string
  notionDatabaseId?: string
}

const config = new Store<Config>({
  name: 'config',
  defaults: {
    notionToken: '',
    notionDatabaseId: ''
  }
}) as Store<Config> & { get: (key: keyof Config) => Config[keyof Config] }

export default config
