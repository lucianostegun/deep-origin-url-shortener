import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Accept connections from any host
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api:3000', // Use Docker service name for API
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // Ensure proper handling of client-side routing
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
