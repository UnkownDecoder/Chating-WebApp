import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow node_modules and public fonts directory
      allow: [
        path.resolve(__dirname, ''),
        path.resolve(__dirname, 'node_modules'),
      ],
    },
  },
});



