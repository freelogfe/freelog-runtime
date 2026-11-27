# Vite 开发与构建配置

Vite 是子应用工具链，不是 Freelog 运行时。工程使用的 Node.js 版本应满足所安装 Vite 与插件的要求；平台不强制所有子应用共享同一 Node.js 版本。

## 开发服务

已有工程保留自己的 React/Vue 等插件，在现有配置中加入必要项。以下示例使用官方基础 HTTPS 插件：

```sh
npm install --save-dev @vitejs/plugin-basic-ssl
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  base: './',
  plugins: [basicSsl()], // 保留项目原来的 React/Vue 等插件
  server: {
    host: 'localhost',
    port: 7101,
    strictPort: true,
    cors: { origin: 'https://your-node.example' },
  },
})
```

将 `https://your-node.example` 替换为实际节点的来源（协议、主机和可选端口）。`strictPort` 让服务在端口被占用时退出，节点中的开发地址因此可以固定。需要局域网调试时按实际访问地址配置监听和证书。[Vite 服务配置](https://vite.dev/config/server-options.html#server-cors)

开发服务使用受浏览器信任的 HTTPS 证书。若使用示例中的插件，先在同一浏览器打开本地地址并完成证书信任，再通过节点加载。已有本地信任证书时，可按 Vite 的 `server.https` 选项接入。[Vite HTTPS 配置](https://vite.dev/config/server-options.html#server-https)

## 正式产物

1. 执行项目构建脚本。检查产物根目录的 `index.html`，确认脚本、样式和其他资源能按产物中的路径访问。`base: './'` 用于生成适合嵌入部署的相对路径。[Vite base 选项](https://vite.dev/config/shared-options.html#base)
2. 面向运行时 `0.5` 发行时，在系统附加字段中核对 `bundleTool: vite` 和 `noderuntime_target_version: 0.5`。[版本配置](/runtime/compatibility)
3. 节点宿主根据主题版本的 `bundleTool: vite` 为主题开启 iframe 沙箱。主题或父插件挂载使用浏览器模块脚本构建的子插件时，在该次挂载的 `renderWidgetOptions` 中传入 `iframe: true`。[挂载 API](/runtime/api/widget#renderwidgetoptions-说明)

正式字段不能靠修改 `package.json` 的资源版本号或手写自定义属性代替。修改附加字段后读回工作稿，再正常发行和检查节点所用版本。
