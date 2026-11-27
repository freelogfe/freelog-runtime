# Nuxt 支持边界

Freelog 不提供 Nuxt SSR 服务，也不运行 Nuxt 自定义服务器或服务端路由。

如果工程能在构建时产出完整的静态 HTML 和浏览器资源，可以按 Freelog 的[静态产物约定](/runtime/quickstart)逐项核对入口、资源路径和挂载行为，并在真实节点验证。当前接入示例见 [Vue](./vue.md) 和 [Vite](./vite.md)。
