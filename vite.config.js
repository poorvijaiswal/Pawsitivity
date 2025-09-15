import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion', 'gsap'],
          icons: ['react-icons', 'lucide-react']
        }
      }
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000
  },
  // Optimize dev server
  server: {
    // Enable file system caching
    fs: {
      strict: false
    }
  },
  // Asset optimization
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp']
})
