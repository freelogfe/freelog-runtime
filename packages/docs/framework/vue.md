# Vue 2、3 接入指南

本篇介绍了 Vue 2 和 Vue 3 接入的具体配置和步骤。

## 1. 设置跨域支持

### **Vue 2 配置**

在 `vue.config.js` 中配置跨域头信息：

```js
module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
```

## 2. 注册卸载函数

子应用在卸载时会自动执行 `window.unmount`，在此函数中进行相关清理操作。

### **Vue 2 **

```js
// main.js
const app = new Vue(...);

// 卸载应用
window.unmount = () => {
  app.$destroy();
};
```

### **Vue 3 **

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.mount("#app");

// 卸载应用
window.unmount = () => {
  app.unmount();
};
```

## 3. 处理未知路由跳转

在子应用中捕获所有未知路由，并将其重定向到首页：

```js
{
  path: "/:pathMatch(.*)", // 捕获所有未知路径
  redirect: "/", // 重定向到首页
}
```

## 4. 入口文件改造

### **Vue 2 **

```js
// main.js
import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import { initFreelogApp } from "freelog-runtime";

let app = null;
window.mount = () => {
  initFreelogApp();
  app = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
};

window.unmount = () => {
  app.$destroy();
  app.$el.innerHTML = "";
  app = null;
};

if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
```

### **Vue 3 **

```js
// main.js
import { createApp } from "vue";
import * as VueRouter from "vue-router";
import routes from "./router";
import App from "./App.vue";
import { initFreelogApp } from "freelog-runtime";

let app = null;
let router = null;
let history = null;

window.mount = () => {
  initFreelogApp();
  history = VueRouter.createWebHistory();
  router = VueRouter.createRouter({
    history,
    routes,
  });

  app = createApp(App);
  app.use(router);
  app.mount("#app");
};

window.unmount = () => {
  app.unmount();
  history.destroy();
  app = null;
  router = null;
  history = null;
};

if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}
```

## 5. 设置 `webpack.jsonpFunction`（可选）

如果子应用资源加载混乱，可以通过配置 `jsonpFunction` 解决资源污染问题。

### **Vue 2 配置**

```js
// vue.config.js
module.exports = {
  configureWebpack: {
    output: {
      jsonpFunction: `webpackJsonp_自定义名称`,
      globalObject: "window",
    },
  },
};
```

## 6. 设置 `publicPath`

子应用出现静态资源地址 404 问题时，可以设置 `publicPath` 补全资源地址。

### **步骤 1：创建 public-path.js 文件**

```js
if (window.__MICRO_APP_ENVIRONMENT__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__;
}
```

### **步骤 2：在入口文件顶部引入**

```js
import "./public-path";
```
