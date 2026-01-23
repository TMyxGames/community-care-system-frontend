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
      // 如果你之前在 vue.config.js 配置了跨域代理，移到这里
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})