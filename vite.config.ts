import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`         -> normal site in /dist (use this for GitHub Pages / Vercel)
// `npm run build:single`  -> one self-contained index.html (handy for sharing as a single file)
export default defineConfig(({ mode }) => ({
  // On GitHub Pages the site lives at /<repo-name>/, set by the deploy workflow
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    chunkSizeWarningLimit: 2000,
  },
}))
