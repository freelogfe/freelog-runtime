import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    port: 7000,
    hmr: {
      host: 'localhost',
      port: 7000
    }
  }
})
