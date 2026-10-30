# 主应用框架排查参考

本页面向维护运行时主应用的开发者。主题、插件是子应用，不要为了使用 SDK 而按本页重新安装和启动 MicroApp 主应用。普通接入请用[快速接入](/runtime/quickstart)。


::: info 进阶参考的适用范围
本页从已有文档迁移，保留框架或库的具体示例。先阅读[运行时接入](/runtime/quickstart)及[兼容边界](/runtime/compatibility)。框架示例有各自版本前提，不构成平台统一 Node.js 限制；不能直接组合不同框架或不同年代的配置。
:::
常见问题

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
