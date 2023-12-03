import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: '9 Men Morris',
        theme_color: '#fff',
        display: 'standalone',
        orientation: 'portrait',
      },
    }),
  ],
})
