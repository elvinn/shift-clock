import Store from 'electron-store'

// TODO: Add config options
interface Config {}

const config = new Store<Config>({
  name: 'config',
  defaults: {}
}) as Store<Config> & { get: (key: keyof Config) => Config[keyof Config] }

export default config
