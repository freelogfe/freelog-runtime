# Vite／Webpack 原理章的资料与实验记录

[返回原理章](../foundations/03-Vite与Webpack如何决定应用加载.md) · [返回课程](../README.md)

检索与本地读取日期：2026-11-09，Asia/Shanghai。用途是解释已选择工具链的机制与版本边界，不是比较后决定安装、升级或替换依赖。

## 1. 仓库事实先于新版官网

| 位置 | 实际读取结果 | 结论边界 |
| --- | --- | --- |
| [PC package](../../packages/pc-ui/package.json)、[Mobile package](../../packages/mobile-ui/package.json) | Vite 5 范围、React 18 范围，使用 plugin-react | 范围不是精确安装版本 |
| [根 pnpm-lock](../../pnpm-lock.yaml)及已有包的 package／导出 | Vite 5.4.3、plugin-react 4.3.1、React／ReactDOM 18.3.1、Rollup 4.21.2、Vite 依赖 esbuild 0.21.5 | 仓库还装有其他 esbuild／Rollup 版本，不能只找一个目录便认定全部消费者都相同 |
| [PC vite.config](../../packages/pc-ui/vite.config.ts) | React 插件、基础 HTTPS 插件、`base:'/v0.5'` | 本轮未执行 PC 业务构建 |
| [Mobile vite.config](../../packages/mobile-ui/vite.config.ts) | 同类 base，另有 legacy 且关闭 modern chunks、开启 legacy chunks | 本轮未构建并验证 legacy 文件；只证明配置事实 |
| [vite4 demo package](../../packages/micro-app2/dev/children/vite4/package.json)与[Yarn 锁](../../packages/micro-app2/dev/children/vite4/yarn.lock) | Vite 4.2.1、plugin-vue 4.1.0、Vue 3.2.47 | 独立 demo 的锁不由根 pnpm-lock 自动覆盖 |
| 工具链探针解析到的 SFC 编译器 | 已有 docs-new 依赖中的 compiler-sfc 3.5.44 | 用于独立编译观察，不冒充 vite4 demo 的 compiler 版本 |

原理章的 Vite 内部主线明确固定为 5.4.3。当前官网即使介绍别的构建器或新的插件机制，也不能直接用于解释该版本。本轮没有更改 lockfile 或安装包。

## 2. 官方文档与固定版本源码

Vite v5 官网链接在 web 工具中返回不可访问，不能由此认定站点不存在。本轮改为直接 HTTP 读取 GitHub 官方仓库 `v5.4.3` 对应正文；下面列出的正文／源码均实际取回，源码按所列函数和分支走读，没有声称审计过完整工具链。

| 官方来源 | 固定版本／读取范围 | 支持正文中的什么结论 |
| --- | --- | --- |
| [Why Vite](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/why.md) | v5.4.3 正文 | 依赖与源码分流、开发原生 ESM 与生产打包的不同图 |
| [Dependency Pre-Bundling](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/dep-pre-bundling.md) | v5.4.3 正文 | esbuild 开发依赖优化、格式互操作、linked package 与缓存边界 |
| [Features](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/features.md) | v5.4.3 的 JSX、TypeScript、CSS、构建优化段 | 转译不等于类型检查，CSS 注入／拆分，动态依赖预加载 |
| [Build](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/build.md) | v5.4.3 的 base、Rollup、动态加载错误段 | 生产路径改写、旧页面引用旧 chunk 的失败场景 |
| [Assets](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/assets.md) | v5.4.3 正文 | 资源导入、CSS url、import.meta.url 和可分析范围 |
| [Backend Integration](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/backend-integration.md) | v5.4.3 正文 | dev client／React preamble 与生产 manifest 的不同责任 |
| [HMR API](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/api-hmr.md) | v5.4.3 的 accept、dispose、prune、data | HMR 边界、引用更新责任、热更新清理不等于生产卸载 |
| [importAnalysis.ts](https://github.com/vitejs/vite/blob/v5.4.3/packages/vite/src/node/plugins/importAnalysis.ts) | v5.4.3 的 normalize URL／资源 query／HMR／base 分支 | 从源码导入字符串变成浏览器 URL 的实际流程 |
| [importAnalysisBuild.ts](https://github.com/vitejs/vite/blob/v5.4.3/packages/vite/src/node/plugins/importAnalysisBuild.ts) | v5.4.3 的 preload、动态 import 变换、CSS 等待 | 为什么目标 JS 成功仍不能证明动态依赖链完成 |
| [transform middleware](https://github.com/vitejs/vite/blob/v5.4.3/packages/vite/src/node/server/middlewares/transform.ts) | v5.4.3 的响应与优化错误分支 | 源码／依赖缓存响应不同，优化处理中与旧依赖请求有独立错误 |
| [plugin-react index](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%404.3.1/packages/plugin-react/src/index.ts) | plugin-react 4.3.1，transform／HTML 配置 | JSX 与 React 开发集成属于插件链中的不同责任 |
| [plugin-react fast-refresh](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%404.3.1/packages/plugin-react/src/fast-refresh.ts) | 4.3.1 的 preamble、包装与 accept | 仅加载 JSX 转换模块可能缺 preamble；Refresh 状态协议不能代替应用 mount |
| [plugin-vue index](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%404.1.0/packages/plugin-vue/src/index.ts) | plugin-vue 4.1.0，resolve／load／transform 块分发 | SFC 文件与 query 虚拟子模块的调度 |
| [plugin-vue main](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%404.1.0/packages/plugin-vue/src/main.ts) | 4.1.0 的 descriptor、组装、scope ID、HMR | 编译脚本／模板／样式与组件对象的关系，rerender 与 reload 区分 |
| [plugin-vue template](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%404.1.0/packages/plugin-vue/src/template.ts) | 4.1.0 的 compileTemplate 与 rerender 输出 | 模板成为 render 操作，不是浏览器原样执行 template 文本 |
| [Webpack defaults](https://github.com/webpack/webpack/blob/v5.94.0/lib/config/defaults.js) | 5.94.0 的 uniqueName／chunkLoadingGlobal／hotUpdateGlobal | 构建身份与全局 runtime 协议命名空间 |
| [Webpack JSONP runtime](https://github.com/webpack/webpack/blob/v5.94.0/lib/web/JsonpChunkLoadingRuntimeModule.js) | 5.94.0 的 installedChunks、Promise、URL、登记回调 | 模块缓存与 chunk 状态不同；下载与登记也不同 |
| [Webpack auto publicPath](https://github.com/webpack/webpack/blob/v5.94.0/lib/runtime/AutoPublicPathRuntimeModule.js) | 5.94.0 的 module／classic 路径 | 导入 URL／currentScript 上下文怎样影响资源根推断 |
| [Webpack container](https://github.com/webpack/webpack/blob/v5.94.0/lib/container/ContainerEntryModule.js) | 5.94.0 的 get／init 代码生成 | 暴露模块异步取得 factory，容器采用共享 scope 对象及冲突拒绝 |
| [Webpack shared consume](https://github.com/webpack/webpack/blob/v5.94.0/lib/sharing/ConsumeSharedRuntimeModule.js) | 5.94.0 的版本选择、singleton、strict、fallback 分支 | 不能把共享笼统说成永远取最新版或总会自动兜底 |
| [React Hooks](https://github.com/facebook/react/blob/v18.3.1/packages/react/src/ReactHooks.js)及本地 React 18.3.1 development 文件 | resolveDispatcher 与 Hook 入口 | 同版本不同模块对象仍可能因 dispatcher 身份混用出错 |

旧 plugin-vue 的 npm 元数据 `gitHead` 为 `ad8796af0f30bb08054cb45908a25290e3ee48fa`，本轮亦读取 [4.1.0 元数据](https://registry.npmjs.org/@vitejs%2fplugin-vue/4.1.0)作为版本追溯线索。没有把它与本轮独立编译使用的 3.5.44 编译器混称为一套环境。

以下当前官方页面用于补充术语和配置，不把其新说明无条件套到旧版本；行为细节同时与上表固定源码核对：

- [Webpack Module Federation 概念](https://webpack.js.org/concepts/module-federation/)：容器加载、共享范围与异步边界。
- [ModuleFederationPlugin](https://webpack.js.org/plugins/module-federation-plugin/)：singleton／requiredVersion／strictVersion／eager 的配置含义。
- [Webpack public path](https://webpack.js.org/guides/public-path/)：运行时 publicPath 与初始化顺序。
- [Webpack output](https://webpack.js.org/configuration/output/)：chunk format／loading 及全局数组名的适用范围。
- [MDN JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)：浏览器模块概念的基础入口；细节由本卷模块基础章继续展开。

## 3. 本地实际执行的七项工具链检查

命令：

```powershell
node microfrontend-handbook/scripts/inspect-toolchain.mjs
```

结果文件：[toolchain-inspection.json](../evidence/toolchain-inspection.json)。报告记录执行时间、版本、真实 dev HTML、转换标记、产物图／manifest 与 SFC 编译片段。检查输入是脚本创建的小夹具，不是本仓库真实应用。

| 检查 | 实际操作 | 已证明与未证明 |
| --- | --- | --- |
| 开发依赖优化 | 显式列出 React 相关依赖，真实请求优化后的模块 URL | 取得包含 ESM 导出的响应；没有浏览器执行该依赖图 |
| 开发 HTML | 从真实 Vite HTTP 服务取得 HTML | 同时出现 client、React Refresh runtime 与 preamble |
| JSX 变换 | 请求实际 main.jsx | JSX 已转换，含 HMR 信息、改写后的 lazy／asset 路径 |
| CSS 开发模块 | 请求 CSS 模块响应 | 观察到 updateStyle 注入语义，不等同生产独立 CSS |
| Rollup 分割 | `vite.build`、`write:false`，入口真实消费动态 import | 产出 lazy JS、关联 CSS、manifest 和 preload 助手；没有浏览器点击执行产物 |
| base 与生产条件 | 查看生成 HTML／CSS／asset／entry | 路径带 base，开发 Refresh 协议不保留；没有测试所有 base 选项 |
| Vue SFC 编译 | parse＋compileScript inlineTemplate | 观察 setup-ref 与 VNode 创建；没有完整 plugin-vue、scoped CSS 或 Vue browser runtime 执行 |

主脚本用 createRequire 从 PC 包定位 Vite、React 插件和 React；从已有 docs-new 依赖定位 SFC 编译器。它不使用 docs-new 的另一版 Vite作为主基线，不安装依赖，不读取项目 `.env`，不加载业务 vite.config，也不生成 packages 产物。

临时目录和 cacheDir 都位于 OS temp；检查只关闭自己创建的服务，并在验证目录前缀后删除自己的 mkdtemp 目录。报告保存在本轮授权的手册目录。

## 4. 额外的小规模观察与限制

在编写可重跑探针前，本轮还对一个不含框架的最小 ESM 夹具做过两次 `write:false` 构建：第一次导出的 `getLazy` 无消费者，动态分支随未使用导出被移除；第二次加入 click 消费后，产生 lazy JS／CSS。这为正文的 tree-shaking 反例提供了实际观察，但不是全面验证所有副作用优化规则。

该反例在正文给出输入差异，读者可按同样方式修改临时学习夹具复现。正式七项探针保留可达的动态 import，不把初次缺 chunk 当工具链错误。

尚未执行的内容包括：真实浏览器 Vite HMR／Fast Refresh／Vue HMR 互动、Webpack 双 runtime 碰撞复现、Federation 远程容器与共享版本运行、Mobile legacy 生产执行、微前端资源重写、真实平台文件服务与授权。这些仍需独立实验，不能由七项 Node 工具链检查推导通过。

## 5. 架构推论与源码事实的分界

正文中“应该把产物图作为发布单元”“模块共享应明确对象身份”“微前端需要声明加载格式与开发入口协议”是由机制推导的设计建议，不是 Vite／Webpack 自动实现的平台合同。

对具体框架实现的评价也留待后续：先列出上述合同，再检查它选择保留哪些浏览器语义、改写哪些运行路径以及如何验证。不能仅凭某个应用有一次成功画面，就宣布整个技术栈被完整接管。
