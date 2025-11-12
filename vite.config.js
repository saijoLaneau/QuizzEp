import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚙️ Si ton dépôt s'appelle QuizzEp, adapte le "base"
export default defineConfig({
  plugins: [react()],
  base: '/QuizzEp/', 
  build: {
    outDir: 'docs', // 👈 le build ira dans le dossier /docs
  },
})
