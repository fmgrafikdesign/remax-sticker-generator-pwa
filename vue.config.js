const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')

module.exports = {
  pwa: {
    name: 'Sticker Generator',
    manifestPath: '/assets/manifest.json',
    themeColor: '#0054a4',
    msTileColor: '#0054a4',
    manifestOptions: {
      name: 'Sticker Generator',
      background_color: '#0054a4'
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
