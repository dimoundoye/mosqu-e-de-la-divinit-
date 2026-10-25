import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Les styles sont écrits en modules CSS (un fichier par composant) sur la
// base des jetons de src/styles/tokens.css : plus besoin de Tailwind.
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild',
  },
})
