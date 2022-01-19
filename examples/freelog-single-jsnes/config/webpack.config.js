
const webpack = require('webpack')
const path = require('path')
const CWD = process.cwd()

const appName = require(path.join(CWD, 'package.json')).name
const [ appEntry, appOutputPath ] = [ path.join(CWD, 'src/index.js'), path.join(CWD, 'dist') ]

module.exports = {
  mode: 'development',
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  entry: `${appEntry}`, 
  output: {
    path: `${appOutputPath}`,
    filename: `${appName}.js`,
    publicPath: '/',
  },
  resolve: {
    extensions: [ '.mjs', '.js', '.jsx','.json', '.wasm' ],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          }
        }],
      },
      {
        test: /\.m?jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.((c|sa|sc|le)ss)$/i,
        use: [ 
          'style-loader', 
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader', 
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'assets/fonts/[name].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'assets/images/[name].[ext]'
                }
               
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              options: {
                name: 'assets/images/[name].[ext]'
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'assets/media/[name].[ext]'
                }
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}
