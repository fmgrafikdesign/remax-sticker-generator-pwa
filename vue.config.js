const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')

module.exports = {
  pwa: {
    name: 'RE/MAX Kontor Sticker Generator',
    manifestPath: 'assets/manifest.json',
    themeColor: '#0054a4',
    msTileColor: '#0054a4',
    manifestOptions: {
      name: 'RE/MAX Kontor Sticker Generator',
      background_color: '#0054a4',
      icons: [
        {
          'src': './android-chrome-192x192.png',
          'sizes': '192x192',
          'type': 'image/png'
        },
        {
          'src': './android-chrome-512x512.png',
          'sizes': '512x512',
          'type': 'image/png'
        },
        {
          'src': './android-chrome-maskable-192x192.png',
          'sizes': '192x192',
          'type': 'image/png',
          'purpose': 'maskable'
        },
        {
          'src': './android-chrome-maskable-512x512.png',
          'sizes': '512x512',
          'type': 'image/png',
          'purpose': 'maskable'
        }
      ]
    }
  },
  configureWebpack: {
    plugins: [
      new FaviconsWebpackPlugin(),
      new GoogleFontsPlugin({
        fonts: [
          { family: 'Roboto', variants: ['400', '600', '700'] }
        ]
      })
    ]
  }
}
