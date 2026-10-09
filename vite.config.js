import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this repo at /vedvisherb/ — keep in sync with
// pathSegmentsToKeep in public/404.html. Use '/' for a custom-domain deploy.
export default defineConfig({
  base: '/vedvisherb/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx,mjs}'],
  },
})