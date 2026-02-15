import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-msw',
      writeBundle() {
        try {
          copyFileSync('public/mockServiceWorker.js', 'dist/mockServiceWorker.js');
          console.log('✓ Copied mockServiceWorker.js to dist');
        } catch (error) {
          console.warn('⚠ Could not copy mockServiceWorker.js:', error);
        }
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});