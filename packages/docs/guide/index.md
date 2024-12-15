# 指南

## 概念

### 主题与插件

- **主题**：具有特殊权限的插件，是节点的入口。
- **插件**：作品类型为 "插件" 的功能模块，定义内容展示和交互方式。
  示例：播放器、小说阅读器。

### 平台运行时环境

- 主题和插件在 Freelog 平台的运行时环境中运行，类似于微前端技术。
- 使用 `freelog-runtime` 提供的 API 与节点进行交互。

## 快速入门

### 步骤 1：设置开发环境

- 确保已安装以下工具：
  - [Node.js](https://nodejs.org/)（版本 >= 14）
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

### 步骤 3：测试和部署

- 测试过程中确保解决 HTTPS 或浏览器限制问题（见下文详细指南）。
- 打包后将所有文件压缩为一个无根目录的 zip 包，上传至 Freelog 平台。

## 开发指南

### HTTPS 支持（必须）

- 开启 HTTPS 的方法：
  - `webpack` 用户：[webpack-mkcert](https://www.npmjs.com/package/webpack-mkcert)
  - `vite` 用户：[vite-plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl)

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



