const webpack = require("webpack");
const path = require("path");
// html插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const dayjs = require("dayjs");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: ["./src/main.ts"],
  target: "web",
  module: {
    rules: [
      // 处理字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
      /* {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, '../tsconfig.json'),
              // 对应文件添加个.ts或.tsx后缀
              transpileOnly: true, // 关闭类型检查，即只进行转译
            },
          },
        ],
      }, */
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../index.html"),
    }),
    // 处理静态文件夹 static 复制到打包的 static 文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: "",
        },
      ],
    }),
    // 指定环境,定义环境变量，项目中暂时未用到
    new webpack.DefinePlugin({
      "process.env": {
        BUILD_TIME: JSON.stringify(dayjs().format("YYYY/DD/MM HH:mm:ss")),
      },
    }),
    // fork-ts-checker-webpack-plugin，顾名思义就是创建一个新进程，专门来运行Typescript类型检查。这么做的原因是为了利用多核资源来提升编译的速度
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: {
      "@": resolve("src"),
    },
  },
};
