import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, ''),
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'public'),
        path.resolve(__dirname, 'src/Components/sounds'),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: [
      '@mapbox/node-pre-gyp',   // Ensure node-pre-gyp is excluded from frontend bundle
      'nock',
      'aws-sdk',
      'mock-aws-s3',
    ],
  },
  build: {
    rollupOptions: {
      external: ['@mapbox/node-pre-gyp'], // Mark node-pre-gyp as external if needed
    }
  }
});
