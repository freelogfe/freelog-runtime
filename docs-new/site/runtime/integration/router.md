# 应用路由

本页适合已经通过 [Freelog 挂载 API](/runtime/api/widget)接入节点的主题和插件。子应用使用自己的路由库来声明页面，运行时负责将子应用的位置与浏览器状态按所选模式同步。

## 路由模式

父应用通过 `renderWidgetOptions['router-mode']` 选择模式：

| 模式 | 行为 |
| --- | --- |
| `search`（默认） | 将子应用路径编码进浏览器地址，以实例渲染名称为参数名。已有 hash 且没有 search 时，参数写入 hash 后的查询部分。 |
| `pure` | 在子应用中保留位置，导航不写顶层浏览器地址或历史记录。 |
| `state` | 将子应用的路径保存在浏览器 `history.state` 内，地址栏保持原样。 |

## 配置项

### 保留路由状态

`keep-router-state: true` 让常规卸载时保留该实例的位置供重挂载使用。它只处理路由位置。在指定了 `default-page` 且没有更优先的浏览器状态时，重新挂载会应用默认页。要保留已挂载应用状态，见[保活](./keep-alive.md)。

## 导航

父应用使用控制器的 `name` 指定目标。它是运行时生成的实例名称。先确认 `controller.success`，然后对当前可见且已渲染的子实例导航。

```js
const controller = await freelogApp.mountExhibitWidget({
  exhibitId,
  container,
  renderWidgetOptions: {
    'router-mode': 'search',
    'default-page': '/items',
  },
})

if (controller.success) {
  await freelogApp.router.push({ name: controller.name, path: '/items/42?view=summary' })
}
```

### router.push

`router.push({ name, path })` 导航到目标子应用的路径。可选的 `state` 会在写浏览器历史的模式中传给对应的历史记录。

### router.replace

`router.replace({ name, path })` 替换当前位置记录，适合重定向等场景。两个方法都返回 Promise。目标实例隐藏、仍在预渲染或名称无效时，导航会失败。

### router.go

`router.go(delta)` 调用浏览器历史。步数针对整个浏览器历史栈。

### router.back

`router.back()` 调用浏览器后退。

### router.forward

`router.forward()` 调用浏览器前进。

常规应用内导航用应用自己的路由器。子插件需要请求父应用跳转时，可发送消息，由父应用决定如何导航。[数据通信](./data.md)

## 设置默认页面

挂载时传入 `renderWidgetOptions['default-page']`，其值是子应用内部路径，例如 `'/items?view=summary'`。已经存在该实例的浏览器路由记录时，运行时优先恢复该记录。

## 导航守卫

运行时的 `router.beforeEach` 和 `router.afterEach` 是路由变更通知。回调可接收 `(to, from, name)`，注册返回取消函数，应在所属应用卸载时调用。运行时已更新位置后才调度这些回调。业务级拦截及重定向使用应用自身路由库。

## 获取路由信息

`freelogApp.router.current.get(controller.name)` 读取运行时已记录的实例位置，尚未记录时可返回 `undefined`。子应用查询自身位置时使用自身路由库。当前 `freelog-runtime` 的类型声明未包含这里的 `freelogApp.router`，本页的 JavaScript 示例以运行时实现为准。

## 编解码

`freelogApp.router.encode(path)` 和 `freelogApp.router.decode(value)` 处理 `search` 模式的路由值。传给 `push`、`replace` 和 `default-page` 的路径保持原样，运行时负责所需编码。

## 同步路由信息

`router.attachToURL(name)` 可以重新写入已运行的 `search` 或 `state` 实例的路由位置。只有 `search` 将子应用路径写进可复制的地址。分享整个节点页面请参见[分享 API](/runtime/api/share)。
