import { defineConfig } from 'vite'
 import * as path from 'path'
 
// https://vitejs.dev/config/
/**
 * import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
 * , Components({
    resolvers: [ElementPlusResolver()],,
  styleImport({
    libs: [
      {
        libraryName: 'vant',
        esModule: true,
        resolveStyle: (name) => `vant/es/${name}/style`,
      },
    ],
  }),
  })
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    hmr: {
      host: 'localhost',
      port: 3000
    }
  }
})
