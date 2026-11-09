# 09 · 主题插件与 Freelog 能力注入

本章把“主题可以调用平台 API”拆成可追踪的机制，再给出挂载与销毁的具体写法。所有代码示例都是教学或候选实现；本次未在真实节点执行，也未改变业务源码。

## 1. 为什么 SDK 不直接给每个插件创建一套运行时

同一个节点里的子应用需要共享节点、用户、授权 UI 和文件访问上下文，同时保持各自的实例身份。当前设计由主应用保存上下文，再给子应用传入能力对象。这样 SDK 本身无需重新获取节点身份，也不用复制整套主应用。

真实调用链：

```text
父应用调用 mountArticleWidget / mountExhibitWidget
  → core 生成 name，写入 widgetsConfig
  → mountApp 调用 microApp.renderApp
  → data.freelogApp = bindName(name)
  → 子应用脚本执行，调用 initFreelogApp()
  → window.microApp.getData().freelogApp
  → SDK 导出的 freelogApp 指向该代理
  → freelogApp.someMethod(args)
  → core freelogApp.someMethod(name, ...args)
```

定位：[core/widget.ts](../packages/freelog-runtime-core/src/structure/widget.ts)、[core/freelogApp.ts](../packages/freelog-runtime-core/src/structure/freelogApp.ts)、[SDK/index.ts](../packages/freelog-type/src/index.ts)。

`bindName` 是一个 `Proxy`：读取函数时返回包装函数，在参数最前面补入实例名；读取普通字段时直接返回字段值。它不是序列化 RPC，跨边界传递的是当前页面中的对象和函数引用。

## 2. 绑定实例名解决了什么

例如子应用调用：

```js
freelogApp.getSelfNid()
```

运行时实际执行 `getSelfNid(name)`，再查询 `widgetsConfig.get(name).nid`。用户数据 API 还把实例名拼到 key 前面。这样普通插件不用每次传递自己的身份。

它也带来两个维护约束：

1. core 中加入的新函数，应明确是否遵循首参 `name` 约定。直接把普通工具函数塞进 `freelogApp`，可能造成参数整体错位。
2. 返回的普通对象仍可能共享引用。主应用对 `nodeInfo` 的 `Object.freeze` 是浅冻结，不能据此认为所有嵌套字段不可修改。

平台鉴权仍依赖服务端。不要把 `name` 当作可信令牌，也不要通过“允许任意调用方提供 name”实现安全授权。

## 3. 先让子应用有对称的生命周期

旧 [React 主题示例](../packages/docs/guide/theme-react.md) 和 [React 插件示例](../packages/docs/guide/plugin-react.md) 展示了 `window.mount` / `window.unmount` 入口。维护时还要注意再次挂载：React root 卸载后，应重新创建 root，而不是继续复用已 unmount 的 root。

下面是推荐的**最小教学入口**，放在一个使用当前已选 React 工具链的子应用 `main.jsx` 中：

```jsx
import { createRoot } from 'react-dom/client'
import { initFreelogApp } from 'freelog-runtime'
import App from './App.jsx'

let root = null

window.mount = () => {
  if (root) return
  if (window.__MICRO_APP_ENVIRONMENT__) initFreelogApp()
  const container = document.getElementById('root')
  if (!container) throw new Error('找不到子应用 #root')
  root = createRoot(container)
  root.render(<App />)
}

window.unmount = () => {
  root?.unmount()
  root = null
}

if (!window.__MICRO_APP_ENVIRONMENT__) window.mount()
```

独立访问开发地址时，上例只渲染页面；`App` 仍需使用演示数据或显式判断运行时能力是否存在。独立启动不会凭空获得节点 API。真实平台开发应在节点地址中替换代码入口。

引擎在 [create_app.ts](../packages/micro-app2/src/create_app.ts) 中检测两个生命周期函数并支持 UMD 挂载模式。不要把 `mounted` 事件等同于每个业务请求都成功；子应用应有自己的加载、错误和重试 UI。

验收：首次挂载渲染一次；普通卸载后组件退出；再次挂载可以创建新 root；不会因重复注册入口累积订阅。没有真实浏览器测试前，该入口只能视为建议写法。

## 4. 两种插件分别怎样加载

### 4.1 插件本身是节点展品

子应用使用绑定后的 SDK，无需显式传入调用方 `name`：

```js
import { freelogApp } from 'freelog-runtime'

async function mountExhibitPlugin(container, exhibitId, seq) {
  const controller = await freelogApp.mountExhibitWidget({
    exhibitId,
    container,
    seq,
    renderWidgetOptions: {
      iframe: true, // 此例假定目标是需要 iframe 沙箱的 Vite 应用
      data: { scene: 'reader' },
    },
  })
  if (!controller.success) {
    throw new Error(`插件挂载失败: ${controller.name}`)
  }
  return controller
}
```

`iframe` 应由应用构建方式与兼容测试决定，不能机械地给所有插件设为 true。当前 core 的插件挂载函数不会像主题主入口那样自动根据插件 `bundleTool` 选择沙箱。

### 4.2 插件是当前应用的声明依赖

从真实依赖响应中取出身份，不手写猜测 `nid`：

```js
import { freelogApp } from 'freelog-runtime'

async function mountDependencyPlugin(container, articleName, seq) {
  const response = await freelogApp.getSelfDep()
  if (response?.data?.errCode !== 0) {
    throw new Error('无法读取当前应用依赖')
  }
  const items = response.data.data
  if (!Array.isArray(items)) throw new Error('依赖响应不是数组')
  const target = items.find(item => item.articleName === articleName)
  if (!target) throw new Error(`依赖中不存在 ${articleName}`)

  const controller = await freelogApp.mountArticleWidget({
    articleId: target.articleId,
    parentNid: target.parentNid,
    nid: target.nid,
    topExhibitId: freelogApp.getTopExhibitId(),
    container,
    seq,
    renderWidgetOptions: {
      iframe: true, // 此例假定目标需要 iframe 沙箱
      data: { scene: 'reader' },
    },
  })
  if (!controller.success) throw new Error(`挂载失败: ${controller.name}`)
  return controller
}
```

若相同 `articleName` 有多个依赖位置，必须增加匹配条件，例如 `parentNid` 或明确的 `nid`；示例的 `find` 只适用于名称唯一的教学数据。

旧 [use-plugin-react.md](../packages/docs/guide/use-plugin-react.md) 使用了当前 SDK 不提供的 `getSelfDependencyTree()`。本例依据当前源码使用 `getSelfDep()`，并处理 `response.data.data`。迁移旧示例时应先核对 API，而非为过时方法临时添加兼容函数。

## 5. 传业务数据与接收子应用消息

[mountApp](../packages/freelog-runtime-core/src/structure/widget.ts) 将调用方传入的 `renderWidgetOptions.data` 与运行时的 `freelogApp` 合并；后者由运行时覆盖，保证一般接入不会误用调用方同名字段。

父应用使用返回的 `WidgetController`：

```js
const onMessage = data => {
  if (data?.type === 'selection-change') {
    console.log('当前选择', data.payload)
  }
}

controller.addDataListener(onMessage)
controller.setData({ type: 'set-document', documentId: 'demo' })

// 销毁前移除自己的订阅；不要代替其他业务清空全部订阅
controller.removeDataListener(onMessage)
await controller.unmount({ clearAliveState: true })
```

子应用通过 SDK 的 `widgetApi.dispatch({...})` 发送消息；`widgetApi` 在 `initFreelogApp` 时指向当前子应用的 `window.microApp`。

消息建议带明确的 `type` 和 `payload`，必要时加协议版本。不要把数据中心当成完整的事件队列，也不要认为父子消息会自动 JSON 序列化、深拷贝或校验。更新合并、相等判断、异步派发等细节见 [通信与副作用清理](08-通信与副作用清理.md)。

## 6. 挂载是异步的，卸载必须处理竞态

常见错误是父组件已经卸载，但 `await mountArticleWidget()` 此时才返回，于是留下一个没人持有的插件控制器。

下面是**控制流程示意**，可放入父组件 effect，但不包含应用完整错误 UI：

```js
let disposed = false
let child = null

async function start() {
  const created = await mountDependencyPlugin(container, articleName, seq)
  if (disposed) {
    await created.unmount({ clearAliveState: true })
    return
  }
  child = created
}

// start 的拒绝必须进入父应用自己的错误处理
start().catch(error => {
  if (!disposed) showPluginError(error)
})

function cleanup() {
  disposed = true
  const current = child
  child = null
  if (current) {
    current.unmount({ clearAliveState: true }).catch(reportCleanupError)
  }
}
```

`container`、`articleName`、`seq` 和错误处理函数由调用方提供。此片段的前置条件是这个控制器仍唯一代表对应实例。当前 `unmount` 包装按 name 查引擎实例：若新挂载复用了同名实例，迟到旧控制器的清理可能卸载新的应用。对同名挂载应在更外层串行化，或为不同实例分配不会立即复用的唯一序号；单加 disposed 不足以建立完整取消协议。

另须区分 [完整案例](CASE-STUDY.md) 的旧业务结果回填：那里用代次控制“谁能提交 UI”，这里还要管理“谁有权卸载哪个子应用”。两者不能混成一个布尔开关。

清理选择：

| 目的 | 调用 | 含义 |
| --- | --- | --- |
| 暂时离开，保留 keep-alive 状态 | `unmount()` | keep-alive 应用可能只是隐藏 |
| 确实卸载组件状态，但保留可复用资源 | `unmount({ clearAliveState: true })` | 包括隐藏中的 keep-alive 应用 |
| 完全淘汰这个实例及其引擎资源状态 | `unmount({ destroy: true })` | 引擎销毁语义，不能由此推断所有宿主业务 Map 都已清空 |

参数说明可对照 [SDK widget 类型](../packages/freelog-type/src/widget.ts) 和 [引擎 unmountApp](../packages/micro-app2/src/micro_app.ts)。父插件退出时，还应显式处理它持有的子插件；不要假定父 DOM 被移除就会自动完成全部业务关系和订阅清理。

## 7. keep-alive 要增加“暂停业务”的概念

[旧 keep-alive 文档](../packages/docs/guide/keep-alive.md) 说明，隐藏不会触发正常卸载，子应用可监听 `appstate-change`。隐藏与销毁应分别设计：

- `afterhidden`：停止轮询、暂停播放器或高频计算，保留需要恢复的状态。
- `aftershow`：按需恢复业务；避免每显示一次就再添加一遍订阅。
- `unmount`：释放组件、订阅和已持有的子应用。

引擎对定时器或事件的处理不覆盖所有业务资源，例如业务请求、WebSocket、第三方对象、宿主函数里的回调数组。检查拥有者，而不只检查资源是由哪个子应用“最初触发”的。

## 8. Vite 和本地开发入口

本地替换保留平台上下文，只替换代码 URL。[dev.ts](../packages/freelog-runtime-core/src/structure/dev.ts) 解析三种分支：无开发参数、主题替换 `dev=<URL>`、按实例替换 `dev=replace`；还有授权 UI 的 `auth` 分支。

推荐顺序：

1. 先让插件开发地址在同一浏览器中可访问，证书和静态资源加载正常。
2. 再在真实测试节点中使用本地替换，核对实际入口 URL。
3. Vite 主题按 [App.tsx](../packages/pc-ui/src/App.tsx) 的 `bundleTool === "vite"` 分支选 iframe 沙箱；插件调用方应显式提供匹配选项。
4. 核对构建 `base`、模块相对导入、动态 chunk、CSS `url()` 和 HMR WebSocket；开发服务正常不等于发布产物正常。

旧 [Vite 指南](../packages/docs/framework/vite.md) 的 `Access-Control-Allow-Origin: *` 例子只适用于不携带跨域凭据等相应条件。带凭据请求需要服务端返回匹配请求来源和凭据允许头；不要把示例配置当作所有资源请求的通用答案。

## 9. 前端库能力有额外一条通道

SDK `initFreelogApp` 还创建 `window.FreelogLibrary` 代理，通过 `rawWindow.FreelogLibrary` 调用宿主实例，并将当前子应用环境作为参数传入。宿主 [FreelogLibrary](../packages/freelog-runtime-core/src/freelogLibrary/index.ts) 读取依赖、加载 `meta.json`、插入库 JS/CSS，再从指定命名空间读取导出。

这是对现有能力的描述，也说明沙箱暴露了宿主引用。该库实现注释明确不支持 ES 格式库；不要把主题可以加载 module 脚本推导为所有前端库格式都支持。

主应用 `loader` 对 `getLibraryEntryUrls` 补入 `nid`，是为了区分“应用直接消费库”和“某个依赖库继续消费库”。调试库版本错位时，应依次记录调用方实例、消费者 `nid`、命中的依赖项、最终 JS/CSS URL 与命名空间。

## 10. 本章验收

以下项目应在测试节点执行，本次只完成源码核对：

- 首次挂载、普通卸载后重挂、隐藏后显示、强制销毁，都有可解释结果。
- 两个同类插件实例的名称、路由、消息和数据 key 不混淆。
- 父组件快速进入退出时，迟到的挂载会被清理。
- 展品插件与依赖插件分别获得正确的 `getTopExhibitId()` 和 `getSelfNid()`。
- 本地 Vite 模式和发布产物都验证模块入口、chunk、样式、导航与 SDK。
- 父插件销毁后，子插件及宿主登记没有遗留；若失败，按下一章定位并补回归。

继续阅读 [排障与具体修复方案](10-排障与具体修复方案.md)。
