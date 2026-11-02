import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const themeColor = '#0054a4'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // stickers and fonts are needed offline too
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'] },
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon-180x180.png'],
      manifest: {
        name: 'RE/MAX Kontor Sticker Generator',
        short_name: 'Sticker Generator',
        lang: 'de',
        display: 'standalone',
        theme_color: themeColor,
        background_color: themeColor,
        icons: [
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'node'
  }
})
