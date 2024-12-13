# Vue 2、3 接入指南

本篇介绍了 Vue 2 和 Vue 3 在接入微前端（MicroApp）中的具体配置和步骤，帮助开发者快速完成接入。


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

### **Vue 2 配置**

```js
// main.js
const app = new Vue(...);

// 卸载应用
window.unmount = () => {
  app.$destroy();
};
```

### **Vue 3 配置**

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


## 4. 开启 UMD 模式（可选）

### **UMD 模式优势**
- **默认模式**：每次渲染都会执行所有 JS 代码，保证多次渲染一致性。
- **UMD 模式**：只在首次渲染时执行 JS 代码，后续仅调用 `mount` 和 `unmount` 方法，提升性能和内存表现。

**推荐：** 如果子应用频繁渲染和卸载，建议开启 UMD 模式。

### **Vue 2 配置**

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

### **Vue 3 配置**

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


## 6. 设置 `publicPath`（可选）

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


## 7. 切换到 iframe 沙箱（可选）

MicroApp 提供两种沙箱方案：
- **with 沙箱（默认）**
- **iframe 沙箱**

如果 with 沙箱无法正常运行，可以尝试切换到 iframe 沙箱。


## 常见问题

### 1. 主应用中 `micro-app` 报错

**报错信息：**
- Vue 2: `[Vue warn]: Unknown custom element: <micro-app>`
- Vue 3: `[Vue warn]: Failed to resolve component: micro-app`

### **解决方案：**

#### **Vue 2 配置**

在 `main.js` 中设置 `ignoredElements`：

```js
import Vue from "vue";

Vue.config.ignoredElements = ["micro-app"];
```

#### **Vue 3 配置**

修改 `vue.config.js`：

```js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: (tag) => /^micro-app/.test(tag),
        };
        return options;
      });
  },
};
```

#### **Vite + Vue 3 配置**

在 `vite.config.js` 中通过插件设置：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag),
        },
      },
    }),
  ],
});
```


## 总结

以上步骤涵盖了 Vue 2 和 Vue 3 接入微前端的主要配置，包括跨域、渲染卸载、路由处理和优化性能的 UMD 模式。根据实际场景选择对应的配置，确保子应用顺利接入和运行。
