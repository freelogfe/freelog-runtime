function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}
const { name } = require('./package');

const path = require('path');
// process.env.NODE_ENV === 'production' ? '/' : 
const publicPath = `http://localhost:8080`;
function resolve(dir) {
  return path.join(__dirname, dir);
}
const mockBookHomeData = require('./src/mock/bookHome')
const mockBookShelfData = require('./src/mock/bookShelf')
const mockBookList = require('./src/mock/bookCategoryList')
const mockBookFlatList = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: publicPath,
  devServer: {
    disableHostCheck: true,
    before(app) {
      mock(app, '/book/home', mockBookHomeData)
      mock(app, '/book/shelf', mockBookShelfData)
      mock(app, '/book/list', mockBookList)
      mock(app, '/book/flat-list', mockBookFlatList)
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
   // 自定义webpack配置
   configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      })
      .end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      });
  },
}
