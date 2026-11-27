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

使用路由时，在应用挂载时创建自己的路由器，卸载时清理订阅。需要同步节点地址或导航到已挂载插件时，见[应用路由](/runtime/integration/router)。

## 如何确认

通过真实节点的 `dev` 参数加载本地工程，确认组件挂载，再确认卸载和重新挂载时没有重复监听。直接打开本地地址可检查服务和证书。节点加载应用时才会提供运行时上下文。

首次读取平台数据前完成 `initFreelogApp()`，按 [API 返回约定](/runtime/api/base)处理错误信封与异步响应。依赖内容读取需要真实展品依赖路径及授权。
