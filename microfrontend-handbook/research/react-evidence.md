# React 基础篇的资料与版本依据

检索／源码核对日期：2026-11-09，Asia/Shanghai。本文服务于 [React 底层章节](../foundations/05-React从JSX与Fiber到多根生命周期.md)，不提出 React 升级或依赖替换建议。

## 1. 本地版本事实

| 材料 | 本次读取结果 | 限制 |
| --- | --- | --- |
| [PC package.json](../../packages/pc-ui/package.json) | React／ReactDOM 范围 `^18.2.0` | 范围不是实际构建版本 |
| [Mobile package.json](../../packages/mobile-ui/package.json) | 同为 `^18.2.0` | 需与各自锁定／安装解析互证 |
| [pnpm-lock.yaml](../../pnpm-lock.yaml) | PC／Mobile 对应 React 18.3.1，ReactDOM 18.3.1 配 React 18.3.1 | 不替代线上构建身份 |
| 本地 PC 的 node_modules/react/package.json 与 react-dom/package.json | 两者均为 18.3.1 | node_modules 是本机已安装事实，不作为提交给所有读者的固定目录依赖 |
| PC 的 React development UMD 与 ReactDOM development UMD | 实际文件可读，分别约 110 KB 和 1.08 MB | 适合无编译器的本地机制样本；不是正式 Vite ESM 产物 |
| 本地 React／ReactDOM cjs development 构建 | 查到 resolveDispatcher、renderWithHooks、createRoot、commitRootImpl、事件与 effect 等真实函数 | 合并构建文件用于交叉核对，教学源码链接固定至原仓库 tag |
| [PC main.tsx](../../packages/pc-ui/src/main.tsx) | 通过 ReactDOM.createRoot 启动主应用 | 不能从某一个入口推断全部子应用版本／生命周期 |
| [React 17 demo package](../../packages/micro-app2/dev/children/react17/package.json) | React 范围 17，Webpack 4；与主应用 18／Vite 不同 | 不将新 root、StrictEffects 或 Vite 模块路径套到它上面 |

本地 browser 实验可使用的路径已交接给实施者：`packages/pc-ui/node_modules/react/umd/react.development.js` 与 `packages/pc-ui/node_modules/react-dom/umd/react-dom.development.js`。实验必须同套配对并记录摘要；本研究写作没有自行启动浏览器，也不冒称所有实验已通过。

## 2. 实际读取的官方文档

优先采用 18.react.dev 的 **v18.3.1** 归档，而不是当前默认 React 19 文档。该归档仍会标注 Canary 内容，章节未把 Canary 的 onCaughtError／onUncaughtError 写成 18 稳定选项。

| 官方材料 | 本次用于支持什么 | 阅读边界 |
| --- | --- | --- |
| [createRoot](https://18.react.dev/reference/react-dom/client/createRoot) | 多 root、root.render／unmount、卸载后旧 root 不可再更新、identifierPrefix | root 返回不证明业务 ready；不采纳 Canary 稳定性推断 |
| [useEffect](https://18.react.dev/reference/react/useEffect) | 外部同步、依赖与 cleanup、开发额外循环、paint 前后时序边界 | 不承诺每次 effect 都在固定宏任务或 paint 之后 |
| [createPortal](https://18.react.dev/reference/react-dom/createPortal) | 物理位置改变而 Context／React 事件逻辑归属不变 | 跨 document、焦点、样式和权限仍需自己的实验 |
| [StrictMode](https://18.react.dev/reference/react/StrictMode) | 开发额外 render 与 effect 检查 | 不把检查日志等同于真实宿主 mount 次数 |
| [Preserving and Resetting State](https://18.react.dev/learn/preserving-and-resetting-state) | 位置、类型、key 对状态身份的作用 | 不将 key 当成跨 root 的应用身份 |
| [State as a Snapshot](https://18.react.dev/learn/state-as-a-snapshot) | 闭包读取某次渲染快照，setState 不改变原变量 | 与 batching 的调度分别解释 |
| [useSyncExternalStore](https://18.react.dev/reference/react/useSyncExternalStore) | 跨 root 选择外部 store 时需要 subscribe／snapshot 合同 | 不把它当权限、分布式消息或任意深层对象的自动观察器 |
| [hydrateRoot](https://18.react.dev/reference/react-dom/client/hydrateRoot) | 匹配的服务端 HTML、客户端接管与不一致边界 | 不把下载的任意 HTML 都当可 hydration 输入 |
| [React 18 发布说明](https://react.dev/blog/2022/03/29/react-v18) | 并发可中断工作、渐进采用、automatic batching | 发布时对未来功能的展望不是 18.3.1 已公开能力清单 |
| [React 17 事件与渐进升级说明](https://legacy.reactjs.org/blog/2020/10/20/react-v17.html) | root 级事件委托的版本背景 | 具体事件例外再用 18.3.1 源码核对 |
| [新 JSX transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) | JSX 编译成描述创建调用，classic 与 automatic entry 的区别 | 输出示意不宣称每个 Babel／Vite 插件配置产物完全相同 |
| [重复 React 与 invalid Hook call](https://react.dev/warnings/invalid-hook-call-warning) | 组件与 renderer 的 React 模块身份要求，独立配对副本可共存 | 当前站点版本较新，相关机制已与固定 18.3.1 代码互证，不采纳新 API |

最初直接读取默认 react.dev 的 render／createRoot 页面时看到版本为 19.3，因此后续转向 18 归档；没有把站点当前显示版本冒充本仓库基线。

## 3. 实际读取的固定源码

通过 `raw.githubusercontent.com/facebook/react/v18.3.1/...` 直接 HTTP 读取以下 11 个文件，返回均为 200；只在系统临时目录保存以便检索，没有向运行时包复制源码。下面使用固定 tag 的可阅读链接。

| 文件 | 实际检查的字段／函数 | 支持的因果链 |
| --- | --- | --- |
| [ReactElement.js](https://github.com/facebook/react/blob/v18.3.1/packages/react/src/ReactElement.js) | createElement、ReactElement、type/key/props 标记 | 源码描述与执行／DOM 分层 |
| [ReactHooks.js](https://github.com/facebook/react/blob/v18.3.1/packages/react/src/ReactHooks.js) | resolveDispatcher、useState／useEffect 委托 | Hook 读取当前 React 内部 dispatcher |
| [ReactCurrentDispatcher.js](https://github.com/facebook/react/blob/v18.3.1/packages/react/src/ReactCurrentDispatcher.js) | 模块内的 current 指针 | 模块身份不同可以产生不同指针 |
| [ReactFiber.new.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-reconciler/src/ReactFiber.new.js) | Fiber 字段、createWorkInProgress、alternate | current／WIP 缓冲与身份、状态保存 |
| [ReactFiberHooks.new.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-reconciler/src/ReactFiberHooks.new.js) | renderWithHooks、mount/updateWorkInProgressHook、areHookInputsEqual、mount/updateEffectImpl | 函数执行上下文、Hook 顺序、effect 记录 |
| [ReactFiberWorkLoop.new.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-reconciler/src/ReactFiberWorkLoop.new.js) | workLoopSync／Concurrent、commitRootImpl、flushPassiveEffectsImpl、commitDoubleInvokeEffectsInDEV | 协作调度、提交阶段、passive 与开发检查 |
| [ReactFiberCommitWork.new.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-reconciler/src/ReactFiberCommitWork.new.js) | effect mount／unmount 与相应提交分支 | cleanup 属于逻辑树的提交处理，不由 DOM 移除自动触发 |
| [ReactChildFiber.new.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-reconciler/src/ReactChildFiber.new.js) | reconcileSingleElement、key／elementType、useFiber | 更新与重建怎样选择，开发热更新兼容的例外 |
| [ReactDOMRoot.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-dom/src/client/ReactDOMRoot.js) | createRoot、公开 render／unmount、内部指针、listenToAllSupportedEvents | 容器归属、更新排队、旧 root 失效 |
| [DOMPluginEventSystem.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-dom/src/events/DOMPluginEventSystem.js) | listenToAllSupportedEvents、nonDelegatedEvents、selectionchange、HostPortal／HostRoot、accumulateSinglePhaseListeners | 原生入口、Fiber 事件路径及 Portal 边界 |
| [ReactFreshRuntime.js](https://github.com/facebook/react/blob/v18.3.1/packages/react-refresh/src/ReactFreshRuntime.js) | canPreserveStateBetween、performReactRefresh、updated／stale families | HMR 的保留状态协议不等同生产重挂 |

内部函数用于理解机制，不是稳定业务 API。`.new.js` 命名属于这个版本的源码组织，不意味着可在未来版本按同路径继续维护。

## 4. 事实、推导与待验证

- **事实**：以上包版本、已安装文件、文档与源码路径均在本轮读取。
- **架构推导**：多 root 与模块缓存、Portal、effect 合同共同要求实例工厂、显式 ready、依赖身份和资源所有权；不是官方宣布的一套微前端框架规范。
- **待验证**：本章设计的浏览器样本、重复 React 故障、跨 document Portal、真实节点集成，需按具体实验报告判定。本研究者没有代替实施者执行它们。
- **不决定**：是否升级 React、采用 Module Federation、替换 MicroApp、全站共享哪个版本。这些决定需要在独立架构篇结合产品约束权衡。
