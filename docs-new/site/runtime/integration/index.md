# 应用接入

主题或父插件通过 [Freelog 挂载 API](/runtime/api/widget)加载子插件，并用返回的 `WidgetController` 管理该实例。子插件在挂载时调用 `initFreelogApp()`，获取当前实例的 `freelogApp` 和通信对象 `widgetApi`。

- [数据通信](./data.md)说明如何传递初始数据、双向更新与清理监听。
- [虚拟路由](./router.md)说明 `search`、`pure`、`state` 和跨实例导航。
- [浏览器路由](./browser-router.md)说明子应用使用自身路由和共享浏览器路由的边界。
- [保活与生命周期](./keep-alive.md)说明隐藏、恢复与实际卸载。
- [脚本与样式处理](./static-source.md)说明资源路径和 `exclude` 标记。
