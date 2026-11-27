# 从真实节点运行第一个主题

本页用一个最小的 Vite 浏览器应用演示主题接入。先在已启用基础主题的真实节点中加载本地入口，验证主题挂载和运行时 API 调用，再构建可以发行的静态文件。

## 开始前

准备一个自己可管理的节点，在普通节点地址确认当前主题可以访问。还没有节点或主题时，先按[准备真实节点和基础主题](/runtime/node-setup)操作。以下 Vite 示例应使用兼容的 Node.js，例如 22.14.0 或更新的 22.x 版本。已有前端工程时，保留项目的入口和框架配置，按下面的生命周期和[构建配置](/reference/frameworks/vite)接入。

## 1. 安装接入包并定义挂载入口

从空目录开始时，先安装示例所需的包。

```sh
npm init -y
npm install freelog-runtime@^5.0.7
npm install -D vite@8.3.5 @vitejs/plugin-basic-ssl@2.3.0
```

在项目根目录创建 `index.html`。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <title>我的第一个主题</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

在同一目录创建 `main.js`，在节点运行时调用的 `mount` 中执行 `initFreelogApp()`，取得运行时提供的 `freelogApp`。

```js
import { initFreelogApp } from 'freelog-runtime';

window.mount = () => {
  const { freelogApp } = initFreelogApp();
  const dependencies = freelogApp.getSelfDepForTheme();
  document.querySelector('#app').textContent = '主题已挂载';
  console.log('主题依赖条目数', dependencies.length);
};

window.unmount = () => {
  document.querySelector('#app').replaceChildren();
};
```

`#app` 是上面 HTML 中的容器。使用 React 或 Vue 时，在这两个生命周期中分别创建和卸载框架实例，同时清理应用创建的监听和定时器。

## 2. 启动 HTTPS 开发服务

在项目根目录创建 `vite.config.mjs`。相对的 `base` 使构建产物能从资源包路径加载。示例服务监听本机并允许节点跨域读取。

```js
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  base: './',
  plugins: [basicSsl()],
  server: {
    host: 'localhost',
    port: 7101,
    strictPort: true,
    cors: { origin: 'https://your-node.example' },
  },
});
```

将 `https://your-node.example` 替换为实际节点地址的来源，包括协议、域名和可选端口。然后运行 `npx vite`。有现成工程时用自己的开发脚本和实际 HTTPS 地址。先单独打开 `https://localhost:7101/` 确认服务可达、证书受信任。此时页面容器为空是正常的，节点运行时将在下一步调用 `mount`。

## 3. 从节点加载本地主题

在真实节点根地址添加 `dev`。本地 Vite 主题需要已启用主题提供的兼容加载方式，开始前按[版本指南](/runtime/compatibility)核对基础主题和宿主运行时。

```text
https://你的节点域名/?dev=https://localhost:7101
```

已有查询参数时，用 `URL.searchParams` 保留原路由并正确编码本地地址。

```js
const url = new URL('https://你的节点域名/');
url.searchParams.set('dev', 'https://localhost:7101');
console.log(url.href);
```

页面显示「主题已挂载」，Console 出现主题依赖条目数，Network 可以看到本地入口请求。修改文案后刷新节点，确认页面随本地代码更新。移除 `dev` 后重新打开节点，确认正常入口仍显示已启用的主题。开发入口复用该主题的展品、依赖和授权数据。

## 4. 生成浏览器产物

运行 `npx vite build`。检查 `dist/index.html` 引用的脚本和样式是否能从 `dist/` 内的相对路径加载。继续沿[发行与上线](/runtime/release)准备 ZIP、填写版本字段、发行并在正式节点地址验证。

## 下一步

- [本地开发](/runtime/development)说明如何首次挂载插件或替换已挂载的插件。
- [架构与对象](/runtime/architecture)区分展品、依赖和挂载实例。
- [问题排查](/runtime/troubleshooting)帮助定位入口、证书或运行时初始化问题。
