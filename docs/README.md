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

### 重要说明

**请不要在html当中直接引入js，CDN方式不支持，必须经过webpack约定配置后打包**
 
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

unmount: 将所有实例置为null，回收内存
```

### webpack 通用配置

**webpack属于唯一支持打包工具**

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

const port = 7101; // dev port

module.exports = {
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

```ts
const path = require("path");
const { name } = require("./package");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7105;

module.exports = {
  outputDir: "dist",
  assetsDir: "static",
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
      process.env.WDS_SOCKET_PATH = 'localhost:'+ process.env.PORT
      process.env.WDS_SOCKET_PORT = process.env.PORT
    }

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

### 路由支持

**仅支持 history 路由或不由运行时管的 abstract 路由，hash 路由还有问题需要改进**

### 配置总结

**由于运行时是通过 index.html 解析获取 js，css 文件，再进行运行插件的**

**所以:**

**1.让运行时具备动态修改的**_webpack_public_path_**的能力**

**2.将 js 打包成库，让运行时能够获取到 bootstrap,mount,unmount 来启动卸载插件**

## 开发

### 创建一个节点和主题

进入 console.testfreelog.com ---> 节点管理

创建节点后必须建一个主题资源并签约激活

假设节点为http://snnaenu.testfreelog.com/

用于开发的测试节点为http://t.snnaenu.testfreelog.com/

### 连接节点与插件

启动插件，例如‘http://localhost:7101’

在节点 url 的http://t.snnaenu.testfreelog.com/后面加上

```ts
"http://t.snnaenu.testfreelog.com/?dev=http://localhost:7101";
```

此时插件是作为节点主题（即入口）使用

替换指定子插件

```ts
`http://t.snnaenu.testfreelog.com/?dev=replace&${widgetId}=http://localhost:7101`;
```

### 加载子依赖插件

```ts
const subData = await window.freelogApp.getSubDep();
subData.subDeps.some((sub, index) => {
  if (index === 1) return true;
  let widgetController = window.freelogApp.mountWidget(
    sub,
    document.getElementById("freelog-single"),
    subData,
    config: {}, // 子插件配置数据，需要另外获取资源上的配置数据（待提供方法）
    seq: string, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号
  );
});
```

### 加载孙插件（完善中）

### 加载展品插件

```ts
const res = await window.freelogApp.getPresentables({
  resourceType: "widget",
  isLoadVersionProperty: 1,
});
const widgets = res.data.data.dataList;
widgets.some((widget, index) => {
  if (index === 1) return true;
  let widgetController = window.freelogApp.mountWidget(
    widget,
    document.getElementById("freelog-single")
  );
});
```


### 控制插件

```ts

 let widgetController = window.freelogApp.mountWidget

 widgetController: {
    mount
    unmount
    update
    getStatus
    loadPromise
    bootstrapPromise
    mountPromise
    unmountPromise
 }

 // 使用说明 
  unmount(resolve,reject) 卸载插件，当插件卸载成功后resolve，出现异常reject。

  mount(resolve,reject)  重新插件，当插件卸载成功后resolve，出现异常reject。

  getStatus() 返回一个字符串代表插件的状态。所有状态如下：
      NOT_BOOTSTRAPPED: 未初始化
      BOOTSTRAPPING: 初始化中
      NOT_MOUNTED: 完成初始化，未挂载
      MOUNTED: 激活状态，且已挂载至DOM
      UNMOUNTING: 卸载中
      SKIP_BECAUSE_BROKEN: 在初始化、挂载、卸载或更新时发生异常。其他插件可能会被正常使用，但当前插件会被跳过。

  loadPromise() 返回一个promise，当插件被装载(loaded)后resolve。

  bootstrapPromise() 返回一个promise，当插件初始化后resolve。

  mountPromise() 返回一个promise，当插件加载后resolve。通常用于检测插件生成的DOM是否已经挂载。

  unmountPromise() 返回一个promise，当插件卸载后resolve。

```

### 配置插件配置数据

```ts

  // 通过资源或展品的meta属性配置指定key作为配置数据, 目前运行时占用的key如下

  hbfOnlyToTheme: true // 历史记录整体前进后退是否只给主题权限
  historyFB: true, // 历史记录整体前进后退是否有权限

```

### 获取插件自身配置数据

```ts
const widgetConfig = await window.freelogApp.getSelfConfig();
```

### 插件通信方式一：全局通信
```ts

**在入口处通过props修改与监听全局数据**

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
```
### 插件之间通信方式二：配置数据中传递config
```ts

**在config中传递数据或方法提供给子插件访问，同时子插件可以通过调用方法传递数据给父插件**

  window.freelogApp.mountWidget(
    sub,
    document.getElementById("freelog-single"),
    subData,
    config: {}, // 子插件配置数据，需要另外获取资源上的配置数据（待提供方法）
    seq: string, // 如果要用多个同样的子插件需要传递序号，可以考虑与其余节点插件避免相同的序号
  );
 
```
### 插件之间通信方式三：插件对外发布api
```ts

// 后期实现通过
// freelogApp.registerApi(eventName,callBack,auth)
// eventName: '事件名称：插件唯一识别+自定义api名称'
// callBack: 当其余插件freelogApp.dispatch这个事件时，调用此函数（此函数相当于是插件对外发布的api）
// auth: 权限级别，例如是否只允许父插件调用
 
```

### 获取展品

**分页列表**

```ts
   const res = await window.freelogApp.getPresentablesPaging(query)
   query:{
    skip: "string", // 从第几个开始
    limit: "string", // 取多少个
    resourceType: "string", // 资源类型
    omitResourceType: "string", // 过滤资源类型
    tags: "string", // 展品和资源标签，多个使用","隔开
    projection: "string",
    keywords: "string",
    isLoadVersionProperty: "string", // 是否加载版本
  }
```

**查找展品**

```ts
 window.freelogApp.getPresentablesSearch(query).then((res)=>{

 })
  query:{
    presentableIds: "string", // 展品ids 多个使用","隔开
    resourceIds: "string", // 资源ids
    resourceNames: "string", // 资源名称s
  }
```

### 获取展品详情

```ts
 const res = await  window.freelogApp.getPresentableDetailById(exhibitId, query)

 **参数说明**
  exhibitId: 展品id，
  query:{
      projection:  "string", // 需要指定哪些字段
      isLoadVersionProperty: 0 | 1, // 是否需要展品版本属性
      isLoadCustomPropertyDescriptors: 0 | 1, // 是否加载自定义属性信息
      isLoadResourceDetailInfo: 0 | 1, // 是否加载资源详细信息(额外查询了资源的封面,标签,简介等)
      isLoadResourceVersionInfo: 0 | 1, // 	是否加载资源版本信息(额外查询了资源版本的描述,创建日期,更新日期等)
  }
```

### 获取展品资源

```ts
  const res = await window.freelogApp.getFileStreamById(
    exhibitId: string,  // 展品id
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
  )
```

### 获取展品子依赖

```ts
  const res = await  window.freelogApp.getSubFileStreamById(
    exhibitId: string | number,
    parentNid: string,
    subResourceIdOrName: string,
    returnUrl?: boolean, // 是否只返回url， 例如img标签图片只需要url
    config?: any // axios的config 目前仅支持"onUploadProgress", "onDownloadProgress", "responseType"
  )
```

### 查找展品签约数量

**同一个用户的多次签约只计算一次**

```ts
  const res = await window.freelogApp.getPresentableSignCount(
    presentableIds: string
  )

  **参数说明**

    presentableIds: 用英文逗号隔开的展品id

```

### 批量查询展品授权

```ts
  const res = await window.freelogApp.getPresentablesAuth(
    presentableIds: string
  )

  **参数说明**

    presentableIds:  用英文逗号隔开的展品id

```


### 授权处理

**单个呼出授权**

```ts
// 根据展品id获取展品资源
let ch = await window.freelogApp.getFileStreamById(
  chapters[index].exhibitId
);
/**
 *  未授权返回值
 * {
 *   data: {
 *     errCode: 3,
 *     presentableName,
 *     exhibitId,
 *     errorMsg: response.data.data.errorMsg,
 *   },
 * }
 */
if (ch.data.errCode) {
  // 提交给运行时处理
  /**
   * addAuth 参数
      exhibitId: string,
      resolve: Function,  // 授权成功回调
      reject: Function,  // 授权失败回调
      options?: {
        immediate: boolean  // 是否立即弹出授权窗口
      }  
  */
  ch = await new Promise((resolve, rej) => {
    window.freelogApp.addAuth(
      ch.data.exhibitId,
      async () => {
        const res = await window.freelogApp.getFileStreamById(
          chapters[index].exhibitId
        );
        resolve(res);
      },
      () => {},
      { immediate: true }
    );
  });
}
```

**呼出授权**

```ts
// 当addAuth多个未授权展品且没有立刻呼出（或者存在未授权展品且已经addAuth 但用户关闭了，插件想要用户签约时）可以通过callAuth()唤出
window.freelogApp.callAuth();
```

### 唤起登录
```ts

 window.freelogApp.callLogin()
```
### 唤起退出登录
```ts

 window.freelogApp.callLoginOut()
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

**5. vue-cli3 项目可以将 css 打包到 js 里面，不单独生成文件(不推荐，仅适用于 css 较少的项目)**

配置参考 [vue-cli3 官网](https://cli.vuejs.org/zh/config/#css-extract):

```js
module.exports = {
  css: {
    extract: false,
  },
};
```

### 插件自身重载

```js
// 目前重载后挂载在window的数据没变，后期增加参数可选是否保留，以及返回重载失败可由插件决定是否刷新页面、同时需要主题授权
window.location.reload();
```

### 插件通信

**完善中**

### 获取当前登录用户信息

```js
const res = await window.freelogApp.getCurrentUser();
```

### 监听用户登录事件

```js
// callback: 登录成功的回调，登录失败不会回调
window.freelogApp.onLogin(callback);
```

### 用户数据

```js
// 开发者模式需要注意在入口文件加载页面加上主题或插件本身的资源名称,例如：
window.FREELOG_RESOURCENAME = Freelog / dev - docs;

// 更新用户数据   data 为任意对象，
const res = await window.freelogApp.setUserData(key, data);
// 获取用户数据
const res = await window.freelogApp.getUserData(key);
```

## 打包上传

**正常 build 后，将打包后的所有文件压缩为一个 zip 文件（无根目录），作为主题 theme 或插件 widget 类型上传为资源**

<!-- ## 模板下载 -->

<!-- [vue模板](http://freelog-docs.testfreelog.com/$freelog-60a614de12ac83003f09d975=/dev/guide)  -->

## 移动端适配

**目前仅支持最新的问题最少的最好的 viewport 兼容方案**

**推荐使用 postcss-px-to-viewport 插件, 各框架具体使用方法请百度**