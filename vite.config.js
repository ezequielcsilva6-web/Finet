import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/finance': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/goals': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/investments': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/analysis': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
