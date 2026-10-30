# Vue 子应用接入

以下为 Vue 3 工程示例。Vue 2 项目应使用对应的 `$mount/$destroy` 生命周期，不能把两套示例拼在一起。主子应用不要求使用相同框架或 Node.js。

先按[Vite 接入](./vite.md)配置服务。假设 HTML 有 `<div id="app"></div>`：

```js
// src/main.js
import { createApp } from 'vue'
import { initFreelogApp } from 'freelog-runtime'
import App from './App.vue'

let app

window.mount = () => {
  initFreelogApp()
  app = createApp(App)
  app.mount('#app')
}

window.unmount = () => {
  app?.unmount()
  app = undefined
}
```

使用路由时，在当前应用挂载周期创建适合的 router/history，卸载时清理自己的订阅。不把主应用路由当成普通 standalone 页面路由随意覆盖；模式见[路由参考](/reference/microapp/router)。

## 如何确认

通过真实节点的 `dev` 参数加载本地工程，确认组件挂载，再确认卸载/重新挂载没有重复监听。直接打开本地地址只检查服务与证书；真实 SDK 上下文由节点运行时注入。

首次读取平台数据前完成 `initFreelogApp()`，按 [API 返回约定](/runtime/api/base)处理错误信封与异步响应。依赖内容读取需要真实展品依赖路径及授权。
