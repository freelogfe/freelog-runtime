## 介绍

### 概念

在 Freelog 平台，插件是指资源类型为插件的功能性资源，一般作为主题的依赖在节点发挥作用，决定节点中内容型展品的访问、展示和交互方式。

插件可以是一个播放器、一个图床、一个目录菜单或者一个小说阅读器。

### 通俗解释

**插件是一个运行在我司平台运行时的可管控的一个完整应用或组件**

**后面出现的运行时皆指平台运行时**

### 运行原理

**插件打包后的文件是放在我司平台的，运行时通过解析 index.html 和修改 webpack_public_path 获取 js 和 css 等资源文件**

**同时从 js 中获取导出的插件生命周期来启动、加载、卸载插件**

## 框架准备

### 支持框架

**vue, react, angular 仅支持以 webpack 打包**
**jquery**

### 生命周期

**平台运行时所需要入口文件 export 的三个生命周期，用来供平台启动准备、加载、卸载插件**

```
bootstrap-->mount-->unmount

bootstrap: 加载未运行，目前不建议进行

mount: 放置插件启动代码

unmount: 将所有实例置位null，回收内存
```

### webpack 通用配置

**入口配置**

由于插件所有文件都交给平台管理，平台运行时替代了类似 nginx 的功能，插件文件访问插件文件都通过运行时，例如 index.html 中的 js，css，或 js 中的图片

运行时会替换 **\_ **webpack_public_path** \_** 让打包后的文件访问能指向正确的插件文件访问路径

```
// 建一个包含一下内容的public-path.js文件，在应用入口文件开头引入

if (window.__POWERED_BY_FREELOG__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_FREELOG__;
}
```

**打包配置文件配置**

```
// 开发模式需配置headers

devServer: {
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
        warnings: false,
        errors: true,
    },
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
},
// 将以下属性合并到webpack配置当中 其中name是package.json中的name，自行引入
output: {
    // 把子应用打包成 umd 库格式
    library: `${name}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${name}`,
},
```

### Vue2 配置示例

**入口配置**

```ts
import "./public-path";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import routes from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(ElementUI);

let router = null;
let instance = null;

function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_FREELOG__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
      true
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}
export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}

export async function mount(props) {
  console.log("[vue] props from main framework", props);
  storeTest(props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
}
```

**webpack 配置**

```
const path = require('path');
const { name } = require('./package');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7101; // dev port

module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
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
};
```

### Vue3 配置示例

**入口配置**

```ts
import "./public-path"; // 入口配置
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import routes from "./router";
import store from "./store";

let router = null;
let instance = null;

function render(props = {}) {
  const { container } = props;
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_FREELOG__ ? "/vue3" : "/"),
    routes,
  });

  instance = createApp(App);
  instance.use(router);
  instance.use(store);
  instance.mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_FREELOG__) {
  render();
}

export async function bootstrap() {
  console.log("%c ", "color: green;", "vue3.0 app bootstraped");
}
export async function mount(props) {
  storeTest(props);
  render(props);
  instance.config.globalProperties.$onGlobalStateChange =
    props.onGlobalStateChange;
  instance.config.globalProperties.$setGlobalState = props.setGlobalState;
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = "";
  instance = null;
  router = null;
}
// 插件通信功能暂未测试
function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
      true
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name,
      },
    });
}
```

**webpack 配置**

```
const path = require('path');
const { name } = require('./package');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7105;

module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  devServer: {
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
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
};

```

### React 配置示例

**入口配置**

```ts
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./public-path";
import "./utils/flexible";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export async function bootstrap() {
  console.log("[react17] react app bootstraped");
}
//     </React.StrictMode>,

export async function mount(props = {}) {
  const { container } = props;
  ReactDOM.render(<App />, document.getElementById("root"));
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
}

if (!window.__POWERED_BY_FREELOG__) {
  bootstrap().then(mount);
}
```

**webpack 配置**

```
 // 通过reject出webpack配置，修改webpack.config.js
 // output处添加三个属性，name为package.json的name
 library: `${name}-[name]`,
 libraryTarget: 'umd',
 jsonpFunction: `webpackJsonp_${name}`,

```
### jquery配置
 
```
// entry.js  在index.html中引入

const render = $ => {
  $('#purehtml-container').html('Hello, render with jQuery');
  return Promise.resolve();
};

(global => {
  global['purehtml'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      console.log('purehtml mount');
      return render($);
    },
    unmount: () => {
      console.log('purehtml unmount');
      return Promise.resolve();
    },
  };
})(window);

```

### 配置总结

**由于运行时是通过 index.html 解析获取 js，css 文件，再进行运行插件的**

**所以:**

**1.让运行时具备动态修改的**_webpack_public_path_**的能力**

**2.将 js 打包成库，让运行时能够获取到 bootstrap,mount,unmount 来启动卸载插件**


## 开发模式
 
   **需要有一个节点，节点建立请参考**

   
