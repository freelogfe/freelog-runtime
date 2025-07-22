---
deep: true
---
> 此指南只适用于主题与插件；

## 概念

### 主题与插件

下面从不同的角度来描述其具体含义：

* 从工程角度来看，主题和插件都是一个个独立的前端项目。
* 主题是一个网站的页面布局，一个网站可以在多个主题之间切换。
* 开发主题代码时可以使用 [API](../api/widget) 加载插件并使用，从结构上看，插件只是主题项目中的某个小的部件。

具体来说：

* **主题**：在平台创建资源时， 选择类型为 "主题" ，并上传打包压缩后的文件。（在平台创建节点网址时，当访问节点网址，其实就是访问的主题项目）。例如：小说主题、播客主题、漫画主题，拿小说主题来说，你的小说主题项目的ui设计和交互逻辑都由自己完成，使用 [API](../api/widget) 可获取到资源数据并展示到浏览器上；
* **插件**：在平台创建资源时， 选择类型为 "插件" ，并上传打包压缩后的文件。例如示例：音乐播放器、小说阅读器。

再来说说插件的使用方:

```plaintext
1. 谁在使用插件？
答：主题开发者会使用插件； 

2. 在哪里使用？
答：在主题项目的代码里使用；

3. 又如何使用？
答：使用 freelogApp.mountArticleWidget 来加载并渲染一个插件项目；
```

### 平台运行时环境

- 主题和插件在 Freelog 平台的运行时环境中运行，是一种微前端技术。
- 开发者使用官方提供的库 `freelog-runtime` ，开发者可使用此库提供的 [API](../api/widget) 自定义页面交互逻辑，例如用API从节点请求所有资源列表。

## 快速入门

### 步骤 1：设置开发环境

- 确保已安装以下工具：
  - [Node.js](https://nodejs.org/)（建议版本 >= 14，版本应符合自己使用的打包工具要求，如vite6.x要求Node.js的18+版本）
  - 包管理工具（npm、yarn 或 pnpm）
  - HTTPS 开发支持插件
    - `webpack` 用户：[webpack-mkcert](https://www.npmjs.com/package/webpack-mkcert)
    - `vite` 用户：[vite-plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)

### 步骤 2：创建和连接节点

1. 登录 [Freelog 控制台](https://console.freelog.com)，进入 **节点管理**。
2. 创建节点并创建一个主题作品，签约激活。
3. 使用本地主题开发：
   - 启动本地主题，例如：`https://localhost:7101`。
   - 在节点地址后追加 `?dev=https://localhost:7101`，例如：
     ```
     https://examples.freelog.com/?dev=https://localhost:7101
     ```

> 本地开发时，必须使用https；见下面的mkcert的详细说明：

### 步骤 3：测试和部署

- 测试过程中确保解决 HTTPS 或浏览器限制问题（见下文详细指南）。
- 打包后将所有文件压缩为一个无根目录的 zip 包，上传至 Freelog 平台。

## 开发指南

### HTTPS 支持（必须）

- 开启 HTTPS 的方法：
  - `webpack` 用户：[webpack-mkcert](https://www.npmjs.com/package/webpack-mkcert)
  - `vite` 用户：[vite-plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl), [vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert#readme)

### Chrome 浏览器配置

- 如果 Chrome 报错无法访问 `localhost`，按以下步骤操作：
  1. 地址栏输入：`chrome://flags/#block-insecure-private-network-requests`
  2. 将 `Block insecure private network requests` 设置为 `Disabled`。

### 安装 API 库与初始化

- 安装 API 库：

  ```bash
  npm install freelog-runtime
  # 或使用 yarn
  yarn add freelog-runtime
  # 或使用 pnpm
  pnpm add freelog-runtime
  ```
- 初始化 Freelog 应用：

  ```javascript
  import { initFreelogApp } from "freelog-runtime";

  window.mount = () => {
    initFreelogApp();
    console.log("Freelog 应用已初始化");
  };
  ```

## 问题排查

### 开发过程中常见问题

#### Chrome 控制台报错：`net::ERR_CERT_AUTHORITY_INVALID`

- 解决方法：手动访问 `https://localhost:<端口>` 并选择 "继续访问"。

#### 插件未正常加载

- 确保 `dev` 参数正确，例如：`?dev=https://localhost:7101`。
- 检查浏览器是否阻止了跨域请求。

## 社区

如果你有疑问或者需要帮助，可以到 [GitHub Discussions](https://github.com/freelogfe/freelog-runtime/discussions) 社区来寻求帮助。
