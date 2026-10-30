# React 子应用接入

适用于采用 `react-dom/client` 的 React 工程。这里是子应用接入示例，不要求主题与运行时主应用使用相同框架、React 版本或 Node.js。

先按[Vite 接入](./vite.md)处理开发入口与构建路径。以下入口假设 HTML 有 `<div id="root"></div>`，并且由真实节点运行时加载：

```jsx
// src/main.jsx
import { createRoot } from 'react-dom/client'
import { initFreelogApp } from 'freelog-runtime'
import App from './App.jsx'

let root

window.mount = () => {
  initFreelogApp()
  root = createRoot(document.getElementById('root'))
  root.render(<App />)
}

window.unmount = () => {
  root?.unmount()
  root = undefined
}
```

每次重新挂载创建新的 root；不要在模块顶层创建一次后卸载，再复用已卸载的 root。业务组件自行在 effect 清理函数中移除事件监听、定时器和外部实例。

`initFreelogApp()` 从当前子应用上下文取得主应用注入的 API。直接打开本地站点不能据此获得真实 SDK；不在缺少主应用上下文时调用真实初始化。

## 如何确认

1. 在本地打开 HTTPS 地址确认证书及资源能够访问。
2. 通过节点的 `dev` 参数加载，确认组件渲染，Network 指向本地入口。
3. 切换/卸载应用，检查清理，再次挂载不出现重复监听。
4. 依赖插件挂载使用[实际挂载接口](/runtime/api/widget#mountarticlewidget)，不只导入一个资源 ID。

旧 React 16/17 的 `ReactDOM.render` 与当前 createRoot 不是同一接入示例，不要拼接两套卸载方式。生命周期属于 MicroApp 接入；业务路由和数据加载仍由应用自己实现。
