# 指南

## 介绍

### 概念

在 Freelog 平台，插件是指作品类型为插件的功能性作品，一般作为主题的依赖在节点发挥作用，决定节点中内容型展品的访问、展示和交互方式。

插件可以是一个播放器、一个图床、一个目录菜单或者一个小说阅读器。

### 通俗解释

**插件是一个运行在我司平台运行时的可管控的一个完整应用或组件**

**后面出现的运行时皆指平台运行时**

### 运行原理

**插件打包后的文件是放在我司平台的，运行时通过解析 index.html 和修改 webpack_public_path 获取 js 和 css 等作品文件**

**同时从 js 中获取导出的插件生命周期来启动、加载、卸载插件**

### 重要说明

**请不要在 html 当中直接引入 js，CDN 方式不支持，必须经过 webpack 约定配置后打包**

## 框架准备

### 支持框架

**vue、react（两个框架都仅支持以 webpack 打包）,**
**jquery**

### 生命周期

**平台运行时所需要入口文件 export 的三个生命周期，用来供平台启动准备、加载、卸载插件**

```
bootstrap-->mount-->unmount

bootstrap: 加载未运行，目前不建议进行

mount: 放置插件启动代码

unmount: 将所有实例置为null，回收内存
```

### webpack 通用配置

**webpack 属于唯一支持打包工具**

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

```ts
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
    // webpack5使用chunkLoadingGlobal: `webpackJsonp${name}`
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
    base: "/",
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

```ts
const path = require("path");
const { name } = require("./package");

function resolve(dir) {
  return path.join(__dirname, dir);
}
const webpackPlugin = require("webpack-mkcert");

const port = 7101; // dev port

const { defineConfig } = require("@vue/cli-service");

// https 插件 需要安装
const webpackPlugin = require("webpack-mkcert");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7105;
module.exports = defineConfig(async () => {
  const https = await webpackPlugin.default({
    force: true,
    source: "coding",
    hosts: ["localhost", "127.0.0.1"],
  });
  return {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    outputDir: "dist",
    assetsDir: "static",
    filenameHashing: true,
    https,
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
        "Access-Control-Allow-Origin": "*",
      },
    },
    // 自定义webpack配置
    configureWebpack: {
      resolve: {
        alias: {
          "@": resolve("src"),
        },
      },
      output: {
        // 把子应用打包成 umd 库格式
        library: `${name}-[name]`,
        libraryTarget: "umd",
        jsonpFunction: `webpackJsonp_${name}`,
        // webpack5使用chunkLoadingGlobal: `webpackJsonp${name}`
      },
    },
  };
});
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
    history: createWebHistory("/"),
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
// 插件通信功能
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

```ts
const path = require("path");
const { name } = require("./package");
const { defineConfig } = require("@vue/cli-service");

// https 插件 需要安装
const webpackPlugin = require("webpack-mkcert");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7105;
module.exports = defineConfig(async () => {
  const https = await webpackPlugin.default({
    force: true,
    source: "coding",
    hosts: ["localhost", "127.0.0.1"],
  });
  console.log(https);
  return {
    transpileDependencies: true,
    outputDir: "dist",
    assetsDir: "static",
    filenameHashing: true,
    devServer: {
      https: {
        // ca: './path/to/server.pem',
        // pfx: './path/to/server.pfx',
        // key: './path/to/server.key',
        // cert: './path/to/server.crt',
        // passphrase: 'webpack-dev-server',
        // requestCert: true,
        ...https,
      },
      hot: true,
      port,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    // 自定义webpack配置
    configureWebpack: {
      resolve: {
        alias: {
          "@": resolve("src"),
        },
      },
      output: {
        // 把子应用打包成 umd 库格式
        library: `${name}-[name]`,
        libraryTarget: "umd",
        chunkLoadingGlobal: `webpackJsonp_${name}`,
      },
    },
  };
});
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

**create react app 创建项目的配置**

```ts
 **通过npm run eject, 释放出webpack配置**

  ***webpack 配置***
  /**
    *
    * 修改webpack.config.js
    * output处添加三个属性，name为package.json的name
    */
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
      // webpack5使用chunkLoadingGlobal: `webpackJsonp${name}`
  /**
    * 修改webpackDevServer.config.js
    * 添加跨域headers
    */
    port: process.env.PORT,
    headers: {
        'Access-Control-Allow-Origin': '*',
      },

  ***热更新配置***
  /**
    * 修改env.js
    * 添加websocket所需的
    */
     process.env.PORT = '7102' // 端口自行定
    if (NODE_ENV === 'development') {
      process.env.WDS_SOCKET_HOST = 'localhost'
      process.env.WDS_SOCKET_PATH = 'localhost:'+ process.env.PORT // webpack5设置为空 ''
      process.env.WDS_SOCKET_PORT = process.env.PORT
    }
  ***热更白屏问题处理***
  // 把html中根节点的同级iframe隐藏
  /**  #root~iframe{
        display: none !important;
    }
  */
```

### jquery 配置

```ts
// entry.js  在index.html中引入
const render = ($) => {
  $("#purehtml-container").html("Hello, render with jQuery");
  return Promise.resolve();
};

((global) => {
  global["purehtml"] = {
    bootstrap: () => {
      console.log("purehtml bootstrap");
      return Promise.resolve();
    },
    mount: () => {
      console.log("purehtml mount");
      return render($);
    },
    unmount: () => {
      console.log("purehtml unmount");
      return Promise.resolve();
    },
  };
})(window);
```

### 静态文件处理

**打包之后 css 中的字体文件和图片加载 404**

原因是 freelog 将外链样式改成了内联样式，但是字体文件和背景图片的加载路径是相对路径。

而 css 文件一旦打包完成，就无法通过动态修改 publicPath 来修正其中的字体文件和背景图片的路径。

解决方案：

1. 大图片与大字体处理方式：

   大图片：放在不需要 webpack 打包的 public 目录下，通过 **window.freelogApp.getStaticPath(path)** 获取正确地址，
   其中 path 为以/开头的正常开发时的路径。

   大字体：（暂未实现）如果路径写在 css 中则无需刻意放在 public 目录下，如果使用 js 去赋值，则同图片一样处理。

2. 小文件处理方式：借助 webpack 的 url-loader 将字体文件和图片打包成 base64（适用于字体文件和图片体积小的项目）

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: "url-loader",
            options: {},
          },
        ],
      },
    ],
  },
};
```

**vue-cli3 项目写法：**

```js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("fonts")
      .use("url-loader")
      .loader("url-loader")
      .options({})
      .end();
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .options({})
      .end();
  },
};
```

**vue-cli3 项目可以将 css 打包到 js 里面，不单独生成文件(不推荐，仅适用于 css 较少的项目)**

配置参考 [vue-cli3 官网](https://cli.vuejs.org/zh/config/#css-extract):

```js
module.exports = {
  css: {
    extract: false,
  },
};
```

### 路由支持

**仅支持 history 路由或不由运行时管的 abstract 路由，hash 路由还有问题需要改进**

### 配置总结

**由于运行时是通过 index.html 解析获取 js，css 文件，再进行运行插件的**

**所以:**

**1.让运行时具备动态修改的**_webpack_public_path_**的能力**

**2.将 js 打包成库，让运行时能够获取到 bootstrap,mount,unmount 来启动卸载插件**

## 开发

### https 证书准备（必须）

**由于浏览器安全限制，本地开发需要本地以 https 启动**

参考 webpack-mkcert 工具

[https://www.npmjs.com/package/webpack-mkcert](https://www.npmjs.com/package/webpack-mkcert)

### chrome 无法访问 localhost 问题

地址栏输入：chrome://flags/#block-insecure-private-network-requests

把 Block insecure private network requests. 设置为 disabled

如图
![chrome](/chrome.png)

### 创建一个节点和主题

进入 console.freelog.com ---> 节点管理

创建节点后必须建一个主题作品并签约激活

假设节点为https://snnaenu.freelog.com/

用于开发的测试节点为https://t.snnaenu.freelog.com/

### 连接节点与插件

启动插件，例如‘https://localhost:7101’

在节点 url 的https://t.snnaenu.freelog.com/后面加上

```ts
"https://t.snnaenu.freelog.com/?dev=https://localhost:7101";
```

此时插件是作为节点主题（即入口）使用

### 获取节点信息

```ts
// 目前没有权限控制，主题和插件都可以获取到，后期整体考虑权限时会限制插件使用
// 如果使用到了节点信息，插件开发者应当在使用说明里明确使用到了节点信息以及无法获取到的影响
const nodeInfo = window.freelogApp.nodeInfo;
```

### 加载自身的子依赖插件

```ts
const subData = await window.freelogApp.getSubDep();
// 示范代码，这里只加载一个
subData.subDep.some((sub, index) => {
  if (index === 1) return true;
  let widgetController = await window.freelogApp.mountWidget({
    widget: sub, // 必传，子插件数据
    container: document.getElementById("freelog-single"), // 必传，自定义一个让插件挂载的div容器
    topExhibitData: subData, // 必传，最外层展品数据（子孙插件都需要用）
    config: {}, // 子插件配置数据，需要另外获取作品上的配置数据
    seq: string, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号, 注意用户数据是根据插件id+序号保存的。
    widget_entry: string, // 本地url，dev模式下，可以使用本地url调试子插件
  });
});
```

### 加载展品插件

```ts
const res = await window.freelogApp.getExhibitListById({
  articleResourceTypes: "widget",
  isLoadVersionProperty: 1,
});
const widgets = res.data.data.dataList;
// 示范代码，这里只加载一个
widgets.some((widget, index) => {
  if (index === 1) return true;
  let widgetController = await window.freelogApp.mountWidget({
    widget: widget,
    container: document.getElementById("freelog-single"), // 给每一个提供不同的容器
    topExhibitData: null,
    config: {},
    seq: string,
    widget_entry: string,
  });
});
```

### 单独调试某个插件

当需要跳过主题直接调试正在运行的子插件或展品插件

定义： `${url}?dev=replace&${widgetId}=${local_entry}`

url: 节点地址

widgetId: 插件 ID 这里用的是插件的作品ID: articleId
          获取方式：插件内可以通过freelogApp.getSelfId()获取，但先有鸡才能有蛋，后续要在作品管理页面以及测试节点提供获取途径。
                   目前开发者可以F12去找一下。

local_entry: 本地地址

举例：

```ts
https://nes-common.freelog.com/?dev=replace&62270c5cf670b2002e800193=https://localhost:7107/
```

### 控制插件

```ts
let widgetController = await window.freelogApp.mountWidget

widgetController: {
  mount
  unmount
  update
  getStatus
  loadPromise
  bootstrapPromise
  mountPromise
  unmountPromise
  getApi
}

** 使用说明 **

unmount( keeplocation: Boolean) 卸载插件，返回一个promise。 keeplocation： 布尔值 是否保持url（即路由），false不保持时该插件对应的url清空

mount()  可用于卸载后重新加载插件，返回一个promise

getStatus() 返回一个字符串代表插件的状态。所有状态如下：
    NOT_BOOTSTRAPPED: 未初始化
    BOOTSTRAPPING: 初始化中
    NOT_MOUNTED: 完成初始化，未挂载
    MOUNTED: 激活状态，且已挂载至DOM
    UNMOUNTING: 卸载中
    SKIP_BECAUSE_BROKEN: 在初始化、挂载、卸载或更新时发生异常。其他插件可能会被正常使用，但当前插件会被跳过。

loadPromise  一个promise，当插件被装载(loaded)后resolve。

bootstrapPromise 一个promise，当插件初始化后resolve。

mountPromise  一个promise，当插件加载后resolve。通常用于检测插件生成的DOM是否已经挂载。

unmountPromise 一个promise，当插件卸载后resolve。

getApi()   在子插件加载完成后 使用getApi()方法获取子插件的对外api， 由于子插件可能自己重载、或操作子插件重载，每次调用都需要使用方法获取，不能直接获取，
```

### 配置插件配置数据

```ts
// 通过作品或展品的meta属性配置指定key作为配置数据, 目前运行时占用的key如下（皆为默认值）
hbfOnlyToTheme: true // 历史记录整体前进后退是否只给主题权限
historyFB: true, // 历史记录整体前进后退是否有权限
```

### 获取插件自身配置数据

```ts
// 父插件的传递过来的config数据也会在这里
const widgetConfig = window.freelogApp.getSelfConfig();
```

### 插件通信方式一：全局通信

```ts
**在入口处通过props修改与监听全局数据**
const freelogApp = window.freelogApp
// 主题独有方法，但主题可以传递给插件使用
// 初始化全局数据，只能修改不能添加, 例如可以修改a:{} 为对象，但不能添加同级的b、c、d
freelogApp.initGlobalState({ a: 1 })

// 通过mount函数传递进来props 访问监听与设置的方法
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
export async function mount(props) {
  console.log("[vue] props from main framework", props);
  storeTest(props);
  render(props);
}

// 函数说明
props.setGlobalState(obj: 自定义对象)：
props.onGlobalStateChange((state: 当前状态, prevState: 前数据) => void, fireImmediately:是否立即执行)
```

### 插件之间通信方式二：配置数据中传递 config

```ts
**在config中传递数据或方法提供给子插件访问，同时子插件可以通过调用方法传递数据给父插件**
await window.freelogApp.mountWidget(
  sub,
  document.getElementById("freelog-single"),
  subData,
  config: {}, // 子插件配置数据，这里会和子插件自身数据合并，必须为对象
  seq: string, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号
);
```

### 插件之间通信方式三：插件对外发布 api

```ts
// 子插件在mount时使用props.resisterApi注册api
export async function mount(props = {}) {
  const { container } = props;
  props.registerApi({
    // 这个对象会给到父插件
    show: () => {},
  });
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  );
}
// 在子插件加载完成后，父插件可以使用app.getApi() 获取子插件的api
app.mountPromise.then(() => {
  app.getApi().show();
});
```

### 插件自身重载

```js
// 目前重载后挂载在window的数据没变，后期增加参数可选是否保留，以及返回重载失败可由插件决定是否刷新页面、但需要主题授权
window.location.reload();
```

### 获取当前完整 URL

```ts
window.location.currentURL;
```

### 移动端适配

**除媒体查询外，支持最新的问题最少的最好的 viewport 兼容方案**

**推荐使用 postcss-px-to-viewport 插件, 各框架具体使用方法请百度**

```ts
**viewport修改用法**
window.freelogApp.setViewport(keys: any)
keys = {
  width: "device-width", // immutable
  height: "device-height", // not supported in browser
  "initial-scale": 1, // 0.0-10.0   available for theme
  "maximum-scale": 1, // 0.0-10.0   available for theme
  "minimum-scale": 1, // 0.0-10.0   available for theme
  "user-scalable": "no", // available for theme
  "viewport-fit": "auto", // not supported in browser
}
```

## 展品相关

### 获取展品

**分页列表**

```ts
const res = await window.freelogApp.getExhibitListByPaging({
  skip: 0,
  limit: 20,
});
```

[查看 getExhibitListByPaging 详情](./api/#getexhibitlistbypaging)

**查找展品**

```ts
const res = window.freelogApp.getExhibitListById(query)

**参数说明**
  query:{
    exhibitIds: string,  展品ids 多个使用","隔开
    isLoadVersionProperty: 0 | 1, 可选，是否加载版本信息,默认0
  }
```

[查看 getExhibitListById 详情](/api/#getexhibitlistbyid)

### 获取单个展品详情

```ts
const res = await  window.freelogApp.getExhibitInfo(exhibitId, query)

**参数说明**
  exhibitId: 展品id，
  query:{
      isLoadVersionProperty: 0 | 1, // 是否需要展品版本属性
  }
```

[查看 getExhibitInfo 详情](/api/#getexhibitinfo)

### 获取展品作品

```ts
const res = await window.freelogApp.getExhibitFileStream(
  exhibitId,
  options
)

**参数说明**
  exhibitId: // 展品id，
  options: {
    returnUrl?: boolean; // 是否只返回url， 例如img标签图片只需要url
    config?: any; // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
    subFilePath?: string; // 漫画中的图片等子文件的路径
  },
```

### 展品子依赖列表

**在 获取展品 与 获取单个展品详情 接口返回数据中**

```ts
  **如下所示，数组versionInfo.dependencyTree就是该展品的所有子孙依赖列表**
  **第一个为自身，通过自身的nid去找出parentNid为该nid的依赖即为直接子依赖**
  {
	"ret": 0,
	"errCode": 0,
	"errcode": 0,
	"msg": "success",
	"data": {
		"exhibitId": "61b99394c9dacc002e9f5821",
    ...
		"versionInfo": {
			"exhibitId": "61b99394c9dacc002e9f5821",
			"exhibitProperty": {
				"fileSize": 6234,
				"mime": "text/markdown"
			},
			"dependencyTree": [{
				"nid": "61b99394c9da",
				"articleId": "61b993157841ed002e5c96ca",
				"articleName": "ZhuC/测试md",
				"articleType": 1,
				"version": "0.1.1",
				"versionRange": "0.1.1",
				"resourceType": ["markdown"],
				"versionId": "0d786f5b273bc549454b55ea649569a3",
				"deep": 1,
				"parentNid": ""
			}, {
				"nid": "9091f75e23fb",
				"articleId": "61b9a82f2ae3ac002eb7993a",
				"articleName": "ZhuC/元宇宙",
				"articleType": 1,
				"version": "0.1.0",
				"versionRange": "^0.1.0",
				"resourceType": ["video"],
				"versionId": "85fa350f4d003d0adea1fffc2852891d",
				"deep": 2,
				"parentNid": "61b99394c9da"
			}]
		}
	}
}
```

### 获取子依赖作品文件

```ts
const res = await window.freelogApp.getExhibitDepFileStream(
  exhibitId: string ,
  parentNid: string,
  subArticleIdOrName: string,
  returnUrl?: boolean,
  config?: any
)

**参数说明**
  exhibitId: string , // 自身展品id
  parentNid: string,    // 自身链路id
  subArticleIdOrName: string, // 子依赖作品id或名称
  returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
  config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
```

### 查找展品签约数量

**同一个用户的多次签约只计算一次**

```ts
const res = await window.freelogApp.getExhibitSignCount(
  exhibitIds: string
)

**参数说明**
  exhibitIds: 用英文逗号隔开的展品id
```

### 批量查询展品授权

```ts
const res = await window.freelogApp.getExhibitAuthStatus(
  exhibitIds: string
)

**参数说明**
  exhibitIds:  用英文逗号隔开的展品id
```

### 批量查询展品是否可用（即能否提供给用户签约）

```ts
const res = await window.freelogApp.getExhibitAvailalbe(
  exhibitIds: string
)

**参数说明**
  exhibitIds:  用英文逗号隔开的展品id
```

[查看 getExhibitInfo 详情](/api/#getexhibitavailalbe)

### 授权错误返回值

```ts
  **存在但未授权**
  {
    authErrorType: 1,// 存在但未授权
    authCode: resData.authCode,
    exhibitName,
    exhibitId,
    articleNid,
    resourceType,
    subDep,
    versionInfo: {exhibitProperty},
    ...resData, // 原始数据
  }
  **不存在**
  {
    authErrorType: 2,// 不存在
    authCode: resData.authCode,
    exhibitName,
    exhibitId,
    articleNid,
    resourceType,
    subDep,
    versionInfo: {exhibitProperty},
    ...resData, // 原始数据
  }
```

### 授权处理

**单个呼出授权**

```ts
// 根据展品id获取展品作品
let ch = await window.freelogApp.getExhibitFileStream(
  chapters[index].exhibitId
);

if (ch.authErrorType) {
  // 提交给运行时处理
  /**
   * addAuth 参数
      exhibitId: string,
      options?: {
        immediate: boolean  // 是否立即弹出授权窗口
      }
  */
  const data = await new Promise((resolve, rej) => {
    const res = await window.freelogApp.addAuth(ch.data.exhibitId, {
      immediate: true,
    });

     **res返回值说明**
   {status: SUCCESS, data}
   status 枚举判断：
     status === window.freelogApp.resultType.SUCCESS;  // 成功
     status === window.freelogApp.resultType.FAILED;   // 失败
     status === window.freelogApp.resultType.USER_CANCEL; // 用户取消
     status === window.freelogApp.resultType.DATA_ERROR;  // 数据错误
     status === = window.freelogApp.resultType.OFFLINE; // 展品已经下线
   data: 如果是DATA_ERROR或OFFLINE，会返回错误数据或展品数据
  });
}
```

**呼出授权**

```ts
// 当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出
window.freelogApp.callAuth();
```

## 用户相关

### 唤起登录

```ts
// callback: 登录成功的回调，登录失败不会回调,这里需要考虑一下，
window.freelogApp.callLogin(callback);
```

### 唤起退出登录

```ts
window.freelogApp.callLoginOut();
```

### 获取当前登录用户信息

```js
const res = await window.freelogApp.getCurrentUser();
```

### 监听用户登录事件

```js
// callback: 登录成功的回调，登录失败不会回调
window.freelogApp.onLogin(callback);
```

### 监听用户在其余页面切换账号或登录事件

```js
// callback: 再次进入页面发现账号变化后会回调所有函数
window.freelogApp.onUserChange(callback);
```

### 用户数据

```js
// 开发者模式需要注意在入口文件加载页面加上主题或插件本身的作品名称,例如：
window.FREELOG_RESOURCENAME = Freelog / dev - docs;

// 更新用户数据   data 为任意对象，
const res = await window.freelogApp.setUserData(key, data);
// 获取用户数据
const res = await window.freelogApp.getUserData(key);
```

## 打包上传

**正常 build 后，将打包后的所有文件压缩为一个 zip 文件（无根目录），作为主题 theme 或插件 widget 类型上传为作品**

<!-- ## 模板下载 -->

<!-- [vue模板](https://freelog-docs.freelog.com/$freelog-60a614de12ac83003f09d975=/dev/guide)  -->

<!-- ## 移动端真机调试 vconsole

**将 dev 改成 devconsole**

此时无论移动端还是电脑端都会出现 vconsole

https://snnaenu.freelog.com/?devconsole=https://localhost:8081 -->
