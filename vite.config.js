import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    // basicSsl() // Auto-generates SSL certificates for HTTPS
  ],
  server: {
    port: 5173,
    https: false, // Temporarily disable HTTPS for testing
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['./config.js']
  },
  esbuild: {
    charset: 'utf8',
  },
});
