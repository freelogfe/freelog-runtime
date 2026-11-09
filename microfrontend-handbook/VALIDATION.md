# 第三版验证：底层技术与独立架构

日期：2026-11-09，Asia/Shanghai。当前课程顺序为底层技术→独立架构→MicroApp实现→维护。本节记录本轮新证据；下方折叠区保留第二版历史，不能把旧版数量当成当前统计。

## 本轮已执行

| 范围 | 结果 | 实际证明 |
| --- | --- | --- |
| 文档与依据 | 36份Markdown、本地链接/锚点/围栏/折叠通过；17个Mermaid语法通过；95份原有+13份新增来源摘要一致 | 结构与基线，不等于所有技术行为均有运行验证 |
| 原有回归 | 原有12项Node测试与两个正文教学输出通过 | 保留已有学习反馈和服务合同 |
| 独立ESM运行时 | 新增9项Node合同测试通过 | 同定义多实例、取消前后、name/container租约、旧句柄、挂载与cleanup失败、HTTP边界 |
| 实际工具链 | 7项Vite／React插件／SFC检查通过 | 真实dev响应、esbuild依赖、Refresh前导、JSX/CSS模块转换、Rollup生产图/manifest/base、SFC编译 |
| Vue正文样本 | 3项检查通过 | 真实模板编译、scope批处理/停止、从正文提取的适配器jsdom执行 |
| 不依赖MicroApp的真实浏览器 | Headless Edge 139.0.3405.102，7项通过 | 原生模块身份与live binding、手写双实例、React多root/StrictMode/Portal/退出重挂、Vue更新/provide/Teleport/scope/重挂、390px布局 |
| 范围保护 | 原有源码/文档站摘要对照未变化 | 本轮修改限手册与教学样本，不运行平台生产构建或部署 |

以上不是一个统一“全部测试通过”的数字：Node合同、构建响应、jsdom、浏览器、平台是不同证据层。已有第二版MicroApp浏览器报告保留，原引擎与原样本未改；本轮新增浏览器检查不加载MicroApp。

## 可审阅报告

- [工具链响应与产物](evidence/toolchain-inspection.json)：固定Vite5.4.3、plugin-react4.3.1、React18.3.1、Rollup4.21.2、esbuild0.21.5，SFC编译器3.5.44。
- [底层真实浏览器](evidence/foundations-browser.json)：记录React/ReactDOM18.3.1、Vue3.5.44实际本地文件SHA及教学代码SHA，保留观察值。
- [Vue正文／jsdom](evidence/vue-examples.json)：与真实浏览器严格区分。
- [底层页面截图](evidence/foundations-desktop.png)：已查看桌面布局；窄屏另做横向溢出断言。
- 官方资料及固定源码依据在research四份台账，原有sources.json未覆盖式刷新；technical-sources.json仅增加本轮本地技术依据。

## 重跑命令

在仓库根目录执行，复用已有依赖，不自动安装：

```powershell
node microfrontend-handbook/scripts/verify.mjs
node microfrontend-handbook/scripts/check-diagrams.mjs
node --test microfrontend-handbook/examples/pending-result.test.mjs microfrontend-handbook/labs/server.test.mjs microfrontend-handbook/scripts/markdown-check.test.mjs microfrontend-handbook/foundations-lab/runtime.test.mjs
node microfrontend-handbook/scripts/inspect-toolchain.mjs
node microfrontend-handbook/scripts/check-vue-examples.mjs
node microfrontend-handbook/scripts/check-foundations-browser.mjs
```

基础链接/摘要检查也会核对本地已安装资料的文件；新机器缺依赖会如实失败，先按既有锁文件准备，不改用CDN。图表/jsdom需要工作区现成包；真实浏览器脚本使用已有Edge/Chrome或HANDBOOK_BROWSER，单独临时配置与端口，结束关闭。

## 审阅中实际闭合的架构缺口

最初教学host只保护name，架构文字却要求container租约。三路独立审阅用同一容器、两个不同name实际复现双占用。先补失败断言，再增加容器WeakMap租约：正常退出释放、旧句柄不能释放新记录、cleanup失败保留占用；最终9项合同与7项浏览器检查通过。容器校验仍只证明对象引用存在和排他，完整DOM能力与可分配区域另由适配器/宿主保证，正文已明示。

## 未执行、不能外推

重复React Hook/renderer混配、重复Vue追踪、Vue KeepAlive、Shadow DOM/CSSOM、top-level await完整失败矩阵、完整浏览器HMR/Fast Refresh、Module Federation实际共享协商、生产legacy、跨源/CSP/Cookie、后退/分享/刷新完整矩阵、hydration、多浏览器及真实Freelog节点授权未在本轮全部运行。

这些已有官方/源码推导或实验建议，不能因此填为通过。原有MicroApp核心测试目录缺失仍未修复，也没有把教学host当生产替代品。packages的业务lint/typecheck/build未运行，因为业务代码和产物不在本次修改范围；新增JS/MJS做语法与针对性执行检查。

自动审批以 rejected: blocked by policy 拒绝了一次旧工具链探针临时目录清理，命令未启动；旧候选目录保留在OS temp。没有改用其他方式删除，仓库交付不受影响。

<details>
<summary>第二版历史验证记录</summary>

# 第二版验证记录

验证日期：2026-11-09，Asia/Shanghai。本轮优化对象为手册、教学样本与其检查脚本，运行时代码及既有文档站未修改。以下将机制实验、教学模型和平台验证分开记录。

## 1. 本轮实际通过了什么

| 对象 | 实际检查与结果 | 证明范围 |
| --- | --- | --- |
| 原有证据 | 95 份来源摘要仍匹配，未自动重写旧基线 | 原有源码／文档／选定产物未漂移，不证明 src 与 lib 逐项等价 |
| 全部文档 | 递归检查 20 份 Markdown；本地文件链接、显式／标题锚点、围栏、折叠答案和编码通过 | 含 labs 子目录；即时链接数量以 verify 输出为准 |
| 图表 | 12 个 Mermaid 图表用现有 Mermaid 12.2.0＋jsdom 16.7.0 解析通过 | 语法通过，未做所有阅读器中的图表排版验收 |
| 原有教学示例 | 从第 00、04 章正文直接提取并运行，2 项输出断言通过 | Proxy 教学模型与 URL 字符串示例；不是引擎运行测试 |
| 新异步模型 | 5 项 Node 测试通过 | 反例、代次修正、退出后迟到、多实例独立、失败传播；不执行真实网络取消 |
| 实验服务 | 4 项 HTTP 合同测试通过 | 主／子页面、真实引擎字节与摘要、MIME、白名单、方法、路径与端口处理 |
| 文档检查器 | 3 项针对性回归通过 | 嵌套相对路径、Unicode／显式锚点、围栏里的假链接、错误折叠结构 |
| 真实引擎实验 | Headless Edge `139.0.3405.102`，7 项检查通过 | 本机同源、经典脚本、UMD 样本，with 与 iframe；详见下一节 |
| 页面呈现 | 查看 1440px 桌面截图；检查 390px 页面无横向溢出 | 教学实验台的基本可读布局，不扩大到手册站点、所有移动交互或辅助技术 |
| 交叉审阅 | 架构与学习体验分开审阅再复核 | 补齐两道迁移题的答案，统一代次编号，核对正文与实验按钮／字段 |

12 项 Node 测试是三个独立范围的总和（5＋4＋3），没有把“找不到核心测试”算作通过。

## 2. 真实浏览器的七项结果

结果文件：[browser-smoke.json](evidence/browser-smoke.json)。页面截图：[lab-desktop.png](evidence/lab-desktop.png)。浏览器使用新建临时配置，不读取日常登录态；结束后关闭并清理其临时配置。

1. 用页面按钮挂载 with 的 A/B：普通全局标记各属自己，同名根节点查询命中各自容器，宿主没有该普通标记。
2. 点击子应用按钮同步 dispatch 两次：宿主本次只观察到一份含 first/second 的合并状态。
3. 点击内部导航：A 子路径变成 `/chapter/2`，真实 URL 含 A 的 search 投影。
4. 隐藏／恢复：A 按自身逻辑暂停计时，B 继续；A 恢复后 mount 次数不增加，活动列表与可见列表可区分。
5. UMD 普通卸载再挂载、随后 destroy：mount／cleanup 次数符合操作；销毁后引擎列表不含 A。
6. 改为 iframe 经典脚本新建 A：Array 构造器与宿主不同，可见根仍在主页面 A 容器中，B 保留。
7. 390px 窄屏：文档宽度未超过视口，没有横向页面溢出。

这次执行的引擎 SHA-256 为 `829eaccf60a65140e46204c79d92f1d742e0c69c7b73d93b2420803c002ea26a`，与当前本地 `lib/index.esm.js` 一致。报告由检查脚本记录浏览器版本、实际产物与执行时间；后续重跑会更新报告。

### 实验环境中发现并解决的一项问题

首次浏览器运行时，子应用加载超时。排查发现当前 lib 是含 `process.env.NODE_ENV` 条件的 bundler ESM，不能把它当成完全不需宿主准备的浏览器模块。实验页现已在模块加载前显式提供该环境字段，并在 UI、README 和报告中说明；**没有修改引擎字节，也没有重建 lib**。重跑后七项通过。这是教学环境适配，不是框架缺陷修复。

## 3. 怎样重跑

基础结构、来源与原有示例检查：

```powershell
node microfrontend-handbook/scripts/verify.mjs
```

教学模型、服务和文档检查器测试：

```powershell
node --test microfrontend-handbook/examples/pending-result.test.mjs microfrontend-handbook/labs/server.test.mjs microfrontend-handbook/scripts/markdown-check.test.mjs
```

可选 Mermaid 检查，复用工作区现有依赖，不自动安装：

```powershell
node microfrontend-handbook/scripts/check-diagrams.mjs
```

真实浏览器检查会自行启动临时端口的实验服务与独立 Headless 浏览器，结束后关闭，不要求先启动 4318：

```powershell
node microfrontend-handbook/scripts/check-lab-browser.mjs
```

脚本寻找本地 Edge／Chrome／Chromium；其他安装位置可设置 `HANDBOOK_BROWSER` 为可执行文件绝对路径。缺少浏览器会明确失败，不退回教学模型冒充浏览器结果。浏览器执行机制采用 [Chrome Headless](https://developer.chrome.com/docs/automation-and-testing/headless) 与 [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/)；这两份资料只用于测试工具，不作为 MicroApp 行为来源。

源码发生变化而 sources 检查失败时，先复核相关正文和用例，再更新对应摘要，不能为了通过检查而盲刷全部基线。

## 4. 尚未验证与明确边界

- 真实 Freelog 节点、主题／依赖插件、SDK 初始化、开发替换、内容与授权。
- 原生 ES Module、Vite 生产产物、跨源 CORS／凭据、CDN 与平台文件服务。
- state／pure／native 的完整对照，后退／前进／硬刷新／分享恢复矩阵。
- 无 UMD 钩子的 default 模式、capture 监听疑点、预渲染、长连接和内存压力。
- 其他浏览器、真实移动设备、完整键盘／屏幕阅读器测试、每种 Markdown 阅读器的折叠和 Mermaid 呈现。
- 第 10 章静态风险的真实平台复现及修复。新增教学模型没有把它们提升为线上事故结论。
- packages 的 lint／typecheck／build／核心回归；本轮未修改业务 TS，也没有通过重建修改 lib/polyfill。

本地核心 `src/__tests__` 缺失的事实仍然成立。此目录新增的实验和测试提供学习反馈，不能替代恢复上游核心测试与真实消费者验证。

## 5. 第一版证据如何保留

第一版已经完成的平台正文、官方新地址、固定 rc.8 tag 与 npm 交叉核对仍在第 01、12 章，原有 95 份来源摘要未改。本次再次检查它们没有漂移；没有把旧检索伪装成一次全新的上游状态调查。

第二版的结构与责任范围见 [修订方案](REVISION-PLAN.md)，学习与独立验收见 [第 14 章](14-自测答案与进阶挑战.md)。

[返回学习入口](README.md)

</details>
