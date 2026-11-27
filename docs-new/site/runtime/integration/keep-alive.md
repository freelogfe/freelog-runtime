# 插件保活与生命周期

子插件返回同一处界面时，父应用可以用保活保留已加载的实例和界面状态。保活隐藏和实际卸载会触发不同的生命周期。

## 使用方式

父应用在 [mountExhibitWidget](/runtime/api/widget#mountexhibitwidget) 或 [mountArticleWidget](/runtime/api/widget#mountarticlewidget) 的渲染选项中开启保活。以下使用已经取到的真实插件展品 ID 和容器：

```js
const options = {
  exhibitId,
  container,
  seq: 1,
  renderWidgetOptions: {
    'keep-alive': true,
    lifeCycles: {
      afterhidden() { console.log('插件已隐藏') },
      beforeshow() { console.log('插件即将恢复') },
      aftershow() { console.log('插件已恢复') },
      unmount() { console.log('插件已卸载') },
    },
  },
}

const controller = await freelogApp.mountExhibitWidget(options)
if (!controller.success) throw new Error('插件挂载失败')

// 用户离开插件时，隐藏当前实例。
await controller.unmount()
```

恢复时使用相同的展品身份、`seq` 和入口重新发起挂载，并通过 `lifeCycles.aftershow` 确认恢复。当前实现恢复已有实例触发 `aftershow`，而挂载 Promise 只监听 `mounted` 和 `error`，因此恢复时可能一直等待。保留首次拿到的控制器用于后续操作。

同屏挂载同一插件的不同实例时，为每个实例分配不同的 `seq`。使用 `controller.unmount({ clearAliveState: true })` 清理保活状态。需要连同运行时缓存资源一起删除时，使用 `controller.unmount({ destroy: true })`。

## 生命周期

### 主应用

父应用在挂载时通过 `renderWidgetOptions.lifeCycles` 注册回调。首次挂载经过 `created`、`beforemount` 和 `mounted`，失败时可收到 `error`。保活隐藏触发 `afterhidden`，恢复依次触发 `beforeshow` 和 `aftershow`。实际卸载触发 `unmount`。

### 子应用

子插件可在 `window.mount` 内监听 `window` 上的 `appstate-change` 事件，通过 `event.detail.appState` 读取 `afterhidden`、`beforeshow` 或 `aftershow`。按业务需要在隐藏时暂停刷新等工作，恢复时重启，在 `window.unmount` 中释放资源并移除监听。

## 常见问题

**滚动位置如何恢复？** 需要恢复滚动时，由应用记录并在 `aftershow` 恢复所需容器的位置。

**切换子应用内部页面后如何保留表单状态？** 此处保活以插件实例为单位。内部页面或组件的缓存由应用自己的路由和组件管理。
