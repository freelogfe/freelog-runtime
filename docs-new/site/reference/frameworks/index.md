# 框架接入参考

主题和插件由 Freelog 节点运行时作为浏览器子应用加载。发行包应包含根目录的 `index.html` 及其可访问的脚本、样式和其他静态资源。工程的 Node.js 版本取决于自身构建工具。

| 工程 | 接入指南 |
| --- | --- |
| React | [挂载与卸载 React 应用](./react.md) |
| Vue 3 | [挂载与卸载 Vue 应用](./vue.md) |
| Vite | [配置 HTTPS 开发服务与静态构建产物](./vite.md) |

先按[快速接入](/runtime/quickstart)在真实节点中验证，再按[版本配置](/runtime/compatibility)发行。需要在平台运行请求时服务端渲染的工程，参见 [Next.js](./nextjs.md) 和 [Nuxt](./nuxtjs.md) 的支持边界。
