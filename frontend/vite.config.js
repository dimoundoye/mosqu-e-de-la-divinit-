import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        histoire: resolve(__dirname, 'histoire.html'),
        boutique: resolve(__dirname, 'boutique.html'),
        renovation: resolve(__dirname, 'renovation.html'),
      },
    },
  },
});
