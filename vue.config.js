const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')

module.exports = {
  pwa: {
    themeColor: '#0054a4',
    msTileColor: '#0054a4',
    manifestOptions: {
      background_color: '#0054a4'
    },
    name: 'RE/MAX Kontor Sticker Generator'
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
