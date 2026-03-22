import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/node_modules/three/')) {
            return 'three-core'
          }

          if (id.includes('/node_modules/@react-three/fiber/')) {
            return 'r3f-vendor'
          }

          if (id.includes('/node_modules/@react-three/drei/')) {
            return 'drei-vendor'
          }

          if (
            id.includes('/node_modules/@react-three/postprocessing/') ||
            id.includes('/node_modules/postprocessing/')
          ) {
            return 'postfx-vendor'
          }

          if (id.includes('firebase')) {
            return 'firebase-vendor'
          }

          return 'vendor'
        },
      },
    },
  },
})
