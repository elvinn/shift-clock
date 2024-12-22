import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import ElectronPlugin, { ElectronOptions } from 'vite-plugin-electron'
import RendererPlugin from 'vite-plugin-electron-renderer'
import EslintPlugin from 'vite-plugin-eslint'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'
import react from '@vitejs/plugin-react'

const isDevEnv = process.env.NODE_ENV === 'development'

export default defineConfig(({ mode }) => {
  process.env = {
    ...(isDevEnv
      ? {
        ELECTRON_ENABLE_LOGGING: 'true'
      }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  rmSync('dist', { recursive: true, force: true })

  const electronPluginConfigs: ElectronOptions[] = [
    {
      entry: 'src/main/index.ts',
      onstart({ startup }) {
        startup()
      },
      vite: {
        root: resolve('.'),
        build: {
          assetsDir: '.',
          outDir: 'dist/main',
          rollupOptions: {
            external: ['electron', ...builtinModules]
          }
        }
      }
    },
    {
      entry: 'src/preload/index.ts',
      onstart({ reload }) {
        reload()
      },
      vite: {
        root: resolve('.'),
        build: {
          outDir: 'dist/preload'
        }
      }
    },
  ]

  return {
    define: {},
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
      alias: {
        '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src')
      }
    },
    base: './',
    root: resolve('./src/renderer'),
    publicDir: resolve('./src/renderer/public'),
    clearScreen: false,
    build: {
      sourcemap: isDevEnv,
      minify: !isDevEnv,
      outDir: resolve('./dist')
    },
    plugins: [
      react(),
      EslintPlugin(),
      ElectronPlugin(electronPluginConfigs),
      RendererPlugin()
    ]
  }
})
