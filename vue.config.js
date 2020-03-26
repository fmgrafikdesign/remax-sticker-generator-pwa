const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')

module.exports = {
  pwa: {
    name: 'RE/MAX Kontor Sticker Generator',
    manifestPath: 'manifest.json',
    workboxOptions: {
      skipWaiting: true
    },
    themeColor: '#0054a4',
    msTileColor: '#0054a4',
    iconPaths: {
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon.png',
      maskIcon: 'icons/safari-pinned-tab.svg',
      msTileImage: 'icons/mstile-150x150.png'
    },
    manifestOptions: {
      name: 'RE/MAX Kontor Sticker Generator',
      background_color: '#0054a4',
      icons: [
        {
          'src': './icons/android-chrome-192x192.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': './icons/android-chrome-512x512.png',
          'sizes': '512x512',
          'type': 'image/png'
        },
        {
          'src': './icons/android-chrome-maskable-192x192.png',
          'sizes': '192x192',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './icons/android-chrome-maskable-512x512.png',
          'sizes': '512x512',
          'type': 'image/png',
          'purpose': 'maskable'
        }
      ]
    }
  },
  configureWebpack: {
    plugins: [
      // new FaviconsWebpackPlugin(),
      new GoogleFontsPlugin({
        fonts: [
          { family: 'Roboto', variants: ['400', '600', '700'] }
        ]
      })
    ]
  }
}
