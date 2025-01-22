import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow access to node_modules, public directory, and other relevant paths
      allow: [
        path.resolve(__dirname, ''),
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'public'),
        path.resolve(__dirname, 'src/Components/sounds'), // Add sounds directory
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Simplify imports with '@'
    },
  },
});




