# 插件数据通信

在应用的 `window.mount` 内先调用 `initFreelogApp()`。父应用用 `freelogApp` 挂载子插件，再通过该实例的 `WidgetController` 通信。子插件用 `widgetApi` 收发消息。这里的消息保存在当前节点页面中，版本属性、展品配置及授权按各自的业务流程管理。

## 子插件获取父插件的数据

`widgetApi.getData()` 读取接收到的当前对象。父应用挂载时把初始业务数据放在 `renderWidgetOptions.data`，运行时还会注入 `freelogApp`。业务字段应避开这个键。

在子插件的挂载函数中注册 `widgetApi.addDataListener(onParentData, true)`，有缓存数据时可立即触发一次。卸载时调用 `widgetApi.removeDataListener(onParentData)`，传入原来的函数。

```js
import { initFreelogApp } from 'freelog-runtime'

let removeParentListener

function onParentData(data) {
  console.log('父应用选择的条目', data.selectedItemId)
}

window.mount = () => {
  const { widgetApi } = initFreelogApp()
  widgetApi.addDataListener(onParentData, true)
  removeParentListener = () => widgetApi.removeDataListener(onParentData)
}

window.unmount = () => {
  removeParentListener?.()
  removeParentListener = undefined
}
```

如果工程已有 React 或 Vue 的挂载函数，把监听和清理加进相应生命周期。

## 子插件向父插件发送数据

拿到 `widgetApi` 后，可以在子插件事件处理函数中提交对象：

```js
widgetApi.dispatch({ selectedItemId: 'item-2' })
```

消息渠道浅合并新旧数据，并在微任务中通知监听者。普通发送遇到浅比较相同的数据时跳过通知。数组和其他非普通对象不作为消息本体。

## 父插件向子插件发送数据

以下函数由已执行 `initFreelogApp()` 的父应用调用。参数 `exhibitId` 是节点已配置的插件展品 ID，`container` 是已存在的 DOM 元素。挂载依赖插件时改用 [mountArticleWidget](/runtime/api/widget#mountarticlewidget)，通信方式相同。

```js
import { freelogApp } from 'freelog-runtime'

export async function mountSelectionWidget(exhibitId, container) {
  const controller = await freelogApp.mountExhibitWidget({
    exhibitId,
    container,
    renderWidgetOptions: {
      data: { selectedItemId: 'item-1' },
      onDataChange: (event) => console.log('子插件选择', event.detail.data.selectedItemId),
    },
  })

  if (!controller.success) {
    throw new Error('子插件挂载失败')
  }

  return controller
}
```

之后用 `controller.setData({ selectedItemId: 'item-2' })` 更新数据。需要再次通知相同对象时用 `controller.forceSetData(data)`。两个方法接收一个对象参数。

## 父插件获取子插件的数据

- `controller.getData()` 读取当前子插件发送的数据，尚无消息时可返回 `null`。
- `renderWidgetOptions.onDataChange` 在挂载时绑定，回调从 `event.detail.data` 读取消息。
- `controller.addDataListener(listener, true)` 支持匹配当前实例及已有消息。需要解除订阅时，用 `controller.removeDataListener(listener)` 传入同一函数。

`clearDataListener()` 清理当前侧的该渠道监听。父应用的 `controller.clearData()` 清除父应用发给子插件的消息缓存，子插件的 `widgetApi.clearData()` 清除子插件发给父应用的消息缓存。

## 全局数据通信

`widgetApi.setGlobalData(data)`、`widgetApi.getGlobalData()` 和 `widgetApi.addGlobalDataListener(listener, true)` 用于同一节点页面的全局渠道。其他应用实例可读取或更新共享数据，避免发布凭据、用户敏感信息或需要私有传递的数据。卸载时用 `widgetApi.removeGlobalDataListener(listener)` 清理自己的监听。

```js
widgetApi.setGlobalData({ displayMode: 'compact' })
const displayMode = widgetApi.getGlobalData()?.displayMode
```
