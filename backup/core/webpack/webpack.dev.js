const { merge } = require("webpack-merge");
const common = require("./webpack.base.js");
const path = require("path");
const open = require("opn"); //打开浏览器
const chalk = require("chalk"); // 改变命令行中输出日志颜色插件
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
process.env.HOST = "localhost";
process.env.port = 3008;
process.env.WDS_SOCKET_HOST = process.env.HOST;
process.env.WDS_SOCKET_PATH = process.env.HOST + ":" + process.env.port;
process.env.WDS_SOCKET_PORT = process.env.port;
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;
let conlg = [];
const getIPAdress = () => {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
conlg.push(chalk.blueBright.bold('Your application is running here: ') + chalk.greenBright.bold(`https://${getIPAdress()}:${process.env.port}/`));
conlg.push(chalk.blueBright.bold('Your application is running here: ') + chalk.greenBright.bold(`https://localhost:${process.env.port}/`));

module.exports = merge(common, {
  devtool: "inline-source-map",
  cache: {
    type: "filesystem",
  },
  devServer: {
    port: process.env.port,
    contentBase: "../dist",
    host: "0.0.0.0",
    overlay: true,
    stats: "errors-only",
    https: {
      key: "C:\\Users\\45534\\.vite-plugin-mkcert\\certs\\dev.key",
      cert: "C:\\Users\\45534\\.vite-plugin-mkcert\\certs\\dev.pem"
    },
    sockHost,
    publicPath: "/",
    sockPath,
    historyApiFallback: true,
    disableHostCheck: true,
    open: false,
    sockPort,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true",
    },
    compress: true, // 为每个静态文件开启 gzip compression
    after() {
      // open("http://localhost:" + this.port)
      //   .then(() => {
      //     console.log(
      //       chalk.cyan("成功打开链接： http://localhost:" + this.port)
      //     );
      //   })
      //   .catch((err) => {
      //     console.log(chalk.red(err));
      //   });
    },
    before(app, server) {
      console.log(app, server);
    },
    // historyApiFallback: {
    //   rewrites: [{ from: /./, to: "/index.html" }],
    // },
  },
  output: {
    publicPath: "/",
    filename: "js/[name].[hash].js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          // 'postcss-loader',
          "sass-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          // 'postcss-loader',
          "less-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|cur)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: conlg
    }
  })],
  mode: "development",
});
