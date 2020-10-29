const path = require('path')

module.exports = {
  pages: {
    index: {
      entry: 'demo/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  css: { extract: false },
  publicPath: './',
  outputDir: path.resolve(__dirname, './dist'),
  configureWebpack: {
    output: {
      filename: 'pic-viewer.min.js',
      library: 'pic-viewer',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      //libraryExport: 'default'
    }
  }
}
