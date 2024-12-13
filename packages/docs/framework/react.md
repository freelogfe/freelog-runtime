# React 项目接入指南

本篇文档以 **React 16** 和 **React 17** 为例，介绍 React 项目的接入方式。其他版本的接入方式类似，开发者可根据实际版本适配对应代码，例如在不支持 Hooks 的版本中，将 `useEffect` 替换为 `componentDidMount`。


## 1. 设置跨域支持

### 修改 `webpack-dev-server` 配置

如果项目使用 **create-react-app** 创建，可以在 `config/webpackDevServer.config.js` 文件中添加跨域支持：

```js
headers: {
  'Access-Control-Allow-Origin': '*',
},
```

对于其他 React 项目，可以直接在 `webpack-dev-server` 配置中添加 `headers`。


## 2. 注册卸载函数

### 在子应用中清理资源

通过在全局注册 `window.unmount` 函数来处理子应用的卸载操作，确保资源被正常释放：

```js
// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.unmount = () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
};
```


## 3. 处理未知路由跳转

### 配置路由匹配

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


## 可选配置

### 1. 开启 UMD 模式，优化性能与内存

运行时支持两种渲染模式：默认模式和 UMD 模式。

- **默认模式：** 每次渲染都会执行所有 JS，确保渲染结果一致。
- **UMD 模式：** 子应用只在初次渲染时执行 JS，后续渲染仅执行 `mount` 和 `unmount` 方法，提升性能与内存表现。

**示例代码：**
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


### 2. 设置 webpack `jsonpFunction`

如果子应用在运行时资源加载出现混乱（如渲染失败），可以设置 `jsonpFunction` 避免资源污染。常见于主应用与子应用都基于 **create-react-app** 创建的情况。

#### Webpack 4 配置
```js
// webpack.config.js
module.exports = {
  output: {
    jsonpFunction: `webpackJsonp_自定义名称`,
    globalObject: 'window',
  },
};
```

#### Webpack 5 配置
```js
// webpack.config.js
module.exports = {
  output: {
    chunkLoadingGlobal: 'webpackJsonp_自定义名称',
    globalObject: 'window',
  },
};
```


### 3. 设置 `publicPath`

当子应用出现静态资源 404（如 JS、CSS、图片）时，可以通过 `publicPath` 补全资源路径。

#### 步骤 1: 创建 `public-path.js` 文件
```js
// public-path.js
if (window.__MICRO_APP_ENVIRONMENT__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
}
```

#### 步骤 2: 在入口文件引入
```js
// index.js
import "./public-path";
```


### 4. 切换到 iframe 沙箱

微前端框架支持两种沙箱模式：
- **with 沙箱**（默认）
- **iframe 沙箱**

如果子应用在 with 沙箱模式下无法正常运行，可以手动切换到 iframe 沙箱：

```js
await freelogApp.mountWidget({
  widget: widget,
  container: document.getElementById("freelog-exhibit"),
  property: property, // 展品或作品的属性
  renderWidgetOptions: {
    iframe: true, // 启用 iframe 沙箱
  },
});
```


## 总结

通过以上步骤，包括跨域配置、卸载函数、UMD 模式、`publicPath` 设置等，React 项目能够顺利接入微前端框架并在多环境中稳定运行。根据项目需求选择合适的配置方案，确保资源加载和性能表现的最优化。
