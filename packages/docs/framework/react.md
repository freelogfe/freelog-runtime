---
outline: 'deep'
---
# React 项目接入指南

本篇文档介绍 React 项目的接入方式。其他版本的接入方式类似，开发者可根据实际版本适配对应代码；

## 1. 设置跨域支持

### 1.1 如果项目使用 **create-react-app** 创建

修改 `webpack-dev-server` 配置，可以在 `config/webpackDevServer.config.js` 文件中添加跨域支持：

```js
headers: {
  'Access-Control-Allow-Origin': '*',
},
```

对于其他 React 项目，可以直接在 `webpack-dev-server` 配置中添加 `headers`。

### 1.2 如果项目使用 **vite** 创建

修改`vite.config.js` 配置

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8990,
    host: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
})

```

## 2. 入口文件改造

安装官方API库`freelog-runtime`，并进行如下改造

```js
// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { freelogApp, initFreelogApp } from "freelog-runtime";

window.mount = () => {
  initFreelogApp();
  ReactDOM.render(<App />, document.getElementById("root"));
};

window.unmount = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
};

if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
```

## 3. 注册卸载函数

通过在全局注册 `window.unmount` 函数来处理应用的卸载操作，确保资源被正常释放：

```js
// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.unmount = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
};
```

## 4. 处理未知路由跳转

### 4.1 配置路由匹配

在应用中，当路由没有匹配到路径时，我们可以跳转到首页。下面是两种常用配置方式：

**React Router v6+：**

```js
<Route path="*" element={<Navigate to="/" replace />} />
```

**React Router v5：**

```js
<Route path="*" render={() => <Redirect to="/" />} />
```

完成上述步骤后，React 项目即可在运行时正常渲染。

## 5. 可选配置

### 5.1 设置 webpack `jsonpFunction`

如果子应用在运行时资源加载出现混乱（如渲染失败），可以设置 `jsonpFunction` 避免资源污染。常见于主应用与子应用都基于 **create-react-app** 创建的情况。

**Webpack 4 配置**

```js
// webpack.config.js
module.exports = {
  output: {
    jsonpFunction: `webpackJsonp_自定义名称`,
    globalObject: 'window',
  },
};
```

**Webpack 5 配置**

```js
// webpack.config.js
module.exports = {
  output: {
    chunkLoadingGlobal: 'webpackJsonp_自定义名称',
    globalObject: 'window',
  },
};
```

### 5.2 设置 `publicPath`

当子应用出现静态资源 404（如 JS、CSS、图片）时，可以通过 `publicPath` 补全资源路径。

步骤 1: 创建 `public-path.js` 文件

```js
// public-path.js
if (window.__MICRO_APP_ENVIRONMENT__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
}
```

步骤 2: 在入口文件引入

```js
// index.js
import "./public-path";
```

## 总结

通过以上步骤，包括跨域配置、入口文件改造、注册卸载函数、路由捕获等，可将React 项目顺利接入。
