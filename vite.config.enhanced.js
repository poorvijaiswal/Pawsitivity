// Performance Enhancement Configuration

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['framer-motion', 'gsap'],
          icons: ['react-icons', 'lucide-react']
        }
      }
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true
  },
  // Optimize dev server
  server: {
    // Enable file system caching
    fs: {
      strict: false
    },
    // Hot reload optimization
    hmr: {
      overlay: true
    }
  },
  // Asset optimization
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  
  // Image optimization hints (manual implementation needed)
  define: {
    __IMAGE_OPTIMIZATION_GUIDE__: {
      maxSize: '500KB', // Target max size per image
      recommendedFormat: 'webp',
      qualityRange: '75-85%',
      maxDimensions: '1200x800'
    }
  }
})