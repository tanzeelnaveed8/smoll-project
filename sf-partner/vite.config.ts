import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Vuetify({
    autoImport: true,
    styles: {
      configFile: 'src/vuetify/styles/settings.scss'
    }
  }), sentryVitePlugin({
    org: "smoll-lo",
    project: "smoll-partner"
  })],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    sourcemap: true
  },
  server: {
    host: '0.0.0.0',
    port: 5174
  }
})