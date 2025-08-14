# nextjs

#### 1、在主应用中添加 ssr 配置

当子应用是 ssr 应用时，主应用需要在 micro-app 元素上添加 ssr 属性，此时 micro-app 会根据 ssr 模式加载子应用。

```html
<micro-app name="xx" url="xx" ssr></micro-app>
```

#### 2、设置跨域支持

通过自定义服务设置跨域访问，详情参考 [custom-server](https://nextjs.org/docs/advanced-features/custom-server)

**步骤 1、在根目录创建`server.js`**

`server.js`的内容如下：

```js
// server.js
const express = require("express");
const next = require("next");
const config = require("./next.config");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 设置跨域支持
  server.all("*", (req, res) => {
    res.setHeader("access-control-allow-origin", "*");
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}/`);
  });
});
```

**步骤 2、修改`package.json`中的`scripts`，如下：**

```js
"scripts": {
  "dev": "node server.js",
  "build": "next build",
  "start": "cross-env NODE_ENV=production node server.js"
}
```

#### 3、设置`assetPrefix` 和 `publicRuntimeConfig`

在`next.config.js`中设置`assetPrefix`，为静态资源添加路径前缀，避免子应用的静态资源使用相对地址时加载失败的情况。

```js
// next.config.js
const basePath = "基础路由"; // 默认为 '/'
// 静态资源路径前缀
const assetPrefix =
  process.env.NODE_ENV === "production"
    ? `线上域名${basePath}`
    : `http://localhost:${process.env.PORT || 3000}${basePath}`;

module.exports = {
  basePath,
  assetPrefix,
  // 添加 assetPrefix 地址到 publicRuntimeConfig
  publicRuntimeConfig: {
    assetPrefix,
  },
};
```

`assetPrefix`只对 js、css 等静态资源生效，对本地图片无效。

为此我们将`assetPrefix`作为参数传入`publicRuntimeConfig`，开发者需要手动通过`publicRuntimeConfig`补全图片地址。

方式如下：

```js
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const Page = () => {
  return (
    <div>
      <img src={`${publicRuntimeConfig.assetPrefix}/local-img.png`} />
    </div>
  );
};

export default Page;
```

#### 4、监听卸载

子应用被卸载时会接受到一个名为`unmount`的事件，在此可以进行卸载相关操作。

```js
// 监听卸载操作
window.addEventListener("unmount", function() {
  // 执行卸载相关操作
});
```

> [!NOTE]
> nextjs 默认支持 css module 功能，如果你使用了此功能，建议关闭样式隔离以提升性能：`<micro-app name='xx' url='xx' disableScopecss></micro-app>`

#### 5、切换到 iframe 沙箱

MicroApp 有两种沙箱方案：`with沙箱`和`iframe沙箱`。

默认开启 with 沙箱，如果 with 沙箱无法正常运行，可以尝试切换到 iframe 沙箱。

## 常见问题

#### 1、使用`next/image`组件加载图片失败

**解决方式：**

在部分 nextjs 版本中(如：nextjs 11)，使用`next/image`组件无法正确引入图片，此时推荐使用 img 元素代替。

#### 2、无法预加载 ssr 子应用

**原因：**因为 ssr 应用每个路由地址加载的 html、js、css 等静态资源都不同，所以无法对 ssr 子应用使用预加载。

#### 3、控制台报错`Cannot read properties of null (reading 'tagName')`

**原因：**当主应用和子应用都是 nextjs 应用时，`next/head`组件冲突。

**解决方式：**去掉子应用中`next/head`组件。

#### 4、webpack.jsonpFunction 冲突，导致加载子应用失败

**原因：**当主应用和子应用都是官方脚手架创建的项目，容易造成 webpack.jsonpFunction 冲突。

**解决方式：**修改子应用的 webpack 配置。

`jsonpFunction`是 webpack4 中的名称，在 webpack5 中名称为`chunkLoadingGlobal`，请根据自己项目的 webpack 版本设置。

在`next.config.js`中配置 webpack：

```js
// next.config.js
module.exports = {
  webpack: (config) => {
    Object.assign(config.output, {
      chunkLoadingGlobal: "webpackJsonp_自定义名称", // webpack5
      // jsonpFunction: 'webpackJsonp_自定义名称', // webpack4
      globalObject: "window",
    });
    return config;
  },
};
```

> [!TIP]
>
> nextjs 相关问题可以在[nextjs 专属讨论贴](https://github.com/micro-zoe/micro-app/issues/168)下反馈。
