import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/vuetify/styles/settings.scss'
        }
      })
    ],
    optimizeDeps: {
      exclude: ['vue3-emoji-picker']  // Remove any exclusions, or keep only what is needed
    },
    build: {
      rollupOptions: {
        external: []  // Remove @sentry/vue and vue-highlight-words from here
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
