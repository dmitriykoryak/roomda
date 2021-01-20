const path = require('path')

module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  pluginOptions: {
    cordovaPath: '../cordova/src-cordova',
  },
  //Не показывать рекомендации во время сборки
  configureWebpack: {
    performance: {
      hints: false,
    },
    resolve: {
      // алиас к lib
      alias: {
        '~~': path.resolve(__dirname, 'src/lib/src'),
      },
    },
  },
  pwa: {
    themeColor: '#FFEC00',
  },
  // devServer: {
  // 	host: '127.2.0.1',
  // 	port: 12080,
  // 	public: 'web.web2.d2.dev.bshost.ru',
  // 	disableHostCheck: true,
  // },
}
