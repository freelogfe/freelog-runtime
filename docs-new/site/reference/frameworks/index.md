# 框架接入参考

运行时是 MicroApp 主应用；这里的 React、Vue 等项目是主题或插件子应用。子应用的 Node.js 要求由自身构建工具决定，不从运行时或 CLI 的版本反推。

优先读[快速接入](/runtime/quickstart)和[Vite 配置](./vite.md)，再按工程选择：

| 工程 | 指南 | 范围 |
|---|---|---|
| React | [React 生命周期](./react.md) | 使用 createRoot 的工程 |
| Vue | [Vue 生命周期](./vue.md) | Vue 3；已有 Vue 2 工程单独维护 |
| Angular | [已有 Angular 示例](./angular.md) | 按页内版本和打包工具核对，不当通用模板 |
| Next.js | [已有 Next.js 示例](./nextjs.md) | 静态/浏览器接入参考，不能推导平台托管 Node SSR |
| Nuxt | [已有 Nuxt 示例](./nuxtjs.md) | 浏览器产物接入参考，不能推导平台托管 Node SSR |

平台接收可由浏览器加载的应用产物，不运行主题插件的开发服务器。服务端渲染应用需要先明确实际产物与部署边界，不能直接把 SSR 工程上传当成可运行主题。
