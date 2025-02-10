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
