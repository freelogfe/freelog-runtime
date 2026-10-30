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
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
})
```

示例将端口固定，避免服务自动改端口后节点仍访问旧地址。需要局域网调试时按项目实际配置监听地址和证书，不直接公开账号文件或工作目录。

基础插件生成的证书仍需浏览器信任；有团队证书管理时使用团队方式替代。不要将关闭浏览器安全检查作为通用方案。可达性、跨域、证书与浏览器本地网络权限分别检查。

## 正式产物

1. 执行项目构建脚本，检查产物根目录有入口 HTML，静态资源引用有效。
2. 发行时系统附加字段 `bundleTool` 填 `vite`，目标字段 `noderuntime_target_version` 按所用能力填 `0.5`，见[版本配置](/runtime/compatibility)。
3. 主题、插件的加载由运行时安排；当前主应用针对 Vite 使用 iframe 沙箱。不在业务项目另建 MicroApp 主应用来替代平台。

正式字段不能靠修改 `package.json` 的资源版本号或手写自定义属性代替。修改附加字段后读回工作稿，再正常发行和检查节点所用版本。
