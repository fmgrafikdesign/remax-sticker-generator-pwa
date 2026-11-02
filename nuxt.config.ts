const themeColor = '#0054a4'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  // browser-only tool (file input, canvas, Moveable): render on the client
  ssr: false,
  modules: ['@vite-pwa/nuxt'],
  // static app shell, precached by the service worker as offline navigation fallback
  nitro: { prerender: { routes: ['/'] } },
  css: ['@fontsource/roboto/latin-400.css', '@fontsource/roboto/latin-700.css', '~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'RE/MAX Immobilien Kontor Sticker Generator',
      meta: [
        { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
        { name: 'theme-color', content: themeColor },
        { name: 'msapplication-TileColor', content: themeColor },
        { name: 'msapplication-config', content: '/icons/browserconfig.xml' }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' },
        { rel: 'shortcut icon', href: '/icons/favicon.ico' }
      ],
      noscript: [{ textContent: 'Es tut mir Leid, aber diese Seite funktioniert leider nicht ohne JavaScript.' }]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
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
        { src: 'icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/api\//, /^\/stickers\//],
      runtimeCaching: [
        {
          // fresh list when online, cached list offline or on a slow connection
          urlPattern: ({ url }) => url.pathname === '/api/stickers',
          handler: 'NetworkFirst',
          options: { cacheName: 'sticker-list', networkTimeoutSeconds: 3 }
        },
        {
          // sticker URLs are immutable
          urlPattern: ({ url }) => url.pathname.startsWith('/stickers/'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'sticker-images',
            expiration: { maxEntries: 500 },
            cacheableResponse: { statuses: [200] }
          }
        }
      ]
    },
    client: { installPrompt: false }
  }
})
