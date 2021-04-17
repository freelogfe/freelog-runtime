// @ts-nocheck
import { defineConfig } from 'umi';
const path = require("path");
const name = 'umi'
function resolve(dir: string) {
  return path.join(__dirname, dir);
}
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port: 8088,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  chainWebpack(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        "@": resolve("src"),
      },
    };
    config.output = {
      ...config.output,
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`,
    };
  },
});
