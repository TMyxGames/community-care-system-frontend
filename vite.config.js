import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig({
  plugins: [vue(), basicSsl()],
  resolve: {
    alias: {
      // 保持和你之前一样的 @ 符号快捷路径
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    https: true,
    // port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/files': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})