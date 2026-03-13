import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      Vuetify({
        autoImport: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5176
    },
    preview: {
      host: '0.0.0.0',
      port: 5176
    }
  }
})
