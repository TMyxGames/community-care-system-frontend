import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 保持和你之前一样的 @ 符号快捷路径
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // port: 8080,
    proxy: {
      '/files': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})