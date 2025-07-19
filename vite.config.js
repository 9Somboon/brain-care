import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This makes the server accessible externally
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443 // Use 443 for Gitpod / WebContainer
    },
    watch: {
      usePolling: true // Needed for WSL / some Docker setups
    },
    allowedHosts: [
      '.gitpod.io',
      '.csb.app',
      '.stackblitz.io',
      'lazy-bars-dig.loca.lt' // Added by Bolt
    ]
  }
})
