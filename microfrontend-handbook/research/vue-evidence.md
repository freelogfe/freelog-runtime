# Vue 原理研究证据与版本边界

[返回 Vue 原理正文](../foundations/04-Vue从编译响应式到应用卸载.md)

检索日期：2026-11-09，Asia/Shanghai。采用官方文档、官方固定版本源码和本地实际文件；未使用第三方教程代替底层实现。本文是本轮研究台账，不表示这些版本就是平台线上所有插件的版本。

## 1. 研究结论与交接

Vue 微应用应先被设计为“独占容器＋一份 app 生命周期＋清楚的共享依赖与资源协议”。微前端框架随后承接这些合同，而不是先用其选项替代 Vue 的渲染、scope 和模块边界。

对架构最重要的结论是：createApp 隔离应用上下文，不隔离浏览器；渲染 effect 由组件 scope 管理，原生 IO 与宿主持有的回调仍需显式清理；KeepAlive、DOM 隐藏和宿主缓存位于不同层；复制 runtime 的私有依赖跟踪状态可能不互通；构建产物绑定了真实 Vue 模块，不能靠改 window 属性自动替换。

这些结论不决定采用哪套微前端产品、不建议直接升级已有插件，也不把新版本内部实现强加给旧版。

## 2. 固定源码基线

- 官方 tag：`vuejs/core@v3.5.44`。
- 本次读取 [tag ref API](https://api.github.com/repos/vuejs/core/git/ref/tags/v3.5.44)，对象类型为 commit，SHA 为 `bf5f0dd877dd3c23ce85c2cbc1dd771567e84c8c`。
- [固定提交源码](https://github.com/vuejs/core/tree/bf5f0dd877dd3c23ce85c2cbc1dd771567e84c8c)。正文为可读性使用版本 tag 链接；复查时可用此 SHA 冻结。
- 通过 raw.githubusercontent.com 实际读取了该版本的 19 个相关 TS 文件；临时研究副本保存在系统临时目录，没有复制进运行时包。

| 固定版本源码 | 实际读取的机制 | 本章支持的结论 |
| --- | --- | --- |
| [compiler-core/compile.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/compiler-core/src/compile.ts) | `baseCompile`、parse/transform/generate、编译选项 | 模板先产生JS/VNode逻辑，不是直接插DOM |
| [compiler-sfc/compileTemplate.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/compiler-sfc/src/compileTemplate.ts) | `compileTemplate` 及具体编译路径 | SFC模板产物与编译选项、模块helper关联 |
| [runtime-dom/index.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-dom/src/index.ts) | ensureRenderer、createApp对mount的包装、容器处理 | Vue根会接管其容器，宿主需交出明确Element |
| [runtime-core/apiCreateApp.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/apiCreateApp.ts) | createAppContext/createAppAPI、mount/unmount、provide/use | 应用上下文独立；旧app不能被当作可反复mount的句柄 |
| [runtime-core/component.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/component.ts) | 组件scope、provides、setCurrentInstance、条件编译兼容 | 组件拥有scope，重复runtime的上下文互通必须区分构建 |
| [runtime-core/renderer.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/renderer.ts) | setupRenderEffect、patchKeyedChildren、getSequence、unmountComponent | 渲染任务归组件；key决定VNode身份；退出需要走renderer |
| [runtime-core/scheduler.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/scheduler.ts) | queueJob/queueFlush/flushJobs/nextTick | Vue有自己的队列，不提供跨应用全局ready |
| [reactivity/reactive.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/reactivity/src/reactive.ts) | reactive与proxy缓存等 | Proxy属于具体runtime实现，原始对象和代理身份需区分 |
| [reactivity/baseHandlers.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/reactivity/src/baseHandlers.ts) | getter中的track、setter中的trigger分支 | 实际属性读写建立／触发依赖，不由API名字自动互联 |
| [reactivity/dep.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/reactivity/src/dep.ts) | Dep/Link、targetMap、track/trigger | 3.5.44内部结构不是早期简图的Set版字面实现 |
| [reactivity/effect.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/reactivity/src/effect.ts) | ReactiveEffect.run/stop、activeSub与scope记录 | 活动订阅者与私有模块状态决定跨副本依赖是否连接 |
| [reactivity/effectScope.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/reactivity/src/effectScope.ts) | scope run/on/off/stop、子scope、cleanups | 自动停止依赖被scope记录；不是任意浏览器资源的回收 |
| [runtime-core/apiWatch.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/apiWatch.ts) | watch包装、flush调度、instance信息 | watcher调度具有模式与上下文，不能只给单一时序承诺 |
| [runtime-core/apiInject.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/apiInject.ts) | provide/inject及currentApp路径 | 注入沿逻辑应用／组件上下文，不沿物理DOM祖先 |
| [runtime-core/apiSetupHelpers.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/apiSetupHelpers.ts) | withAsyncContext保存／恢复和清理 | 编译后的顶层await与任意异步回调不同，需按版本解释 |
| [runtime-core/components/KeepAlive.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/components/KeepAlive.ts) | activate/deactivate、storageContainer、hooks | 停用移动与正式unmount/scope.stop不是同一个动作 |
| [runtime-core/components/Teleport.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/components/Teleport.ts) | resolveTarget、process、目标插入与移动 | 逻辑父子与物理DOM位置可分开 |
| [runtime-core/hmr.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/hmr.ts) | rerender/reload、缓存与dirty组件处理 | HMR特定状态保留不证明生产生命周期可重入 |
| [runtime-core/hydration.ts](https://github.com/vuejs/core/blob/v3.5.44/packages/runtime-core/src/hydration.ts) | hydrate/hydrateNode与mismatch处理 | hydration接管既有DOM，需服务端／客户端契约 |

## 3. 实际读取的官方文档

| 官方资料 | 用途与限制 |
| --- | --- |
| [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html) | 对照VDOM流水线、编译器辅助优化；内部函数以固定源码核对 |
| [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html) | 对照执行读取、track/trigger模型；教学模型不冒充3.5结构 |
| [Watchers](https://vuejs.org/guide/essentials/watchers.html) | 同步／异步创建、停止、清理及flush范围；当前API不能直接假定旧版都有 |
| [Creating an Application](https://vuejs.org/guide/essentials/application.html) | 多应用、app实例、全局配置范围 |
| [Reactivity Advanced](https://vuejs.org/api/reactivity-advanced.html#effectscope) | effectScope的公共合同与停止范围 |
| [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive.html) | 缓存实例、activated/deactivated与最终卸载 |
| [Teleport](https://vuejs.org/guide/built-ins/teleport.html) | 逻辑关系保留、物理DOM迁移与目标条件 |
| [SFC CSS Features](https://vuejs.org/api/sfc-css-features.html) | scoped选择器／属性变换、继承与深选择器边界；不等于Shadow DOM |
| [SFC Script Setup](https://vuejs.org/api/sfc-script-setup.html#top-level-await) | setup执行次数与顶层await编译上下文；不把任意Promise回调也算此路径 |
| [SSR](https://vuejs.org/guide/scaling-up/ssr.html) | hydration、请求级状态和mismatch边界；本次未开展SSR业务实现 |

官方文档是此次读取时的当前正文；未冻结为旧版本文档。版本敏感的实现结论已经用 v3.5.44 源码限定，避免把“官网现在写了”当成 Vue 3.2 插件支持的证明。

## 4. 本地事实与实际运行

### 4.1 已读取的项目材料

- `packages/micro-app2/dev/children/vue3/package.json`：Vue声明 `^3.2.37`；其 yarn.lock 固定3.2.37，并保留不同compiler-sfc记录。
- `packages/micro-app2/dev/main-vite/package.json`：Vue声明 `^3.4.21`；其独立pnpm锁固定3.4.21。
- 上述两个demo当前 `node_modules/vue/package.json` 均不存在，不能声称它们已在本机运行并通过。
- `docs-new/node_modules/vue`、runtime-core、reactivity、compiler-sfc的实际包版本为3.5.44；完整global构建可供独立浏览器教学复用，不代表生产插件依赖。
- 本次 `docs-new/node_modules/vue/dist/vue.global.js` SHA-256：`32e8d2cf5034e241ccd220b42bb07042b0604839bd04607106728c338c92738b`。
- 旧Vue demo入口确实每次mount创建新app/router/history，unmount调用app.unmount与history.destroy；同文件还在模块顶层注册document/window监听和timer。这能说明旧示例中存在两种所有权，不证明已经发生线上泄漏。

### 4.2 已运行的编译样本

本机以 Node 调用已安装的 compiler-sfc 3.5.44：

```js
compileTemplate({
  source: '<button @click="count++">{{ count }}</button>',
  filename: 'Player.vue',
  id: 'reader',
})
```

实际产物含 `from "vue"` 的 helper 导入、`render(_ctx, _cache)`、`_createElementBlock`、事件缓存与 `1 /* TEXT */`。正文只给删减后的关系示意，没有冒充逐字完整输出。

### 4.3 已运行的scope／调度样本

使用同一已安装Vue：创建ref(0)，在effectScope.run中创建watchEffect并保存观测；同步赋1、2，await nextTick；scope.stop后赋3，再await nextTick。

实际观测列表为 `[0, 2]`，stop后未追加。它只证明该watchEffect默认调度样本，不覆盖sync/post模式，不验证DOM布局，不验证微前端自动清理。

### 4.4 已运行的适配器片段

从正文直接提取 `createVuePlayer` 和随后的最小宿主代码，置于 jsdom 16.7.0 的独立 window 中，先加载实际 Vue 3.5.44 global build，再执行两app挂载、退出A、发resize、重挂A、全部退出。

实际输出为：resize只记录 `{ owner: 'reader-b', event: 'resize' }`；退出A后宿主注册数为1；finally全部退出后为0。没有手写另一套适配器替正文样本通过。jsdom不是实际浏览器，该证据不覆盖布局、跨realm、真实网络与辅助技术。

## 5. 未运行、仍需独立验证的内容

正文的双根、仅移除DOM对照、重复Vue副本、Teleport与完整适配器真实浏览器实验，需要以主代理的实际实验结果为准；此研究lane没有把它们标成浏览器通过。已运行的Node编译／scope与jsdom适配器样本也不能替代这些浏览器证据。

SSR hydration、不同Vue小版本互操作、跨realm第三方组件和真实平台SDK均不在此次lane的执行范围。后续选用任何微前端实现时，应把这些边界转成架构输入／输出和回归合同，而不是追加更多孤立框架配置。
