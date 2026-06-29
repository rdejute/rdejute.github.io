import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Root-repo deployment (username.github.io serves from the domain root).
  base: '/',
  plugins: [react()],
})
