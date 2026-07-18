import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor chunks to reduce initial JS bundle size (fixes 299 KiB unused JS warning)
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — rarely changes, gets long-term cached
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI icon library — separate chunk since it's large
          'ui-vendor': ['lucide-react'],
          // Analytics — async, non-critical
          'analytics': ['@vercel/analytics'],
        },
      },
    },
    // Increase chunk warning threshold slightly (complex app with many pages)
    chunkSizeWarningLimit: 600,
  },
})
