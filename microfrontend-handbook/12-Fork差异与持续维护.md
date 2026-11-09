# 12 Fork 差异与持续维护

接管一个复杂框架，第一步是缩小自己实际需要负责的变化范围。本地 MicroApp 的大部分运行机制仍与 rc.8 原版一致，当前定制集中在资源地址补全和路由初始地址处理。需要维护的还包括测试、类型、构建产物和平台适配，它们决定源码修复能否真正落到用户浏览器里。

本章的“已核对”来自 2026-11-09 的静态源码和固定上游归档对照；“建议”是后续实施方案，本轮没有修改运行时代码或重新发布包。

## 接管顺序：先让变更能够被证明

本章适合在完成一次 [案例演练](CASE-STUDY.md) 后阅读。接管工作按依赖推进，单人维护不必同时启动多条重构。

| 顺序 | 先交付什么 | 何时可以进入下一步 |
| --- | --- | --- |
| P0：可识别 | 固定原版 SHA、公司补丁差异、实际 lib／声明入口与消费者路径 | 能说清当前浏览器执行哪份构建；第 01 章与 sources.json 提供起点 |
| P0：可验证 | 恢复固定版本测试夹具，确认 Jest 真正发现用例；保留最小浏览器样本 | 一个改动能展示修前失败、修后通过；本书实验台只是机制样本，不替代缺失的上游测试 |
| P1：可修补 | 针对真实故障补输入输出契约和最小补丁 | 影响范围与回退对象明确，双应用／卸载等相关用例通过 |
| P2：可演进 | 再评估把平台 URL 规则移出内核、增强类型或调整接口 | 已有正常与异常样本保护；迁移成本和版本兼容方案明确 |

建议给每次内核变更设一个可审查的预算：一个主因果链、一组受影响契约、一份复现与回归记录。遇到同时要改 URL、路由、通信、SDK 的补丁，先拆问题；确有跨层原因时，说明各层为何不可分，而不是只为减少文件数硬拆。

没有足够证据时，可以继续补最小复现；不把“先整体升级试试看”作为诊断结果。保持四处现有业务定制可回归，比立刻重写整套沙箱更能控制接管成本。

## 1. 差异基线和比较范围

原版基线：`jd-opensource/micro-app@1d3802735266cd14958601609a51ef2d23b1e915`，对应 `v1.0.0-rc.8` 和 npm 同版本 `gitHead`。来源核验见 [第 1 章](./01-资料来源与版本基线.md)。

比较时忽略 CRLF/LF 差异，保留代码、注释和空白行差异；没有用“本地版本号相同”代替内容对照。以下是 **`src` 内的全部 7 个文本差异文件**，不表示整个包只有这些差异。

| 本地文件／函数 | 与原版相比 | 分类 |
| --- | --- | --- |
| [libs/utils.ts](../packages/micro-app2/src/libs/utils.ts) / `CompletionPath` | 遇到包含 `window.fileHost` 的基址时，增加专用 pathname 拼接分支 | 行为修改 |
| [sandbox/iframe/index.ts](../packages/micro-app2/src/sandbox/iframe/index.ts) / 构造函数 | 传给 `patchRouter` 的文件服务 URL 截至 `window.HOST_END` | 行为修改 |
| [sandbox/with/index.ts](../packages/micro-app2/src/sandbox/with/index.ts) / 构造函数 | 传给 `patchRouter` 的文件服务 URL 截至 `window.fileHost` | 行为修改 |
| [sandbox/router/index.ts](../packages/micro-app2/src/sandbox/router/index.ts) / `clearRouteStateFromURL` | 重置路由时，把文件服务入口 URL 截至 `window.HOST_END` | 行为修改 |
| [sandbox/router/location.ts](../packages/micro-app2/src/sandbox/router/location.ts) | 增加 eslint 注释和注释掉的日志 | 无执行行为变化 |
| [sandbox/scoped_css.ts](../packages/micro-app2/src/sandbox/scoped_css.ts) | 注释、空白行变化 | 无执行行为变化 |
| [source/patch.ts](../packages/micro-app2/src/source/patch.ts) | 删除空白行 | 无执行行为变化 |

其中 `scoped_css.ts` 虽然没有语义修改，却调用了被修改的 `CompletionPath`，所以 CSS `url(...)` 的最终行为仍会间接受到影响。“本文件没改”不代表“不需要回归”。

其余 34 个非测试 `.ts` 文件在换行归一化后与该上游基线一致，包括 `source/scripts.ts`、`source/fetch.ts`、通信中心，以及大部分沙箱代理实现。`src/index.ts` 和 `src/polyfill/jsx-custom-event.ts` 在上游 tag 中也存在，不能因 npm 主包 sourcemap 没列出来就当成新文件。

上游固定源码：[CompletionPath](https://github.com/jd-opensource/micro-app/blob/1d3802735266cd14958601609a51ef2d23b1e915/src/libs/utils.ts)、[iframe 初始化](https://github.com/jd-opensource/micro-app/blob/1d3802735266cd14958601609a51ef2d23b1e915/src/sandbox/iframe/index.ts)、[with 初始化](https://github.com/jd-opensource/micro-app/blob/1d3802735266cd14958601609a51ef2d23b1e915/src/sandbox/with/index.ts)、[路由重置](https://github.com/jd-opensource/micro-app/blob/1d3802735266cd14958601609a51ef2d23b1e915/src/sandbox/router/index.ts)。

## 2. 四处 URL 改造分别解决哪一层问题

### 2.1 文件服务入口不是普通静态目录

普通站点中，`https://child.example/app/index.html` 的 JS、CSS 常由同目录和标准 URL 解析得到。Freelog 入口还承载展品、依赖身份和文件服务路径，平台要把某些“看起来是根路径”的资源转换到对应入口下。理解具体入口组成应结合 [freelogFetch](../packages/freelog-runtime-core/src/structure/freelogFetch.ts) 和 [widget.ts](../packages/freelog-runtime-core/src/structure/widget.ts)，不要仅凭 `.js` 后缀推断整段 URL 都是普通文件路径。

本地全局配置来自：

- [runtime-api/config/env.ts](../packages/freelog-runtime-api/src/config/env.ts)：根据页面域名设置 `window.HOST_END`。
- [runtime-api/config/urls.ts](../packages/freelog-runtime-api/src/config/urls.ts)：构造 `urls.fileHost`。
- [runtime-core/structure/freelogFetch.ts](../packages/freelog-runtime-core/src/structure/freelogFetch.ts)：设置 `window.fileHost = urls.fileHost`。

这造成一条隐式依赖：MicroApp 的四处定制不再只是通用 URL 运算，还依赖平台模块提前初始化的全局字段。它是现状，不代表应该把更多业务规则继续写进沙箱。

### 2.2 `CompletionPath`：资源归一化

本地专用分支的实质是：在文件服务场景，取 `baseUrl.pathname + path` 后再构造 URL。`./` 会先移除开头的点；带协议、`data:`、`blob:` 的路径在前面的原有分支已经返回。

这样做可能是为了保留入口前缀，但行为不等价于标准 `new URL(path, base)`。例如，在基址 pathname 不以 `/` 结尾时，`assets/a.js` 是直接字符串拼接，可能得到 `...entryassets/a.js`。这是从实现推导的边界，是否属于真实业务错误，要先用实际入口形态验证。

**建议方案**：先把“展品入口”“包内相对文件”“标准绝对资源 URL”的契约写成表格，再实现地址归一化函数。保留现有正常样本，覆盖异常样本；不要先全局换成 `new URL()`，再猜哪些业务要补回来。

### 2.3 沙箱初始路由：把资源路径与业务页面路径分开

with 模式按 `fileHost` 截断，iframe 模式按 `HOST_END` 截断。对于当前常见 `https://file.<环境域名>/...` 输入，它们可能都得到文件服务 origin；但两段字符串算法不具备相同的普遍性。

**待验证边界**：带端口、代理路径、新文件域名、域名片段意外出现在路径里、缺失初始化字段。如果将来文件服务迁移到不同主机，四处逻辑可能一起受影响。

**建议方案**：把“用于下载资源的入口 URL”与“子应用应该看到的路由基址”作为两个明确输入，在平台适配层计算后交给通用内核。是否需要修改接口，应以用例和对上游合并成本的评估为依据；这里尚未实施这一重构。

### 2.4 路由重置：修初次进入还不够

`clearRouteStateFromURL` 的修改处理普通卸载或路由状态清理后的初始位置。若只改沙箱创建、不改重置，第一次进入和再次挂载可能使用不同基址。因此回归必须覆盖“首次进入 → 深层导航 → 卸载 → 重建”，不能只看首页能渲染。

## 3. 把这份 URL 用例表变成可执行回归

以下是建议的测试矩阵；不是已通过的测试报告。

| 输入维度 | 至少包含的样本 | 断言对象 |
| --- | --- | --- |
| 基址来源 | 实际生产文件入口、dev 文件入口、普通本地开发地址 | 输出 URL 是否仍指向正确服务和应用 |
| 文件名 | `/assets/a.js`、`./assets/a.js`、`assets/a.js`、`../assets/a.js` | 平台前缀与目录层级是否符合业务契约 |
| 标准 URL | `https://cdn.example/a.js`、`//cdn.example/a.js`、`data:`、`blob:` | 专用分支不应意外改写这些地址 |
| 分隔符 | 基址末尾有 `/`、无 `/`、带 query | 不出现缺失 `/`、错误双斜杠或身份参数丢失 |
| 资源种类 | HTML 的 script/link/img、CSS `url()`、动态插入资源 | 静态与动态路径最终一致 |
| 路由状态 | 首挂、刷新、push/replace、后退、卸载后重建 | 资源入口路径不变成页面路由 |
| 沙箱类型 | with、iframe | 两类模式均满足各自契约，差异有解释 |
| 异常配置 | `fileHost` 未初始化、空字符串、非预期主机 | 明确失败或走受控兜底，不悄悄污染其他 URL |

第一批用例应取自一个已知正常主题和一个已知正常插件，保存脱敏后的入口、输入和期望输出。不能把当前算法输出直接复制成“正确答案”；期望值必须来自可访问的实际资源及平台契约。

单元测试验证 URL 字符串；真实浏览器测试验证请求、CORS、模块加载和导航。两者互补。比如字符串结果正确，并不能证明跨域凭据请求会被服务端允许。

## 4. 测试接管是当前最明确的缺口

**已核对**：固定 rc.8 上游 `src/__tests__` 有 24 个 `*.test.ts` 及 fixtures，本地该目录不存在；本地 [jest.config.js](../packages/micro-app2/jest.config.js) 仍然引用其中 7 个具体测试路径。[package.json](../packages/micro-app2/package.json) 也仍保留 `test`、`test:unit` 等脚本。

因此，“有 test 命令”与“有可执行测试”之间存在缺口。`jest --passWithNoTests` 不能证明内核稳定，本手册不把这类结果当验收。

建议按三步恢复：

1. 从固定 SHA 恢复原版测试和 fixtures，先让旧基线在受控环境下运行；记录依赖、Node、浏览器条件。不要直接拿最新主分支测试去要求 rc.8 通过。
2. 根据本地定制补充 URL、文件服务和路由重置测试。核对 Jest `testMatch`，确保新增用例真的被发现；上游文件存在不代表当前配置会运行全部 24 个。
3. 为真实 iframe、ES module、History、跨域请求和内存生命周期增加浏览器层验证。旧 Jest/jsdom 测试不能覆盖所有浏览器行为。

可追溯恢复源：[rc.8 测试目录](https://github.com/jd-opensource/micro-app/tree/1d3802735266cd14958601609a51ef2d23b1e915/src/__tests__)。恢复工作属于后续代码变更，本轮没有复制测试或改变测试配置。

## 5. 源码、JS 产物和类型必须一起验收

### 5.1 业务消费的是 `lib`

[pnpm-lock.yaml](../pnpm-lock.yaml) 把 `runtime-core`、PC UI、移动 UI 的 `@micro-zoe/micro-app` 链接到 `../micro-app2`。但 workspace 只解决包的位置，包内入口仍由 `module/main` 决定。

```mermaid
flowchart LR
    A[修改 micro-app2/src] --> B[Rollup 构建]
    B --> C[lib/index.esm.js 等产物]
    C --> D[workspace 包解析]
    D --> E[runtime-core / PC UI / 移动 UI]
    E --> F[页面构建与浏览器验证]
```

现有 [PC Vite 配置](../packages/pc-ui/vite.config.ts)、[移动 Vite 配置](../packages/mobile-ui/vite.config.ts) 没有将 MicroApp 显式 alias 到 `src`；不要假定改源码后 Vite HMR 会自动使用新实现。应先确认实际构建解析路径和产物更新时间。

[rollup.config.js](../packages/micro-app2/rollup.config.js) 在加载配置时会清空 `lib`、`polyfill`。开发 watch 主要生成 ESM，生产 build 还生成 CJS/UMD。不能中断一次清空后的构建，又把残缺目录当成完整发行产物。

### 5.2 类型入口和生成位置存在漂移风险

本地相对上游还改了以下构建约定：

| 位置 | 本地变化 | 维护含义 |
| --- | --- | --- |
| `package.json` 的 `types` | 从 `lib/index.d.ts` 改为 `typings/index.d.ts` | TypeScript 消费入口变化 |
| `package.json` 的 `build` | 增加 `tsc --declaration --emitDeclarationOnly --outDir lib` | 生成流程与原版不同 |
| `package.json` 的开发依赖 | 增加 `tslib` | 要随 lockfile 一起复现 |
| [scripts/create_type.js](../packages/micro-app2/scripts/create_type.js) | 输入改为 `lib/index.d.ts`，输出也仍在 `lib/index.d.ts` | build 没有明显把结果同步到 `typings/index.d.ts` |
| [typings/window.d.ts](../packages/micro-app2/typings/window.d.ts) | 本地新增平台 Window 字段 | 通用包类型显式依赖平台全局配置 |
| [typings/index.d.ts](../packages/micro-app2/typings/index.d.ts) | 本地额外保留一份打包声明 | 需要确定谁拥有、怎样生成 |

本次读取时，`lib/index.d.ts` 与 `typings/index.d.ts` 的 SHA-256 不同。**字节不同只证明存在两份不同内容，不足以证明 API 不兼容。** 但消费者读的是后者，验收不能只查看前者生成成功。

建议后续明确一个类型生成来源：要么调整发布入口与生成位置一致，要么提供确定、可检查的同步步骤。随后用一个真实消费者做类型检查，验证其 import、`renderApp`、router 和配置类型。不要靠手工修改生成声明长期维护。

### 5.3 一次补丁的产物检查

下面是后续代码补丁流程，执行前应确认工作树及产物改动边界：

```powershell
# 仓库根目录：先查看当前变更
git status --short

# 进入包后只列举测试：验证测试是否真的存在
pnpm --dir packages/micro-app2 exec jest --listTests --runInBand

# 以下命令会重新生成 lib/polyfill，属于代码补丁验证步骤
pnpm --dir packages/micro-app2 exec tsc --noEmit
pnpm --dir packages/micro-app2 run build

# 检查源码、声明和产物是否都在预期变更中
git diff --stat -- packages/micro-app2
```

恢复测试后再运行相应定向测试，并对所有受影响的消费者执行它们自己的 build/typecheck。单独 `micro-app2 build` 成功不等于整个平台可用。

## 6. 单人维护的变更方法

### 6.1 每次只证明一个因果链

一个问题记录至少包含：

```text
触发：哪个主题/插件、浏览器、沙箱、路由模式、入口形态
现象：预期行为与实际行为
最小复现：最少 HTML/JS/CSS、操作顺序、脱敏后的请求
定位：函数调用链、输入、输出、失效的不变量
补丁：修改哪一层，为什么需要改内核
回归：修复前失败、修复后通过，以及正常样本保持通过
产物：源码提交、lib/类型生成结果、消费者构建
回滚：上一个可用 runtime 构建与对应配置
```

这个记录比“升级后好像好了”更有价值：以后同类问题能直接复用复现，而不必再次读完整个沙箱。

### 6.2 优先在最接近责任的位置修复

| 责任范围 | 合适的位置 | 例子 |
| --- | --- | --- |
| 单个主题／插件自己的生命周期 | 子应用 | 忘记销毁 WebSocket、图表、监听器 |
| 公司业务身份与文件服务映射 | runtime-core/runtime-api 适配层 | 入口身份、授权请求、文件路径 |
| 单个历史依赖的兼容 | 有范围的 MicroApp 插件配置 | 特定脚本顶层变量兼容 |
| 所有子应用都可能遇到的框架缺陷 | micro-app2 内核 | 动态节点归属错误、路由状态错误 |

这是一条设计建议，不能为迁移而迁移。已有四处定制在内核里，先通过回归锁住，再评估能否移到平台层；不要一边恢复测试一边大范围重构。

## 7. 选择性吸收上游补丁

本次查到的上游仍有活动，但本地停留在 rc.8，不能直接把最新 `src` 覆盖进来。每个候选补丁应回答：

1. 它修复的具体触发条件是什么，本地能否复现？
2. 它依赖哪些先行提交、类型或资源缓存结构？
3. 是否触及四处 URL 定制、平台 SDK 注入、共享事件或全局 DOM patch？
4. 能否把最小修复和对应测试单独移植，而非整版本替换？
5. with、iframe、主题、插件、PC、移动端哪些组合需要回归？

补丁台账建议记录 `upstream SHA → 本地 SHA → 复现 → 测试 → 适用平台版本`。本次没有执行升级或合并；最新版本号只是研究线索，不是采用结论。

## 8. 版本和回滚最少要保留什么

建议在后续工程工作中，为内部运行时建立可辨识版本或构建元信息，至少包含原版 SHA、公司补丁 SHA、构建时间和依赖锁定信息。仅显示 `1.0.0-rc.8` 无法区别不同公司补丁产物。

一个可回滚单元应同时保留：MicroApp JS 与声明产物、runtime-core/runtime-api、PC/移动入口构建、配置及对应资源引用。如果只退一个压缩 JS，却保留新版数据结构或缓存策略，可能造成新的不兼容。

发布前保留旧静态构建，先用一个主题和一个插件进行定向验收；发布后根据生命周期错误、资源失败和异常增长情况决定是否扩大。不要把缓存刷新当作唯一恢复方法：先确定请求究竟命中了哪个版本的构建。

## 9. 本章学习验收

能独立完成以下任务，才算掌握了“维护 fork”的起点：

- 给定一次路径错误，能判断问题在 `CompletionPath`、平台 fetch、子应用 publicPath 还是服务端响应。
- 解释为什么四处定制要同时覆盖初次创建与路由清理。
- 从固定上游 SHA 恢复原版对照，明确哪些测试被 Jest 发现。
- 证明浏览器消费了刚生成的 JS，消费者读取了正确的类型入口。
- 为一次最小补丁写出复现、回归范围和完整回滚对象。

这些能力建立后，才能更有把握地处理更深的沙箱或 DOM patch 问题，而不必把整个框架一次性重写。
