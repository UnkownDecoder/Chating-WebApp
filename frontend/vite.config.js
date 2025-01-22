import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Explicitly allow the project directory
      allow: [path.resolve(__dirname, '')],
    },
  },
});


