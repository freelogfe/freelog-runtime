const { defineConfig } = require('@vue/cli-service')

const path = require('path');
const { name } = require('./package');
const webpackPlugin = require('webpack-mkcert')

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 8001;
module.exports = defineConfig(async () => {
  const https = await webpackPlugin.default({
    force: true,
    source: 'coding',
    hosts: ['localhost', '127.0.0.1']
  })
  console.log(https)
  return {
    transpileDependencies: true,
    outputDir: 'dist',
    assetsDir: 'static',
    filenameHashing: true,
    devServer: {
      https: {
        // ca: './path/to/server.pem',
        // pfx: './path/to/server.pfx',
        // key: './path/to/server.key',
        // cert: './path/to/server.crt',
        // passphrase: 'webpack-dev-server',
        // requestCert: true,
        ...https
      },
      hot: true,
      port,
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
        chunkLoadingGlobal: `webpackJsonp_${name}`,
      },
    },
  }
})
// module.exports = {
//   outputDir: 'dist',
//   assetsDir: 'static',
//   filenameHashing: true,
//   devServer: {
//     hot: true,
//     port,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//     ...https
//   },
//   // 自定义webpack配置
//   configureWebpack: {
//     resolve: {
//       alias: {
//         '@': resolve('src'),
//       },
//     },
//     output: {
//       // 把子应用打包成 umd 库格式
//       library: `${name}-[name]`,
//       libraryTarget: 'umd',
//       chunkLoadingGlobal: `webpackJsonp_${name}`,
//     },
//   },
// };
