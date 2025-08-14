# 本篇以`nuxtjs 2`作为案例介绍 nuxtjs 的接入方式，其它版本 nuxtjs 接入方式会在后续补充

#### 1、在主应用中添加 ssr 配置

当子应用是 ssr 应用时，主应用需要在 micro-app 元素上添加 ssr 属性，此时 micro-app 会根据 ssr 模式加载子应用。

```html
<micro-app name="xx" url="xx" ssr></micro-app>
```

#### 2、设置跨域支持

通过自定义服务设置跨域访问。

**步骤 1、在根目录创建`server.js`**

`server.js`的内容如下：

```js
// server.js
const express = require("express");
const { Nuxt, Builder } = require("nuxt");

const app = express();

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

// Import and set Nuxt options
const config = require("./nuxt.config.js");
config.dev = process.env.NODE_ENV !== "production";

const nuxt = new Nuxt(config);

// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}

// 设置跨域支持
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Give nuxt middleware to express
app.use(nuxt.render);

// Start express server
app.listen(port, host, () => {
  console.log(`Ready on http://localhost:${port}/`);
});
```

**步骤 2、修改`package.json`中的`scripts`，如下：**

```js
"scripts": {
  "dev": "node server.js",
  "build": "nuxt build",
  "start": "cross-env NODE_ENV=production node server.js",
}
```

#### 3、通过 env 注入运行时变量`assetPrefix`

`assetPrefix`为静态资源路径前缀，开发者需要手动通过`assetPrefix`补全图片地址，避免子应用的图片在使用相对地址时加载失败的情况。

```js
// nuxt.config.js
const basePath = "基础路由"; // 默认为 '/'
// 静态资源路径前缀
const assetPrefix =
  process.env.NODE_ENV === "production"
    ? `线上域名${basePath}`
    : `http://localhost:${process.env.PORT || 3000}${basePath}`;

module.exports = {
  // 将 assetPrefix 写入环境变量，通过 process.env.assetPrefix 访问
  env: {
    assetPrefix,
  },
  // 设置基础路由
  router: {
    base: basePath,
  },
};
```

使用方式如下：

```js
<template>
  <div>
    <img :src="localImg" />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      // 补全图片地址
      localImg: process.env.assetPrefix + '/local-img.png',
    }
  }
})
</script>
```

#### 4、监听卸载

子应用被卸载时会接受到一个名为`unmount`的事件，在此可以进行卸载相关操作。

```js
// 监听卸载操作
window.addEventListener("unmount", function() {
  // 执行卸载相关操作
});
```

#### 5、切换到 iframe 沙箱

MicroApp 有两种沙箱方案：`with沙箱`和`iframe沙箱`。

默认开启 with 沙箱，如果 with 沙箱无法正常运行，可以尝试切换到 iframe 沙箱。

## 常见问题

#### 1、控制台抛出警告`[Vue warn]: Unknown custom element: <micro-app>`

**解决方式：**在`nuxt.config.js`中添加配置，设置`ignoredElements`忽略 micro-app 元素。

```js
// nuxt.config.js
module.exports = {
  vue: {
    config: {
      ignoredElements: ["micro-app"],
    },
  },
};
```

> [!TIP]
>
> nuxtjs 相关问题可以在[nuxtjs 专属讨论贴](https://github.com/micro-zoe/micro-app/issues/169)下反馈。

#### 2、无法预加载 ssr 子应用

**原因：**因为 ssr 应用每个路由地址加载的 html、js、css 等静态资源都不同，所以无法对 ssr 子应用使用预加载。
