# 03 Vite 与 Webpack：应用如何从源模块变成可加载的产物

[返回课程](../README.md) · [独立基础实验](../FOUNDATION-EXPERIMENTS.md) · [本章资料与版本记录](../research/vite-evidence.md)

这一章先不使用微前端框架。设想你要把独立发布的播放器装进阅读页面：拿到 `index.html`，接下来浏览器为什么请求另一个 JS、CSS 或字体？为什么开发环境能运行，上传产物后懒加载失败？为什么两个应用没有同名变量，却仍能破坏对方的 Webpack chunk 加载？

要回答这些问题，必须认识**是谁在解析依赖、谁在计算地址、谁在维护模块缓存**。构建工具不仅压缩文件，还会为应用选择运行时的链接方式。微前端架构必须接住这个事实，不能只把“入口下载成功”当作加载协议。

本章的 Vite 主线固定为本仓库实际安装的 **Vite 5.4.3、plugin-react 4.3.1、Rollup 4.21.2、esbuild 0.21.5**；React 为 18.3.1。Vue 示例项目另有自己的 Yarn 锁，不能据根锁替它宣布版本。工具链探针中的 SFC 编译器为已有的 Vue 3.5.44。这里不把新版 Vite 的其他构建器实现套回 Vite 5。

## 1. 先分开三张图

一个应用至少有三张不同的依赖图。

| 图 | 节点与边 | 谁处理 | 可能发生的变化 |
| --- | --- | --- | --- |
| 源模块图 | `.tsx/.vue/.ts/.css` 文件与 import | 构建工具、框架编译器、插件 | SFC 拆分、JSX 转换、类型擦除、资源转为导入 |
| 产物图 | entry、共享 chunk、异步 chunk、CSS、图片、字体 | 打包器和构建插件 | 合并、拆分、tree-shaking、散列命名、URL 改写 |
| 浏览器运行图 | 实际 URL、模块记录、执行与资源请求 | 浏览器加载器或打包器 runtime | 缓存复用、动态加载、失败传播、热更新 |

源文件 A 导入 B，不保证最终存在 `B.js`；B 可能合进入口，也可能因不可达而删掉。最终存在 `chunk.js`，也不保证首屏加载它；它可能只在用户点击时才请求。一个入口通过，也不能证明运行图中的所有后继节点可用。

```mermaid
flowchart LR
  S[源文件图] --> C[解析与编译]
  C --> B[产物图与资源映射]
  B --> N[实际URL与网络请求]
  N --> E[浏览器模块或构建runtime执行]
  E --> D[点击后增加动态依赖]
  D --> N
```

**架构推论：** 应用发布的最小单元通常是带版本的一整张可访问产物图，而非一个入口脚本。后续的加载器、部署和回退设计都应围绕这张图展开。

## 2. 浏览器 ESM 和打包器 runtime 是不同的链接器

先看没有构建工具时的模块：

```js
// https://assets.example.test/player/v7/main.js
import { play } from './audio.js'
export async function openChapter() {
  const chapter = await import('./chapters/chapter-2.js')
  return play(chapter.track)
}
```

浏览器会按**导入模块自身的 URL**解析相对依赖，而不是按播放器所在 DOM 容器，也不是一律按宿主页面 URL。链接阶段建立导入／导出的绑定，执行阶段再计算模块体；`import()` 返回模块 namespace 的 Promise。相同模块 URL 在同一模块环境中的复用，与“每次 mount 都创建一份组件状态”是两回事。模块机制的更细推导先读本卷浏览器与模块基础，官方依据见 [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)。

构建器则可以把上述语法改写为自己的模块 ID、factory、缓存表和异步 chunk 请求。此时源代码仍写 `import()`，运行时却可能是 Webpack 插入 script，再由全局数组登记模块。

| 问题 | 原生 ESM 路径 | 常见 Webpack classic chunk 路径 |
| --- | --- | --- |
| 怎样识别模块 | 解析后的模块 URL 等加载上下文 | 构建中的 module ID 与 runtime 缓存 |
| 谁发现静态依赖 | 浏览器模块加载器 | 构建器先分析，runtime 执行已生成的依赖关系 |
| 动态代码从哪里来 | 浏览器处理原生 `import()` | runtime 算 chunk URL、加载 script、登记 factory |
| 哪个缓存有效 | HTTP 缓存之外还有模块记录 | HTTP 缓存之外还有 runtime module／chunk 缓存 |
| 移除 UI 能否卸载模块 | 不能据此推断模块记录消失 | 不能据此推断 runtime 缓存与顶层副作用消失 |

这里的 Webpack 路径限定为后文分析的 web classic／JSONP 输出；Webpack 也可生成原生模块等其他格式。架构不能只凭“它是 Webpack 构建”决定执行方式。

### 为什么拿到代码字符串也不一定能执行

```js
new Function("import { x } from './x.js'; return x")
```

这不是一个通用 ESM 加载器。Function 构造器接收函数体语法，静态 import 属于模块语法；它也没有替你建立模块的 URL、链接和依赖记录。动态 `import()` 可以出现在函数体内，但它走的是宿主模块加载机制，不会因此自动经过你包在外面的文本 fetch。

把代码转为 blob module 也只解决“给模块一个 URL”这一部分。原来的相对 import、`import.meta.url`、CSP、调试信息和版本身份都要重新解释。正则改一处 script.src，无法完成整张依赖图的迁移。

## 3. Vite 5 开发环境：不是“完全不编译”，而是按请求组织编译

Vite 开发服务把较稳定的依赖和经常编辑的源码分开处理。依赖可能需要 CommonJS／UMD → ESM 转换或合并内部小模块；源文件则在请求进入时解析、转换和改写 import，交给浏览器继续沿图请求。依据是固定版本的 [Why Vite](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/why.md) 与 [依赖预构建](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/dep-pre-bundling.md)。

一次典型开发请求可以拆成六步：

1. 浏览器请求 HTML，Vite 处理模块入口和 HTML 插件，注入开发客户端。
2. 浏览器请求入口 TSX／Vue 模块；插件把非浏览器语法转换为 JS。
3. import analysis 解析模块引用，把 bare import、虚拟模块、项目文件转换成可请求的 URL。
4. 对需要优化的依赖，由 esbuild 生成开发期 ESM 响应。
5. 浏览器请求转换后代码中的后继 URL；CSS、资源、虚拟模块也可表现为 JS 模块。
6. 文件变化后，开发服务器依据模块关系通知客户端，再由 HMR 边界决定局部更新或向上传播。

“按需”不是所有工作都等到点击才开始：依赖发现和优化可以预先执行；已访问模块的导入关系也需要分析。正确理解是开发服务器和浏览器共同推进图，而非完全不做构建。

### 本轮真实工具链观察

本目录的 [inspect-toolchain.mjs](../scripts/inspect-toolchain.mjs) 用临时夹具、`configFile:false`、独立 cacheDir、`base:'/reader/'` 运行真实 Vite 5，不启动本仓库业务项目。它实际取得了类似下列响应：

```html
<!-- 开发 HTML 的关键结构示意，省略 React preamble 细节 -->
<script type="module" src="/reader/@vite/client"></script>
<script type="module" src="/reader/main.jsx"></script>
```

源码中的 `./logo.svg` 导入在开发模块中出现为 `/reader/logo.svg?import`；CSS 导入指向 `/reader/style.css`；动态依赖变为 `/reader/lazy.js`。这些不是“把 .jsx 文件原样返回”。实际报告在 [toolchain-inspection.json](../evidence/toolchain-inspection.json)。

报告证明取回了转换后的响应与优化依赖，不证明浏览器已经执行 JSX 应用、热更新成功或微前端接入成功。

## 4. 依赖预构建解决的是格式与请求图，不是跨应用隔离

假设源码写 `import React from 'react'`。浏览器通常不能仅凭 bare specifier 知道你本地 node_modules 的位置；React 包还可能以 CommonJS 发布。Vite 的开发依赖优化会处理模块格式与导出互操作，并把合适的依赖转换成浏览器可请求的 ESM。

另一方面，一个 ESM 库可能由很多小文件组成。即使语法完全合法，请求链和请求数量也有成本。预构建可在开发期合并这类依赖，减少浏览器加载工作。**兼容转换**和**减少请求图成本**是两条不同动机。

本轮工具链探针实际请求了一份优化后的依赖，确认返回含 ESM 导出的响应；没有把“磁盘里有 deps 目录”当成请求成功。其依赖优化仅影响该开发夹具，不改变发布产物。

### 预构建缓存为什么容易与 workspace 误解叠加

Vite 5 会结合 lockfile、相关配置、补丁及环境等信息判断优化缓存；浏览器还可能强缓存已经版本化的依赖响应。与此同时，workspace 链接只定位包，不决定包内入口。若包的 module 指向 lib，你改 src 而不生成 lib，即使重启 Vite 也没有新的输入字节。

排查应按顺序确认：包解析到哪里 → 实际读取哪个入口 → 文件字节是否变化 → 优化缓存是否需要更新 → 浏览器是否取到对应响应。不要直接清掉所有缓存，把不同问题混成“缓存坏了”。Vite 5 的 linked dependency 说明见 [固定版预构建文档](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/dep-pre-bundling.md)。

### 这与共享一个 React 有什么关系

一个开发服务中的去重不等于多个独立发布应用的依赖共享。A、B 各自构建并部署，都可以把自己的 React 放入产物；两者是否兼容、是否应共享、共享的版本和生命周期由架构协议决定。预构建器不会自动把独立应用合成安全的单例运行环境。

## 5. Vue SFC 和 React JSX：编译输出不是组件运行时

### Vue SFC 的拆分与组装

`.vue` 文件可以含 template、script、script setup、style 等块。它不是浏览器原生模块格式。典型 SFC 插件需要解析 descriptor，再处理脚本、编译模板为 render 函数、处理样式，最后生成可导入的组件模块。

在开发模式中，不同块可以通过带查询参数的虚拟模块请求参与依赖图，例如 template/style 请求；具体是否内联，取决于插件版本和选项。不要认定每个 SFC 永远固定生成三个网络请求。

```text
Counter.vue
  → descriptor
  → script/setup 编译：建立 setup 绑定信息
  → template 编译：根据绑定信息生成 VNode 操作
  → style 处理：普通／scoped／CSS Modules 等不同路径
  → 组装组件对象与开发更新信息
  → Vue runtime 创建组件实例并渲染
```

模板优化信息、绑定元数据、scope ID 等是编译器与运行时的协作协议。SFC 的 scoped style 主要通过属性／选择器匹配约束组件样式，不能由此推出 JavaScript 全局、路由、网络或整个子应用都被隔离。

本轮使用已有 `@vue/compiler-sfc@3.5.44` 对一个计数器 SFC 执行了 parse 和 `compileScript(..., inlineTemplate:true)`：产物出现 ref 绑定与 VNode 创建，模板标记消失。这个观察是**编译器输出检查**，不是完整 plugin-vue、CSS 或浏览器挂载测试。旧 vite4 demo 的插件为 `@vitejs/plugin-vue@4.1.0`，版本源码可从 [index](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%404.1.0/packages/plugin-vue/src/index.ts)、[main](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%404.1.0/packages/plugin-vue/src/main.ts)、[template](https://github.com/vitejs/vite-plugin-vue/blob/plugin-vue%404.1.0/packages/plugin-vue/src/template.ts) 跟踪。

### JSX 不是另一个 DOM

JSX 会被编译为创建 React element 的调用，例如自动 JSX runtime 的函数；这些 element 描述待渲染结构。后续 React renderer 才负责 root、调度、协调、commit 与 effect。JSX 转换成功，不证明 createRoot 的容器正确，也不证明 effect 会在应用退出时清理。

Vite 5 可使用 esbuild 做 JSX 语法转换；React 插件另外承担 React 相关转换与 Fast Refresh 集成，不能把它们压成“Vite 自己就是 React 编译器”。本仓库 React 插件 4.3.1 的 [固定源码](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%404.3.1/packages/plugin-react/src/index.ts) 可见插件配置和 Refresh 包装。

这两条链最后都回到同一个架构问题：**谁创建框架应用／root，谁持有它，谁调用其卸载接口？** 构建输出格式不能代替这份生命周期合同。

## 6. HMR 与 Fast Refresh：开发更新协议不是生产挂载协议

Vite 客户端、服务器模块图、WebSocket 通知与框架更新器一起构成开发反馈链。文件修改后，服务器使相关模块失效，寻找能接收更新的边界；客户端取得新版模块，再由接收者更新对应状态。遇到无法接受的边界，更新可能向上传播或导致整页重载。

Vite 5 HMR 不会自动把所有旧 import 引用替换成新模块；边界应承担更新后的引用处理。`dispose` 用于清理更新前模块留下的持续副作用，`data` 可跨更新实例保留信息。它们针对热更新，不等于宿主关闭微应用时一定会调用的生产 unmount。依据见 [Vite 5 HMR API](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/api-hmr.md)。

### React 开发入口为什么会缺 preamble

plugin-react 4.3.1 在 HTML 中注入 Refresh runtime 的初始化，并在转换后的模块中检查初始化标记。若你绕过 Vite 的 HTML 处理，只取一份转换后的 JSX 脚本塞进另一个页面，就可能缺少预期初始化；此时不能只修 script URL。

可以在固定插件的 [fast-refresh.ts](https://github.com/vitejs/vite-plugin-react/blob/plugin-react%404.3.1/packages/plugin-react/src/fast-refresh.ts) 看到三种责任：HTML preamble 初始化全局 hook、组件注册与签名、接收更新并判断边界。官方 [backend integration](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/backend-integration.md) 也把 React preamble 与 Vite client、入口脚本分别列出。

**由此推导：** 远程开发应用的接入合同至少包括转换后的 HTML、开发客户端、框架 preamble 和可连接的 HMR 通道。入口能展示，只能证明当前加载链的一部分；WebSocket 路径、代理、HTTPS／WSS 和客户端所处环境仍需实际验证。

### Vue 模板更新与脚本更新为什么不能视为同一动作

SFC 插件知道块类型变化，可以选择更新 render 或重新加载组件定义；它利用 Vue HMR runtime 协调已有组件实例。修改模板、修改 setup 逻辑、修改导出形状，状态保留条件可能不同。把“保存文件后没有重载整页”当成永久生命周期保证，会让生产重挂载缺陷被开发更新行为掩盖。

架构的验收应分别包含：冷启动、热更新、生产挂载、退出后重挂。不要把前三者都叫“刷新”。

## 7. Vite 5 生产构建：从源图重新形成产物图

Vite 5 的生产构建基于 Rollup，不能把开发依赖预构建输出直接当生产包发布。构建会分析可达性、模块导出使用、动态分割和资源引用，再形成带地址关系的产物。这里的 tree-shaking 不只是删除空格，它可能改变哪些模块存在于最终图里。依据见 [Vite 5 build](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/build.md) 和 [构建优化](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/features.md)。

本轮一个最小观察很有价值：源码导出 `getLazy = () => import('./lazy.js')`，但 HTML 入口没有消费者，生产构建把未使用函数和对应懒加载路径移除了。接入真实 click 消费者后，才生成独立 lazy chunk 和 CSS。**源代码中有 import 字样，不等于发布时必有同名资源。** 是否能删除还受副作用、调用可达性与打包配置等影响，不能把这个样本推广成任意模块都可删。

一次有消费者的构建可得到类似结构：

```text
index.html
  ├─ assets/index-<hash>.js
  ├─ assets/index-<hash>.css
  └─ 浏览器点击后
       ├─ assets/lazy-<hash>.js
       └─ assets/lazy-<hash>.css
```

动态依赖还可能引用公共 chunk。Vite 的构建处理会把动态 import 与预加载信息联系起来，提前加载相关公共依赖；异步 chunk 对应的 CSS 也参与加载顺序。固定版 [importAnalysisBuild.ts](https://github.com/vitejs/vite/blob/v5.4.3/packages/vite/src/node/plugins/importAnalysisBuild.ts) 的 `preload`、`buildImportAnalysisPlugin` 可见 CSS 等待与错误传播。

这能解释一个具体故障：目标 JS 请求为 200，但相应 CSS 预加载失败，外部看起来像“动态 import 没完成”。应检查预加载助手等待的依赖，而非仅检查目标 JS。

### manifest 是图索引，不是跨应用生命周期协议

生产 manifest 可列 entry、imports、dynamicImports、CSS 和 assets，适合宿主定位带散列的文件与必要样式。沿 imports 递归查样式，比猜一个固定 `style.css` 更可靠。

但 manifest 不会告诉你应用允许挂几次、怎样销毁、依赖是否可共享、SDK 能力是否授权。发布清单和运行合同应该连接，但不能混为同一个文件格式。Vite 官方 [backend integration](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/backend-integration.md) 说明 manifest 用法，应用合同需架构另行定义。

## 8. 地址推导：同时算清入口、模块、资源与路由

设发布目录为：

```text
https://cdn.example.test/player/v7/
  index.html
  assets/main-A.js
  assets/audio-B.js
  assets/player-C.css
  assets/font-D.woff2
```

宿主地址是 `https://reader.example.test/books/42`。播放器容器位于哪里，不会自动改变下列 URL 规则。

| 代码／标签 | 基准是什么 | 本例应得到的含义 |
| --- | --- | --- |
| 外部 module 中 `import './audio-B.js'` | 发出 import 的模块 URL | 从 main-A.js 所在目录定位 audio-B.js |
| 外部 CSS 中 `url('./font-D.woff2')` | 样式资源 URL | 相对于该 CSS 文件的路径，不是 DOM 容器 |
| 模块中 `new URL('./x.png', import.meta.url)` | 当前模块 URL | 与模块地址绑定；构建器可能提前分析并改写 |
| 宿主直接插入 `<img src='/x.png'>` | 当前文档的 URL／base 规则 | 根路径属于宿主 origin，不因它在播放器容器内就属于 CDN |
| 应用内部 `/chapter/2` | 路由协议 | 表示业务页面意图，不应被用来覆盖代码资源基址 |

`base`、资源根、框架 router base／basename、HMR socket 地址是不同变量。它们在简单独立页面里恰好相似，一嵌入就暴露差异。

### 构建 base 能改写什么

Vite 在构建阶段能处理分析到的 HTML 资源引用、JS 导入资源和 CSS url。`base:'/reader/'` 的测试产物中，这些路径都带 `/reader/assets/`；`base:'./'` 则会选择适合相对部署的表达方式。运行时拼接出来的任意字符串不一定经过构建分析。依据见 [固定版 assets](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/assets.md) 与 [build](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/build.md)。

例如 `fetch('/api/chapter')` 是业务请求，不应盲目把所有前导 `/` 改成资源 CDN 前缀；反过来，把 `new URL('./worker.js', import.meta.url)` 的模块基址弄丢，也不能靠 router basename 修复。

### 为什么只改 HTML 的 script.src 不够

把入口移到可访问的 CDN，只修好了图的第一条边。入口中的原生 import 由浏览器继续解析；构建预加载器可动态创建 link；CSS 内还有资源边；Worker 也可有自己的脚本图。一个通用加载器必须明确：保留原生 URL 语义，还是重写全部相关引用，或者要求产物遵守受限协议。

“自定义 fetch 能看到所有资源”也不是浏览器给你的保证。你手动调用的 fetch、浏览器原生 module 加载、CSS 字体加载、Worker 创建是不同入口，必须分别说明接管范围。

## 9. Webpack runtime：模块工厂、缓存与 chunk 登记

以下是理解用的极简模型，省略循环依赖、ESM getter、异步模块、运行时插件和错误恢复；它不是 Webpack 源码复制品。

```js
const factories = new Map()
const cache = new Map()

function requireModule(id) {
  if (cache.has(id)) return cache.get(id).exports
  const module = { exports: {} }
  cache.set(id, module)
  factories.get(id)(module, module.exports, requireModule)
  return module.exports
}
```

模块第一次执行时取得 exports，后续从缓存读取。于是入口重新调用，不一定重新创建模块顶层对象；应用实例状态若放在模块顶层，就可能由多个 mount 共享。独立应用 root 是否隔离，与打包器模块缓存是否复用必须分别设计。

常见 Webpack web classic 输出的动态 chunk 过程可概括为：

```text
import(目标模块)
  → 确定需要的 chunk ID
  → 若已加载则复用，否则缓存本次 Promise
  → publicPath + chunkFilename(chunkId)
  → 插入 script
  → chunk 向约定的全局数组提交模块 factory
  → runtime 把 factory 登记到自己的表，结束等待
  → 执行目标模块，返回导出
```

关键是“下载成功”与“登记到等待者的 runtime”不同。网络脚本取到了，但没有用等待者期待的 chunk 协议登记，仍可出现 missing／ChunkLoadError。固定 [JsonpChunkLoadingRuntimeModule.js](https://github.com/webpack/webpack/blob/v5.94.0/lib/web/JsonpChunkLoadingRuntimeModule.js) 同时维护 installedChunks、加载 Promise、URL 和回调登记，因此值得从这里逐段阅读。

## 10. 两个 Webpack 应用的冲突为何不只是 window.foo

### publicPath 决定动态资源从哪里取

Webpack runtime 用 publicPath 拼接 chunk 文件名；`publicPath:'auto'` 会根据输出模式尝试从脚本自身地址等上下文推导。固定 [AutoPublicPathRuntimeModule.js](https://github.com/webpack/webpack/blob/v5.94.0/lib/runtime/AutoPublicPathRuntimeModule.js) 区分 module 的 import.meta 与 classic 场景的 currentScript 等路径。

若一个加载器抽出文本、换一种执行方式，又没有保留脚本来源上下文，自动推导就可能错误或无法完成。修正可能是保持真实脚本身份，也可能是显式约定资源根；不应依赖文档中“看起来有个 script”这种视觉判断。初始化顺序也重要：若某个依赖在 publicPath 设置前就触发动态加载，事后再赋正确值已经太晚。参照 [Webpack public path](https://webpack.js.org/guides/public-path/)。

### chunkLoadingGlobal 是构建运行协议的命名空间

假设 A/B 的 classic runtime 都监听同一个全局数组，并且 chunk ID／module ID 也有重叠。B 下载的 chunk 可能进入 A 的登记链，污染工厂表、提前满足错误的 Promise，或产生依赖缺失。并非两个应用的业务变量没有重名就安全。

Webpack 5 的 output defaults 会从输出库名或 package name 等信息确定 uniqueName，再形成默认 hotUpdateGlobal／chunkLoadingGlobal。固定 [defaults.js](https://github.com/webpack/webpack/blob/v5.94.0/lib/config/defaults.js) 能看清两者关系；不能只记一个字符串推荐值。

```js
// 两个独立构建应各有不同身份；示例只表达相关配置。
output: {
  uniqueName: 'reader_player_build_a',
  chunkLoadingGlobal: 'webpackChunkReaderPlayerA',
}
```

这类配置减少 runtime 命名碰撞，却不提供 DOM、CSS、路由或权限隔离。独立运行的 B 还需要自己的 root 和清理协议。反过来，一层全局 Proxy 也未必能完整处理 runtime 取得原始对象、跨构建引用及不同输出格式的所有情况。

### UMD 只描述导出方式

UMD 包装可根据环境把库暴露给 CommonJS、AMD 或某个全局名。它不自动具有应用 `mount/unmount`，也不会自动知道 DOM 容器。文件是 UMD 格式与某个框架定义的 UMD 生命周期模式必须分开：一个是产物包装，一个是应用接入合同。

## 11. Module Federation：把跨构建链接延迟到运行时

普通打包时，模块大多在一个构建上下文中解析。Module Federation 允许一个构建在运行时连接另一个容器提供的模块。它改变了模块的取得、共享与版本协商方式；它没有因此创建一个独立浏览器安全环境。

典型容器消费链可以缩成三阶段：

```text
加载 remoteEntry，使容器对象存在
  → init(同一个共享 scope 对象)，建立共享依赖关系
  → get('./Player')，等待该暴露模块需要的 chunk
  → 获得 factory，再执行 factory 取得模块导出
  → 调用应用自己的 mount(容器, 能力)，并持有返回的清理责任
```

最后一步是应用架构需要提供的合同，不是 Federation 自动替你添加的。fixed [ContainerEntryModule.js](https://github.com/webpack/webpack/blob/v5.94.0/lib/container/ContainerEntryModule.js) 生成 get/init：get 查暴露映射并返回 factory；init 设置共享 scope，遇到与先前不同的 scope 对象会拒绝，避免容器被无声换到另一套共享关系。

因此，重复打开一个播放器不应盲目重复加载 remoteEntry 或拿新对象反复 init。应分别管理“容器连接一次”和“应用实例挂载多次”。这里的状态与 app root、业务数据又是不同层。

### shared 的三个问题必须同时回答

1. **谁提供什么版本？** shared scope 保存可用模块及版本，消费者有自己的版本范围。
2. **谁消费哪一份？** singleton、requiredVersion、strictVersion、eager 及已加载状态参与选择，具体行为必须核对配置与 runtime。
3. **拿到同一份之后共享了什么？** 它可能是框架模块、Context 定义、状态库或其他带身份的对象，不能只按文件大小决定共享。

`singleton:true` 的约束有 scope 与模块 key 的范围，不是全浏览器强制同一对象。某个应用若未加入相同 scope，或把另一份依赖完全打进私有包里，不能据配置文字断言它也使用了这个单例。版本不满足时究竟警告、失败还是走本地 fallback，要结合 strictVersion 等配置，不能把所有情况概括成“自动选最新版”。依据见 [插件选项](https://webpack.js.org/plugins/module-federation-plugin/) 与固定 [ConsumeSharedRuntimeModule.js](https://github.com/webpack/webpack/blob/v5.94.0/lib/sharing/ConsumeSharedRuntimeModule.js)。

`eager:true` 也不是普遍性能优化：它改变共享模块的可用时机与打包／加载边界，可能把本可延后的依赖提前。若初始化之前就同步消费共享模块，首先检查启动是否需要异步边界，而非给所有依赖加 eager。官方 [Module Federation](https://webpack.js.org/concepts/module-federation/) 给出异步 bootstrap 的背景。

### React 副本：为什么“各带一份”和“必须单例”都不能当万能规则

A/B 各自完全独立渲染、自己的 React 配自己的 renderer，可以存在多份框架。危险情况是把由 React A 语义创建／消费的组件、Hooks 或 Context，交给依赖 React B 的 renderer／调用链。

React 18 的 Hook 入口会读取该 React 副本的当前 dispatcher。renderer 设置 A 的 dispatcher 时，组件若从 B 调 useState，B 的 dispatcher 未必正在渲染，可能触发 invalid hook call。即使版本号完全相同，两次实例化的模块对象也可能不同。共享 React 与 ReactDOM 的版本／实例关系需要整体设计。

Context 还多一层身份：Provider 与 Consumer 要引用同一个 Context 对象。只共享 React，却把定义 Context 的业务模块分别构建两次，不能据此保证两边 Context 通了。源码依据可从 [React 18.3.1 Hooks](https://github.com/facebook/react/blob/v18.3.1/packages/react/src/ReactHooks.js) 与框架基础章继续跟踪。

**架构推论：** 跨边界传递序列化数据、框架组件、DOM 节点或可调用能力，分别要求不同的依赖身份协议。决定传什么，往往比决定“所有库是否都 singleton”更早。

## 12. 为什么 dev 成功不能代替生产验收

| 看似相同的动作 | 开发路径 | 生产路径 | 需要单独验证的原因 |
| --- | --- | --- | --- |
| 取得入口 | HTML transform、client、preamble | 构建 HTML、散列入口、可能的 legacy 分支 | 宿主若跳过开发 HTML，可能缺开发协议；生产又没有这些补丁 |
| 请求依赖 | esbuild 优化 ESM／按需源码 | Rollup chunk／部署缓存 | 图结构、URL 与缓存身份不同 |
| 取得 CSS | 可表现为注入 style 的 JS 模块 | 独立 CSS 与异步加载等待 | DOM 插入位置、时序和失败路径不同 |
| 改一个组件 | HMR／Fast Refresh／Vue HMR | 发布新版本或重新挂载 | 热更新的状态保留不是 mount/unmount 合同 |
| 动态 import | dev server 现算目标 | 旧页面引用固定的散列 chunk | 发布清理旧资产可能让已打开页面失效 |
| 跑旧浏览器 | dev 常假设现代能力 | 可能有 legacy chunk／polyfill | 语法转换不自动覆盖所有运行 API |

本仓库还有一个明确事实：[PC 配置](../../packages/pc-ui/vite.config.ts) 与 [Mobile 配置](../../packages/mobile-ui/vite.config.ts) 都有 `/v0.5` base，但移动配置启用了 legacy，并显式设置 `renderModernChunks:false`、`renderLegacyChunks:true`。不能只因二者使用 Vite，就宣布实际输出和加载链完全相同；最终应检查各自构建产物。

Vite 5 的 `vite:preloadError` 可帮助观察动态依赖失败，但一律全页刷新只是某种恢复策略，不是通用根因修复。旧入口与旧 chunk 的引用关系、资源保留窗口、缓存与回退单元才是发布设计必须回答的问题。对应背景见 [固定版 load error handling](https://github.com/vitejs/vite/blob/v5.4.3/docs/guide/build.md)。

## 13. 顺着三段源码，理解为什么这样实现

第一次只读下列三段，不从整个仓库逐行开始。

| 路径 | 先追哪组输入输出 | 阅读时的关键问题 |
| --- | --- | --- |
| [Vite 5 importAnalysis.ts](https://github.com/vitejs/vite/blob/v5.4.3/packages/vite/src/node/plugins/importAnalysis.ts) | 源 import 字符串 → resolve 结果 → 浏览器可请求 URL | bare import、虚拟模块、外部文件、query 与 base 分别在哪里进入？ |
| [Vite 5 importAnalysisBuild.ts](https://github.com/vitejs/vite/blob/v5.4.3/packages/vite/src/node/plugins/importAnalysisBuild.ts) | 动态 import → chunk 依赖／CSS → preload 包装 | 何时等待 CSS，错误怎样传回，为什么只观察 JS 200 不够？ |
| [Webpack 5 JsonpChunkLoadingRuntimeModule](https://github.com/webpack/webpack/blob/v5.94.0/lib/web/JsonpChunkLoadingRuntimeModule.js) | chunk ID → URL／Promise → factory 登记 | module cache 与 installedChunks 是不是一份表？脚本 load 与目标登记如何区分？ |

跟完后再读 ContainerEntryModule 的 get/init 和 ConsumeSharedRuntimeModule 的版本选择。先把“怎么加载一个模块”讲清，再进入“共享哪个副本”；否则容易把 Federation 配置当黑箱魔法。

### 一条源 import 的微型走读

在 Vite import analysis 中，按语义可以分为：解析 specifier → resolve 模块 ID → 转为 URL → 对资源增加需要的 query → 处理版本／HMR 信息 → 拼接 base → 记录图关系并返回转换代码。这是阅读路线，不是声称所有 import 都严格走相同分支。

先拿 `./logo.svg` 作为输入，解释为什么需要 `?import`：请求者需要一个返回 URL 的 JS 模块，而不是把 SVG XML 当 JavaScript 解析。再拿 CSS 比较：开发响应可以执行注入 style；生产关联 CSS 由另一条链取得。能解释这两个输入，就已经比“Vite 支持静态资源”深入一层。

## 14. 从这些机制推导通用微前端加载合同

现在才开始问微前端架构该设计什么，不预设某个实现已经替你做好。

| 合同 | 必须写明的输入与边界 |
| --- | --- |
| 产物类型 | 原生 ESM、classic script、UMD、Webpack runtime、Federation 容器，不能只填“React/Vue” |
| 资源定位 | 入口、模块依赖、CSS 资源、Worker、publicPath/base；业务路由另列 |
| 模块身份 | 是按 URL 复用、按 runtime cache 复用，还是同一共享 scope 提供依赖 |
| 框架边界 | 组件能否跨应用传递；框架与 renderer 如何配对；Context／状态对象是否跨界 |
| 生命周期 | 定义模块执行一次与应用实例挂多次的关系；mount 返回什么，unmount 释放什么 |
| 开发接入 | Vite client、preamble、HMR socket、框架更新器；不能把生产入口协议原样套过去 |
| 发布与回退 | entry 与后继 chunk／CSS 同版可取；旧页面的散列引用如何保留 |
| 加载失败 | 传输、解析、链接、执行、CSS 等待、共享版本不满足分别怎样诊断与恢复 |

后面的架构卷会把这些合同组合成运行时设计；再到实现卷逐项检查 MicroApp 具体选择了哪些机制、哪些路径没有接管。这样得到的是评估实现的能力，而不仅是记忆选项。

## 15. 实验与参考推理

基础浏览器实验从 [FOUNDATION-EXPERIMENTS](../FOUNDATION-EXPERIMENTS.md) 开始；这里再增加一次真实工具链观察：

```powershell
node microfrontend-handbook/scripts/inspect-toolchain.mjs
```

脚本只复用已安装工具，临时目录中生成夹具与缓存，构建 `write:false`，结束后关闭服务并清理自己的临时目录。它不安装依赖、不改 packages、不构建 PC／Mobile，也不证明浏览器 HMR 或 Federation 实际执行。版本和七项断言保存在 [toolchain-inspection.json](../evidence/toolchain-inspection.json)。缺少所需本地工具时应明确失败，不改用远端 CDN 冒充当前版本。

### 练习 A：只把入口 URL 改到 CDN，为什么懒加载仍错？

<details>
<summary>先画 URL 图，再对照推理</summary>

至少画出 HTML → main、main → lazy、lazy → shared、lazy → CSS、CSS → font 五类边。判断各边由浏览器原生模块解析、构建预加载助手、CSS URL 规则还是 Webpack runtime 发起；再检查它的基址。只改第一条 script.src，无法证明余下边也指向 CDN。若产物 publicPath/base 已经正确，才进一步检查请求权限、MIME 和资源是否存在。

通过条件是能指出最早一条错误边及其地址计算者，而不是先全局替换所有 `/`。

</details>

### 练习 B：相同 React 版本为何仍出现 Hook 错误？

<details>
<summary>按对象身份与调用链解释</summary>

版本字符串相同不保证模块实例相同。先确认 renderer 与组件调用 Hook 所引用的 React 是否是同一个副本；再区分是否真的是重复副本，还是违反 Hook 调用规则等另一原因。两个完全独立 root 各带自洽框架可以工作，问题集中在跨边界混用。若用 Federation，共享 scope 与 key 是否相同、是否存在私有副本，也要取证。Context 值不通还要检查 Context 定义对象本身是否同一份。

不能用“全部 singleton”跳过证据；它可能掩盖实际组件边界并引入新的版本耦合。

</details>

### 练习 C：开发样式正常，生产某路由打开却一直等待？

<details>
<summary>区分样式注入与生产预加载</summary>

开发 CSS 可能作为 JS 注入；生产异步 chunk 的 CSS 是独立资源，预加载助手会等待相关 CSS 的结果。先查触发 import 后新增的 link、CSS 请求与错误，再查目标 JS。验证应同时记录动态 chunk 和其 CSS 的完成／失败，不能把 JS 200 当成整个模块链已就绪。具体产物还应与构建配置、CSS 拆分开关互证。

</details>

### 练习 D：两个 Webpack 子应用都能单独打开，合在同页才随机失败？

<details>
<summary>从 runtime 协议提出可证伪假设</summary>

先记录构建 uniqueName、chunkLoadingGlobal、publicPath、实际 chunk ID 与全局登记；检查两个 runtime 是否接入同一数组及是否有 ID 碰撞。与 DOM 错根、共享业务对象、同名 CSS 作为竞争假设区分。给两个构建明确身份后仍要回归动态加载、HMR 和 Federation 共享，不宣称一个命名字段解决了所有隔离。

</details>
